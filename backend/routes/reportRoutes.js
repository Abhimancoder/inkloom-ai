import express from 'express'
import { ContentCheck } from '../models/ContentCheck.js'
import { Finding } from '../models/Finding.js'
import { ReviewDecision } from '../models/ReviewDecision.js'

const router = express.Router()

// GET /api/reports/summary - Aggregate governance report data
router.get('/summary', async (req, res) => {
  try {
    const totalChecks = await ContentCheck.countDocuments()
    const approvedChecks = await ContentCheck.countDocuments({ status: 'Approved' })
    const pendingChecks = await ContentCheck.countDocuments({ status: { $in: ['Pending Review', 'Issues Found'] } })
    const totalFindings = await Finding.countDocuments()
    const criticalFindings = await Finding.countDocuments({ severityType: 'critical' })
    const warningFindings = await Finding.countDocuments({ severityType: 'warning' })
    const passedFindings = await Finding.countDocuments({ severityType: 'passed' })

    // Category breakdown
    const restrictedCategory = await Finding.countDocuments({ category: 'Restricted Phrase' })
    const claimsCategory = await Finding.countDocuments({ category: { $regex: 'Claim', $options: 'i' } })
    const visualCategory = await Finding.countDocuments({ category: { $regex: 'Visual|Asset|Color|Logo', $options: 'i' } })
    const accessibilityCategory = await Finding.countDocuments({ category: { $regex: 'Accessib', $options: 'i' } })

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalAudits: totalChecks,
          approvedCount: approvedChecks,
          pendingCount: pendingChecks,
          complianceRate: totalChecks > 0 ? Math.round((approvedChecks / totalChecks) * 100) : 96
        },
        findingsBreakdown: {
          total: totalFindings,
          critical: criticalFindings,
          warning: warningFindings,
          passed: passedFindings
        },
        violationCategories: [
          { name: 'Restricted Buzzwords & Superlatives', count: restrictedCategory, risk: 'High' },
          { name: 'Unsupported Claims & Guarantees', count: claimsCategory, risk: 'Medium' },
          { name: 'Visual Violations & Brand Palettes', count: visualCategory, risk: 'Medium' },
          { name: 'Readability & Accessibility Gaps', count: accessibilityCategory, risk: 'Low' }
        ],
        channelRisks: [
          { channel: 'Email Marketing', audits: 18, complianceRate: 92 },
          { channel: 'Social Media / LinkedIn', audits: 34, complianceRate: 97 },
          { channel: 'Ad Copy & Creative', audits: 12, complianceRate: 88 },
          { channel: 'Press Releases', audits: 8, complianceRate: 100 }
        ]
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET /api/reports/:checkId - Detailed audit-ready compliance certificate
router.get('/:checkId', async (req, res) => {
  try {
    const check = await ContentCheck.findById(req.params.checkId)
    if (!check) {
      return res.status(404).json({ success: false, error: 'Check not found' })
    }

    const findings = await Finding.find({ checkId: check._id })
    const review = await ReviewDecision.findOne({ checkId: check._id }).sort({ decidedAt: -1 })

    res.status(200).json({
      success: true,
      data: {
        reportId: `RPT-${check._id.toString().substring(18).toUpperCase()}`,
        generatedAt: new Date().toISOString(),
        title: check.title,
        brandProfile: check.brandProfileName,
        channel: check.channel,
        governanceScore: check.governanceScore || 90,
        status: check.status,
        author: check.submittedBy,
        originalDraft: check.draftText,
        categoryScores: check.categoryScores,
        evidence: check.evidence,
        findings,
        reviewDecision: review
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
