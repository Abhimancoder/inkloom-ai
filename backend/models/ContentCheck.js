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
    governanceScore: {
      type: Number,
      default: 90
    },
    categoryScores: {
      logoUsage: { type: String, default: 'Passed' },
      colorCompliance: { type: String, default: 'Passed' },
      typography: { type: String, default: 'Passed' },
      messaging: { type: String, default: 'Passed' },
      imageStyle: { type: String, default: 'Passed' },
      accessibility: { type: String, default: 'Passed' }
    },
    evidence: {
      colorsFound: { type: [String], default: [] },
      typographyUsed: { type: String, default: 'Sans-Serif' },
      messagingTone: { type: String, default: 'Professional' },
      imageryTags: { type: [String], default: [] }
    },
    visualAssets: [
      {
        fileName: { type: String },
        url: { type: String },
        caption: { type: String },
        fileType: { type: String, default: 'image' },
        complianceStatus: { type: String, default: 'Compliant' }
      }
    ],
    readabilityMetrics: {
      readingEaseScore: { type: Number, default: 65 },
      readabilityLabel: { type: String, default: 'Standard / Accessible' },
      wordCount: { type: Number, default: 0 },
      sentenceCount: { type: Number, default: 0 },
      shannonEntropy: { type: Number, default: 4.2 },
      typeTokenRatio: { type: Number, default: 0.75 },
      fleschKincaidGrade: { type: Number, default: 8.5 }
    },
    // Data Science & Machine Learning Enhancements
    mlInsights: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    visualAnalytics: {
      toneDistributionChart: { type: String, default: null },
      sentenceDistributionChart: { type: String, default: null }
    }
  },
  {
    timestamps: true
  }
)

export const ContentCheck = mongoose.model('ContentCheck', ContentCheckSchema)
