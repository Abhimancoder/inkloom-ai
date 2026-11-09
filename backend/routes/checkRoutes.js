import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { ContentCheck } from '../models/ContentCheck.js'
import { Finding } from '../models/Finding.js'
import { BrandProfile } from '../models/BrandProfile.js'
import { runDeterministicAudit } from '../services/auditService.js'
import { auditVisualAsset } from '../services/visualAuditService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDir = path.join(__dirname, '../uploads')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// ================================================================
// SECURE MULTER UPLOAD CONFIGURATION (PHASE M8 / ROUND 3)
// ================================================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    // Generate safe, unguessable filename without path traversal risk
    const ext = path.extname(file.originalname).toLowerCase()
    const safeName = `asset-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
    cb(null, safeName)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
  const ext = path.extname(file.originalname).toLowerCase()
  const allowedExts = ['.png', '.jpg', '.jpeg', '.webp']

  if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error('Unsupported file format. Please upload a PNG, JPG, or WEBP image asset.'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB maximum limit
  }
})

const router = express.Router()

// GET /api/checks - List all checks with totals
router.get('/', async (req, res) => {
  try {
    const checks = await ContentCheck.find().sort({ createdAt: -1 })
    res.status(200).json({ success: true, count: checks.length, data: checks })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// POST /api/checks - Submit draft & execute unified text + visual audit
router.post('/', upload.single('asset'), async (req, res) => {
  try {
    const { title, channel, brandProfileId, submittedBy, draftText } = req.body

    if (!draftText || !draftText.trim()) {
      return res.status(400).json({ success: false, error: 'Draft content text is required' })
    }

    // 1. Look up target brand profile
    let profile = null
    if (brandProfileId && mongoose.isValidObjectId(brandProfileId)) {
      profile = await BrandProfile.findById(brandProfileId)
    }
    if (!profile) {
      profile = await BrandProfile.findOne()
    }

    // 2. Guaranteed Baseline: Run deterministic text audit
    const deterministicResults = runDeterministicAudit(draftText, profile)
    let combinedFindings = [...deterministicResults.findings]
    let nlpMetrics = null

    // 3. Optional Phase M7: Call Python NLP Microservice (with graceful fallback)
    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: draftText,
          targetTone: profile?.tone || 'Professional'
        }),
        signal: AbortSignal.timeout(1500)
      })

      if (response.ok) {
        const nlpData = await response.json()
        if (nlpData?.nlpFindings) {
          combinedFindings = [...combinedFindings, ...nlpData.nlpFindings]
          nlpMetrics = nlpData.metrics
          console.log(`[Inkloom Backend] ✅ Python NLP service responded (Score: ${nlpData.governanceScore}/100)`)
        }
      }
    } catch (nlpErr) {
      console.log(`[Inkloom Backend] ℹ️ Python NLP service offline. Using deterministic rule engine as fallback.`)
    }

    // 4. Round 3 Improvement 1: Multi-Modal Visual Asset Audit
    let visualResult = null
    let assetMetadata = {
      assetUrl: null,
      assetOriginalName: null,
      assetMimeType: null,
      assetSize: null,
      assetColorPalette: [],
      assetContrastRatio: null,
      assetContrastPass: null
    }

    if (req.file) {
      try {
        console.log(`[Inkloom Backend] 🖼️ Analyzing uploaded visual asset: ${req.file.originalname}`)
        visualResult = await auditVisualAsset(req.file.path, profile, {
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size
        })

        if (visualResult?.findings) {
          combinedFindings = [...combinedFindings, ...visualResult.findings]
        }

        assetMetadata = {
          assetUrl: `/uploads/${path.basename(req.file.path)}`,
          assetOriginalName: req.file.originalname,
          assetMimeType: req.file.mimetype,
          assetSize: req.file.size,
          assetColorPalette: visualResult?.extractedPalette || [],
          assetContrastRatio: visualResult?.contrast?.ratio || null,
          assetContrastPass: visualResult?.contrast?.passes ?? null
        }
        console.log(`[Inkloom Backend] ✅ Visual audit completed. Extracted ${visualResult?.extractedPalette?.length || 0} colors.`)
      } catch (visErr) {
        console.warn('[Inkloom Backend] Visual asset audit error:', visErr.message)
      }
    }

    // Recalculate unified summary counts (text + visual)
    const criticalCount = combinedFindings.filter((f) => f.severityType === 'critical').length
    const warningCount = combinedFindings.filter((f) => f.severityType === 'warning').length
    const passedCount = combinedFindings.filter((f) => f.severityType === 'passed').length

    let status = 'Approved'
    let statusType = 'passed'

    if (criticalCount > 0) {
      status = 'Issues Found'
      statusType = 'critical'
    } else if (warningCount > 0) {
      status = 'Pending Review'
      statusType = 'warning'
    }

    // 5. Save ContentCheck in MongoDB
    const newCheck = await ContentCheck.create({
      title: title || 'Untitled Content Check',
      channel: channel || 'Email Marketing',
      brandProfileId: profile?._id,
      brandProfileName: profile?.name || 'Standard Brand Guidelines',
      submittedBy: submittedBy || 'Content Author',
      status,
      statusType,
      criticalCount,
      warningCount,
      passedCount,
      draftText,
      ...assetMetadata
    })

    // 6. Save each individual Finding in MongoDB
    const findingsWithCheckId = combinedFindings.map((f) => ({
      ...f,
      checkId: newCheck._id
    }))

    const savedFindings = await Finding.insertMany(findingsWithCheckId)

    res.status(201).json({
      success: true,
      data: {
        check: newCheck,
        findings: savedFindings,
        nlpMetrics,
        visualAnalysis: visualResult
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET /api/checks/:id - Get specific check with all its findings
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ success: false, error: 'Content check not found' })
    }
    const check = await ContentCheck.findById(req.params.id)
    if (!check) {
      return res.status(404).json({ success: false, error: 'Content check not found' })
    }

    const findings = await Finding.find({ checkId: check._id })

    res.status(200).json({
      success: true,
      data: {
        check,
        findings
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
