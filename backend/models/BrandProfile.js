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
    }
  },
  {
    timestamps: true
  }
)

export const BrandProfile = mongoose.model('BrandProfile', BrandProfileSchema)
