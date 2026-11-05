import express from 'express'
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

// POST /api/checks - Submit draft & execute deterministic brand audit
router.post('/', async (req, res) => {
  try {
    const { title, channel, brandProfileId, submittedBy, draftText } = req.body

    if (!draftText || !draftText.trim()) {
      return res.status(400).json({ success: false, error: 'Draft content text is required' })
    }

    // Look up target brand profile
    let profile = null
    if (brandProfileId) {
      profile = await BrandProfile.findById(brandProfileId)
    }

    // Fallback to first profile if not specified
    if (!profile) {
      profile = await BrandProfile.findOne()
    }

    // Run the deterministic audit engine
    const auditResults = runDeterministicAudit(draftText, profile)

    // Save ContentCheck in MongoDB
    const newCheck = await ContentCheck.create({
      title: title || 'Untitled Content Check',
      channel: channel || 'Email Marketing',
      brandProfileId: profile?._id,
      brandProfileName: profile?.name || 'Standard Brand Guidelines',
      submittedBy: submittedBy || 'Content Author',
      status: auditResults.status,
      statusType: auditResults.statusType,
      criticalCount: auditResults.criticalCount,
      warningCount: auditResults.warningCount,
      passedCount: auditResults.passedCount,
      draftText
    })

    // Save each individual Finding in MongoDB linked to this check
    const findingsWithCheckId = auditResults.findings.map((f) => ({
      ...f,
      checkId: newCheck._id
    }))

    const savedFindings = await Finding.insertMany(findingsWithCheckId)

    res.status(201).json({
      success: true,
      data: {
        check: newCheck,
        findings: savedFindings
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET /api/checks/:id - Get specific check with all its findings
router.get('/:id', async (req, res) => {
  try {
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
