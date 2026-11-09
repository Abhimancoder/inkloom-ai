import mongoose from 'mongoose'

const ContentCheckSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Check title is required'],
      trim: true
    },
    channel: {
      type: String,
      required: [true, 'Content channel is required'],
      default: 'Email Marketing'
    },
    brandProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BrandProfile',
      required: false
    },
    brandProfileName: {
      type: String,
      default: 'Standard Brand Profile'
    },
    submittedBy: {
      type: String,
      default: 'Content Author'
    },
    status: {
      type: String,
      enum: ['Issues Found', 'Pending Review', 'Approved', 'Changes Requested', 'Dismissed'],
      default: 'Pending Review'
    },
    statusType: {
      type: String,
      enum: ['critical', 'warning', 'passed'],
      default: 'warning'
    },
    criticalCount: {
      type: Number,
      default: 0
    },
    warningCount: {
      type: Number,
      default: 0
    },
    passedCount: {
      type: Number,
      default: 0
    },
    draftText: {
      type: String,
      required: [true, 'Draft content text is required']
    },
    // Round 3 Improvement 1: Multi-Modal Visual Asset Metadata
    assetUrl: {
      type: String,
      default: null
    },
    assetOriginalName: {
      type: String,
      default: null
    },
    assetMimeType: {
      type: String,
      default: null
    },
    assetSize: {
      type: Number,
      default: null
    },
    assetColorPalette: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },
    assetContrastRatio: {
      type: Number,
      default: null
    },
    assetContrastPass: {
      type: Boolean,
      default: null
    }
  },
  {
    timestamps: true
  }
)

export const ContentCheck = mongoose.model('ContentCheck', ContentCheckSchema)
