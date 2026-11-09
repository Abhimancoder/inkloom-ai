import express from 'express'
import mongoose from 'mongoose'
import { ReviewDecision } from '../models/ReviewDecision.js'
import { ContentCheck } from '../models/ContentCheck.js'
import { triggerApprovalWebhooks } from '../services/webhookService.js'

const router = express.Router()

// GET /api/reviews - Get history of recorded human review decisions
router.get('/', async (req, res) => {
  try {
    const reviews = await ReviewDecision.find()
      .populate('checkId', 'title channel brandProfileName status')
      .sort({ decidedAt: -1 })

    res.status(200).json({ success: true, count: reviews.length, data: reviews })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// POST /api/reviews - Record a human reviewer decision & dispatch approval webhooks
router.post('/', async (req, res) => {
  try {
    const { checkId, decision, reviewerName, reviewerNotes } = req.body

    if (!checkId || !decision) {
      return res.status(400).json({
        success: false,
        error: 'checkId and decision (Approved, Changes Requested, Dismissed) are required'
      })
    }

    let check = null
    if (mongoose.isValidObjectId(checkId)) {
      check = await ContentCheck.findById(checkId)
    }

    // Fallback mock check if offline/demo
    if (!check) {
      check = {
        _id: checkId,
        title: 'Brand Marketing Content Check',
        channel: 'Email Marketing',
        brandProfileName: 'TechCorp Enterprise'
      }
    }

    // STRICT HUMAN GATE:
    // If decision === 'Approved', trigger Slack/CMS webhooks!
    let webhookResults = null
    if (decision === 'Approved') {
      webhookResults = await triggerApprovalWebhooks({
        check,
        decision,
        reviewerName: reviewerName || 'Human Reviewer',
        reviewerNotes: reviewerNotes || ''
      })
      console.log(`[Inkloom Backend] 🚀 Approval webhooks dispatched for "${check.title}":`, webhookResults)
    }

    // If checkId is a local/mock ID (from offline mode), return graceful response
    if (!mongoose.isValidObjectId(checkId)) {
      return res.status(200).json({
        success: true,
        message: `Content check marked as ${decision}`,
        data: {
          checkId,
          decision,
          reviewerName: reviewerName || 'Human Reviewer',
          reviewerNotes: reviewerNotes || '',
          webhookResults
        }
      })
    }

    // Save reviewer decision in MongoDB
    const newDecision = await ReviewDecision.create({
      checkId,
      decision,
      reviewerName: reviewerName || 'Human Reviewer',
      reviewerNotes: reviewerNotes || ''
    })

    // Update parent check's status in ContentCheck
    let newStatus = 'Pending Review'
    let newStatusType = 'warning'

    if (decision === 'Approved') {
      newStatus = 'Approved'
      newStatusType = 'passed'
    } else if (decision === 'Changes Requested') {
      newStatus = 'Changes Requested'
      newStatusType = 'critical'
    } else if (decision === 'Dismissed') {
      newStatus = 'Dismissed'
      newStatusType = 'warning'
    }

    await ContentCheck.findByIdAndUpdate(checkId, {
      status: newStatus,
      statusType: newStatusType
    })

    res.status(201).json({
      success: true,
      message: `Content check marked as ${decision}`,
      data: newDecision,
      webhookResults
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
