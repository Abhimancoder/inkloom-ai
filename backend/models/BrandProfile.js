import mongoose from 'mongoose'

const BrandProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand profile name is required'],
      trim: true
    },
    industry: {
      type: String,
      default: 'General'
    },
    status: {
      type: String,
      enum: ['Active', 'Draft', 'Archived'],
      default: 'Active'
    },
    tone: {
      type: String,
      default: 'Professional, clear, trustworthy'
    },
    restrictedPhrases: {
      type: [String],
      default: []
    },
    requiredTerms: {
      type: [String],
      default: []
    },
    approvedClaims: {
      type: [String],
      default: []
    },
    visualGuidance: {
      type: String,
      default: ''
    },
<<<<<<< HEAD
    brandColors: [
      {
        name: { type: String, default: 'Primary' },
        hex: { type: String, required: true },
        role: { type: String, default: 'Primary' }
      }
    ],
    typography: {
      primaryFont: { type: String, default: 'Inter, system-ui, sans-serif' },
      secondaryFont: { type: String, default: 'Georgia, serif' },
      minHeadingSize: { type: String, default: '24px' },
      guidance: { type: String, default: 'Modern high-contrast sans-serif for UI and documentation.' }
    },
    logoGuidance: {
      minClearSpace: { type: String, default: '24px padding around logo' },
      minWidthPx: { type: Number, default: 120 },
      forbiddenUsages: { type: [String], default: ['Do not stretch or distort', 'Do not place on low-contrast backgrounds'] },
      logoUrl: { type: String, default: '' }
    },
    imageryGuidelines: {
      styleTags: { type: [String], default: ['Clean', 'Professional', 'Minimalist', 'Data-driven'] },
      forbiddenThemes: { type: [String], default: ['Low resolution', 'Generic stock clip art', 'Misleading statistics'] }
=======
    // Round 3 Improvement 1: Multi-Modal Visual Governance Fields
    approvedPalette: {
      type: [String],
      default: ['#142B4A', '#176B59', '#F5F7FA', '#FFFFFF', '#202833', '#C62828', '#B7791F', '#2E7D32']
    },
    primaryColor: {
      type: String,
      default: '#142B4A'
    },
    secondaryColor: {
      type: String,
      default: '#176B59'
    },
    backgroundColor: {
      type: String,
      default: '#F5F7FA'
    },
    contrastTarget: {
      type: Number,
      default: 4.5
    },
    contrastLevel: {
      type: String,
      enum: ['AA', 'AAA'],
      default: 'AA'
    },
    logoReferenceUrl: {
      type: String,
      default: ''
    },
    clearSpaceRule: {
      type: String,
      default: '0.5x minimum clear space around logo mark'
>>>>>>> faa97547145795a42e32a147158687ca4b3a25bc
    }
  },
  {
    timestamps: true
  }
)

export const BrandProfile = mongoose.model('BrandProfile', BrandProfileSchema)
