import express from 'express'
import axios from 'axios'
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

    // 1. Look up target brand profile
    let profile = null
    if (brandProfileId) {
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
      const nlpResponse = await axios.post(
        'http://localhost:8000/analyze',
        {
          content: draftText,
          targetTone: profile?.tone || 'Professional'
        },
        { timeout: 1500 }
      )

      if (nlpResponse.data?.nlpFindings) {
        combinedFindings = [...combinedFindings, ...nlpResponse.data.nlpFindings]
        nlpMetrics = nlpResponse.data.metrics
        console.log(`[Inkloom Backend] ✅ Python NLP service responded (Score: ${nlpResponse.data.governanceScore}/100)`)
      }
    } catch (nlpErr) {
      // Graceful Fallback: System continues without interruption
      console.log(`[Inkloom Backend] ℹ️ Python NLP service offline/unreachable (${nlpErr.message}). Using deterministic rule engine as fallback.`)
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
      draftText,
      governanceScore: deterministicResults.governanceScore || 90,
      categoryScores: deterministicResults.categoryScores,
      evidence: deterministicResults.evidence,
      visualAssets: req.body.visualAssets || [],
      readabilityMetrics: deterministicResults.readabilityMetrics
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
