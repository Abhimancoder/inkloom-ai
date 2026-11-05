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
    }
  },
  {
    timestamps: true
  }
)

export const BrandProfile = mongoose.model('BrandProfile', BrandProfileSchema)
