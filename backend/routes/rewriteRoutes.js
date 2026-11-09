import express from 'express'
import mongoose from 'mongoose'
import { BrandProfile } from '../models/BrandProfile.js'
import { generateContextualRewrite } from '../services/ragRewriteService.js'

const router = express.Router()

// POST /api/rewrites/generate - Generate contextual RAG rewrite using approved brand library
router.post('/generate', async (req, res) => {
  try {
    const { originalSentence, brandProfileId, matchedRule, explanation, userInstruction } = req.body

    if (!originalSentence || !originalSentence.trim()) {
      return res.status(400).json({ success: false, error: 'Original sentence or excerpt is required for rewrite' })
    }

    // 1. Look up target brand profile
    let profile = null
    if (brandProfileId && mongoose.isValidObjectId(brandProfileId)) {
      profile = await BrandProfile.findById(brandProfileId)
    }
    if (!profile) {
      profile = await BrandProfile.findOne()
    }

    // 2. Execute RAG Retrieval & Contextual Rewriting
    const rewriteResult = await generateContextualRewrite({
      originalSentence,
      brandProfile: profile,
      matchedRule,
      explanation,
      userInstruction
    })

    res.status(200).json({
      success: true,
      data: rewriteResult
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
