import mongoose from 'mongoose'

// ================================================================
// INKLOOM AI — APPROVED COPY LIBRARY MODEL (ROUND 3 RAG CORPUS)
// ================================================================
// Only records with isApproved: true are indexed for RAG retrieval.
// Rejected, draft, or unreviewed content is strictly excluded.

const ApprovedCopySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Copy title or campaign name is required'],
      trim: true
    },
    brandProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BrandProfile',
      required: [true, 'Brand profile association is required']
    },
    brandProfileName: {
      type: String,
      default: 'TechCorp Enterprise'
    },
    channel: {
      type: String,
      enum: ['Email Marketing', 'Social Media', 'Blog Post', 'Press Release', 'Ad Copy', 'Executive Speech', 'General'],
      default: 'General'
    },
    contentType: {
      type: String,
      enum: ['Headline', 'Body Copy', 'Value Proposition', 'Call to Action', 'Disclaimer'],
      default: 'Body Copy'
    },
    approvedText: {
      type: String,
      required: [true, 'Approved copy text is required']
    },
    tags: {
      type: [String],
      default: []
    },
    performanceNotes: {
      type: String,
      default: 'High-performing approved enterprise messaging'
    },
    isApproved: {
      type: Boolean,
      default: true // Enforces that only approved text enters retrieval
    },
    approvedBy: {
      type: String,
      default: 'Brand Governance Lead'
    }
  },
  {
    timestamps: true
  }
)

// Index for fast brand-isolated retrieval
ApprovedCopySchema.index({ brandProfileId: 1, isApproved: 1 })

export const ApprovedCopy = mongoose.model('ApprovedCopy', ApprovedCopySchema)
