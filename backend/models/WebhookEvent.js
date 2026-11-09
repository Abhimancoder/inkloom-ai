import mongoose from 'mongoose'

// ================================================================
// INKLOOM AI — WEBHOOK EVENT & AUDIT LOG MODEL (ROUND 3)
// ================================================================

const WebhookEventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true
    },
    idempotencyKey: {
      type: String,
      required: true,
      index: true // Prevents duplicate delivery if approved multiple times
    },
    checkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContentCheck',
      required: false
    },
    checkTitle: {
      type: String,
      default: 'Brand Content Check'
    },
    brandProfileName: {
      type: String,
      default: 'TechCorp Enterprise'
    },
    provider: {
      type: String,
      enum: ['slack', 'hubspot', 'wordpress'],
      required: true
    },
    triggerAction: {
      type: String,
      default: 'Approved' // Strictly triggered ONLY upon human approval
    },
    status: {
      type: String,
      enum: ['Delivered', 'Simulated', 'Failed', 'Pending'],
      default: 'Pending'
    },
    attempts: {
      type: Number,
      default: 1
    },
    reviewerName: {
      type: String,
      default: 'Human Reviewer'
    },
    reviewerNotes: {
      type: String,
      default: ''
    },
    summaryData: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    responseSummary: {
      type: String,
      default: ''
    },
    dispatchedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

export const WebhookEvent = mongoose.model('WebhookEvent', WebhookEventSchema)
