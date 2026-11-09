import express from 'express'
import mongoose from 'mongoose'
import { ContentCheck } from '../models/ContentCheck.js'
import { Finding } from '../models/Finding.js'
import { BrandProfile } from '../models/BrandProfile.js'
import { runDeterministicAudit } from '../services/auditService.js'

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

// POST /api/checks - Submit draft & execute deterministic + optional Python NLP audit
router.post('/', async (req, res) => {
  try {
    const { title, channel, brandProfileId, submittedBy, draftText } = req.body

    if (!draftText || !draftText.trim()) {
      return res.status(400).json({ success: false, error: 'Draft content text is required' })
    }

    // 1. Look up target brand profile (safely handles custom or sample string IDs)
    let profile = null
    if (brandProfileId && mongoose.isValidObjectId(brandProfileId)) {
      profile = await BrandProfile.findById(brandProfileId)
    }
    if (!profile) {
      profile = await BrandProfile.findOne()
    }

    // 2. Guaranteed Baseline: Run deterministic audit
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
      // Graceful Fallback: System continues without interruption
      console.log(`[Inkloom Backend] ℹ️ Python NLP service offline. Using deterministic rule engine as fallback.`)
    }

    // Recalculate summary counts with any NLP findings included
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

    // 4. Save ContentCheck in MongoDB
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
      draftText
    })

    // 5. Save each individual Finding in MongoDB
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
        nlpMetrics
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
