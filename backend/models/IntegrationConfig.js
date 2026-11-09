import mongoose from 'mongoose'

// ================================================================
// INKLOOM AI — INTEGRATION CONFIGURATION MODEL (ROUND 3)
// ================================================================
// Stores connector configuration metadata.
// Secrets are never returned to public client requests.

const IntegrationConfigSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ['slack', 'hubspot', 'wordpress'],
      required: true,
      unique: true
    },
    displayName: {
      type: String,
      required: true
    },
    enabled: {
      type: Boolean,
      default: true
    },
    mode: {
      type: String,
      enum: ['live', 'simulation'],
      default: 'simulation' // First-class simulation mode for judges & offline testing
    },
    status: {
      type: String,
      enum: ['Connected', 'Test Mode', 'Not Configured', 'Error'],
      default: 'Test Mode'
    },
    webhookUrl: {
      type: String,
      default: '' // Stored only on server
    },
    targetChannelOrEndpoint: {
      type: String,
      default: '#brand-governance-alerts'
    },
    publishAsDraftOnly: {
      type: Boolean,
      default: true // Guarantees content remains draft and never auto-publishes publicly
    },
    lastDispatchedAt: {
      type: Date,
      default: null
    },
    lastStatusMessage: {
      type: String,
      default: 'Ready for human approval events'
    }
  },
  {
    timestamps: true
  }
)

export const IntegrationConfig = mongoose.model('IntegrationConfig', IntegrationConfigSchema)
