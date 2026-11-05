import mongoose from 'mongoose'

const MonitoringScanSchema = new mongoose.Schema(
  {
    assetName: {
      type: String,
      required: true,
      trim: true
    },
    channel: {
      type: String,
      enum: ['Website Landing Page', 'Instagram Ads', 'LinkedIn Post', 'Email Campaign', 'Display Ad Banner', 'PDF Whitepaper'],
      required: true
    },
    urlOrIdentifier: {
      type: String,
      default: ''
    },
    brandProfileName: {
      type: String,
      default: 'Acme Corp'
    },
    complianceScore: {
      type: Number,
      default: 95
    },
    issuesDetected: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Compliant', 'Warning', 'Flagged Violation', 'Scanning'],
      default: 'Compliant'
    },
    lastScannedAt: {
      type: Date,
      default: Date.now
    },
    details: {
      type: String,
      default: 'Scheduled automated channel scan completed. All visual rules and terminology matched.'
    }
  },
  {
    timestamps: true
  }
)

export const MonitoringScan = mongoose.model('MonitoringScan', MonitoringScanSchema)
