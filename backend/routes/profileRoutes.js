import express from 'express'
import { BrandProfile } from '../models/BrandProfile.js'

const router = express.Router()

// GET /api/profiles - List all brand profiles
router.get('/', async (req, res) => {
  try {
    let profiles = await BrandProfile.find().sort({ createdAt: -1 })

    // Auto-seed default TechCorp if database is brand new
    if (profiles.length === 0) {
      const defaultProfile = await BrandProfile.create({
        name: 'TechCorp Enterprise',
        industry: 'Enterprise Software & Cloud',
        status: 'Active',
        tone: 'Professional, authoritative, customer-focused, innovative',
        restrictedPhrases: [
          'cheap',
          'guarantee',
          'best in class',
          'miracle',
          '100% bug-free',
          'revolutionary'
        ],
        requiredTerms: [
          'TechCorp Solutions',
          'enterprise-grade',
          'governance platform'
        ],
        approvedClaims: [
          'Trusted by 500+ enterprises worldwide',
          'SOC-2 Type II and ISO 27001 compliant',
          'Reduces review turnaround time by up to 60%'
        ],
        visualGuidance: 'Use dark navy (#142B4A) for primary surfaces. Always pair logo with clear minimum spacing.'
      })

      const startupProfile = await BrandProfile.create({
        name: 'StartupXYZ',
        industry: 'Fintech & Payments',
        status: 'Draft',
        tone: 'Friendly, transparent, empowering, simple',
        restrictedPhrases: ['no risk', 'free money', 'get rich', 'foolproof'],
        requiredTerms: ['StartupXYZ Pay', 'bank-grade encryption'],
        approvedClaims: ['Over $50M in secure transactions processed'],
        visualGuidance: 'Minimalist white cards, clean typography.'
      })

      profiles = [defaultProfile, startupProfile]
    }

    res.status(200).json({ success: true, data: profiles })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// POST /api/profiles - Create a brand profile
router.post('/', async (req, res) => {
  try {
    const {
      name,
      industry,
      tone,
      restrictedPhrases,
      requiredTerms,
      approvedClaims,
      visualGuidance,
      brandColors,
      typography,
      logoGuidance,
      imageryGuidelines
    } = req.body

    if (!name) {
      return res.status(400).json({ success: false, error: 'Brand name is required' })
    }

    const newProfile = await BrandProfile.create({
      name,
      industry: industry || 'General',
      tone: tone || 'Professional',
      restrictedPhrases: Array.isArray(restrictedPhrases) ? restrictedPhrases : [],
      requiredTerms: Array.isArray(requiredTerms) ? requiredTerms : [],
      approvedClaims: Array.isArray(approvedClaims) ? approvedClaims : [],
      visualGuidance: visualGuidance || '',
      brandColors: Array.isArray(brandColors) ? brandColors : [{ name: 'Primary', hex: '#142B4A', role: 'Primary' }],
      typography: typography || { primaryFont: 'Inter, sans-serif' },
      logoGuidance: logoGuidance || {},
      imageryGuidelines: imageryGuidelines || {}
    })

    res.status(201).json({ success: true, data: newProfile })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

// PUT /api/profiles/:id - Update an existing brand profile
router.put('/:id', async (req, res) => {
  try {
    const updated = await BrandProfile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Profile not found' })
    }

    res.status(200).json({ success: true, data: updated })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

export default router
