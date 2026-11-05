import mongoose from 'mongoose'

const FindingSchema = new mongoose.Schema(
  {
    checkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContentCheck',
      required: true
    },
    severity: {
      type: String,
      enum: ['Critical', 'Warning', 'Passed'],
      required: true
    },
    severityType: {
      type: String,
      enum: ['critical', 'warning', 'passed'],
      required: true
    },
    category: {
      type: String,
      required: true
    },
    excerpt: {
      type: String,
      required: true
    },
    matchedRule: {
      type: String,
      required: true
    },
    explanation: {
      type: String,
      required: true
    },
    confidence: {
      type: String,
      default: 'Deterministic Match (100%)'
    },
    suggestedCorrection: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ['Needs Review', 'Suggestion Accepted', 'Dismissed by User', 'Passed Check'],
      default: 'Needs Review'
    }
  },
  {
    timestamps: true
  }
)

export const Finding = mongoose.model('Finding', FindingSchema)
