import express from 'express'
import mongoose from 'mongoose'
import { ApprovedCopy } from '../models/ApprovedCopy.js'
import { BrandProfile } from '../models/BrandProfile.js'

const router = express.Router()

// GET /api/approved-copy - List approved copy library examples (brand-isolated)
router.get('/', async (req, res) => {
  try {
    const { brandProfileId } = req.query
    const query = { isApproved: true }

    if (brandProfileId && mongoose.isValidObjectId(brandProfileId)) {
      query.brandProfileId = brandProfileId
    }

    let records = await ApprovedCopy.find(query).sort({ createdAt: -1 })

    // Auto-seed baseline approved copy library if database is empty
    if (records.length === 0) {
      let defaultProfile = null
      if (brandProfileId && mongoose.isValidObjectId(brandProfileId)) {
        defaultProfile = await BrandProfile.findById(brandProfileId)
      }
      if (!defaultProfile) {
        defaultProfile = await BrandProfile.findOne()
      }

      if (defaultProfile) {
        const seedExamples = [
          {
            title: 'Enterprise Platform Value Proposition',
            brandProfileId: defaultProfile._id,
            brandProfileName: defaultProfile.name,
            channel: 'Email Marketing',
            contentType: 'Value Proposition',
            approvedText: 'TechCorp Solutions delivers an enterprise-grade governance platform engineered to significantly streamline compliance operations at competitive value.',
            tags: ['enterprise-grade', 'governance', 'value', 'turnaround'],
            performanceNotes: 'Approved Q3 enterprise copy with 42% email engagement rate',
            isApproved: true,
            approvedBy: 'Brand Director'
          },
          {
            title: 'SOC-2 Compliance & Security Standard',
            brandProfileId: defaultProfile._id,
            brandProfileName: defaultProfile.name,
            channel: 'Newsletter',
            contentType: 'Body Copy',
            approvedText: 'We are pleased to confirm full SOC-2 Type II and ISO 27001 compliance across all hosted clusters, trusted by 500+ enterprises worldwide.',
            tags: ['security', 'soc-2', 'iso-27001', 'compliance'],
            performanceNotes: 'Legal and compliance approved standard messaging',
            isApproved: true,
            approvedBy: 'Legal Counsel'
          },
          {
            title: 'Audit Turnaround Improvement Announcement',
            brandProfileId: defaultProfile._id,
            brandProfileName: defaultProfile.name,
            channel: 'Ad Copy',
            contentType: 'Body Copy',
            approvedText: 'Engineered to reduce manual review turnaround times by up to 60% without compromising brand accuracy or regulatory rigor.',
            tags: ['turnaround', 'efficiency', 'accuracy', '60%'],
            performanceNotes: 'Benchmark claim backed by verified customer case studies',
            isApproved: true,
            approvedBy: 'Product Marketing Lead'
          },
          {
            title: 'Pricing & Transparent Terms Statement',
            brandProfileId: defaultProfile._id,
            brandProfileName: defaultProfile.name,
            channel: 'General',
            contentType: 'Body Copy',
            approvedText: 'Our flexible enterprise tiers provide cost-effective operations with predictable, transparent billing and no surprise overage charges.',
            tags: ['pricing', 'cost-effective', 'transparent', 'enterprise'],
            performanceNotes: 'Approved replacement copy for superlative pricing claims',
            isApproved: true,
            approvedBy: 'Brand Governance Lead'
          }
        ]

        records = await ApprovedCopy.insertMany(seedExamples)
        console.log(`[Inkloom Backend] ✅ Auto-seeded ${records.length} Approved Copy Library examples`)
      }
    }

    res.status(200).json({ success: true, count: records.length, data: records })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// POST /api/approved-copy - Add newly approved brand copy to the library
router.post('/', async (req, res) => {
  try {
    const { title, brandProfileId, channel, contentType, approvedText, tags, performanceNotes } = req.body

    if (!title || !approvedText) {
      return res.status(400).json({ success: false, error: 'Title and approved text are required' })
    }

    let profile = null
    if (brandProfileId && mongoose.isValidObjectId(brandProfileId)) {
      profile = await BrandProfile.findById(brandProfileId)
    }
    if (!profile) {
      profile = await BrandProfile.findOne()
    }

    const newRecord = await ApprovedCopy.create({
      title,
      brandProfileId: profile?._id,
      brandProfileName: profile?.name || 'TechCorp Enterprise',
      channel: channel || 'General',
      contentType: contentType || 'Body Copy',
      approvedText,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : []),
      performanceNotes: performanceNotes || 'Verified brand messaging',
      isApproved: true,
      approvedBy: 'Human Brand Reviewer'
    })

    res.status(201).json({ success: true, data: newRecord })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

// DELETE /api/approved-copy/:id - Remove record from approved library
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ success: false, error: 'Record not found' })
    }
    const removed = await ApprovedCopy.findByIdAndDelete(req.params.id)
    if (!removed) {
      return res.status(404).json({ success: false, error: 'Record not found' })
    }
    res.status(200).json({ success: true, message: 'Approved copy deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
