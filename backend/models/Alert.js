import mongoose from 'mongoose'

const AlertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['critical', 'warning', 'info', 'success'],
      default: 'info'
    },
    channel: {
      type: String,
      default: 'Platform'
    },
    read: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

export const Alert = mongoose.model('Alert', AlertSchema)
