import mongoose from 'mongoose'

const ReviewDecisionSchema = new mongoose.Schema(
  {
    checkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContentCheck',
      required: true
    },
    decision: {
      type: String,
      enum: ['Approved', 'Changes Requested', 'Dismissed'],
      required: true
    },
    reviewerName: {
      type: String,
      default: 'Human Approver'
    },
    reviewerNotes: {
      type: String,
      default: ''
    },
    decidedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

export const ReviewDecision = mongoose.model('ReviewDecision', ReviewDecisionSchema)
