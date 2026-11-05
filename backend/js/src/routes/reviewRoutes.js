import express from 'express'
import { ReviewDecision } from '../models/ReviewDecision.js'
import { ContentCheck } from '../models/ContentCheck.js'

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

// POST /api/reviews - Record a human reviewer decision
router.post('/', async (req, res) => {
  try {
    const { checkId, decision, reviewerName, reviewerNotes } = req.body

    if (!checkId || !decision) {
      return res.status(400).json({
        success: false,
        error: 'checkId and decision (Approved, Changes Requested, Dismissed) are required'
      })
    }

    // Save reviewer decision
    const newDecision = await ReviewDecision.create({
      checkId,
      decision,
      reviewerName: reviewerName || 'Human Reviewer',
      reviewerNotes: reviewerNotes || ''
    })

    // Update the parent check's status in ContentCheck
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
      data: newDecision
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
