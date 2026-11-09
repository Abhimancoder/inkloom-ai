import express from 'express'
import { IntegrationConfig } from '../models/IntegrationConfig.js'
import { WebhookEvent } from '../models/WebhookEvent.js'
import { ensureDefaultIntegrationConfigs } from '../services/webhookService.js'

const router = express.Router()

// GET /api/integrations - Get status of all connectors
router.get('/', async (req, res) => {
  try {
    await ensureDefaultIntegrationConfigs()
    const configs = await IntegrationConfig.find().sort({ provider: 1 })

    // Hide secret tokens/keys from public frontend responses
    const safeConfigs = configs.map((c) => ({
      provider: c.provider,
      displayName: c.displayName,
      enabled: c.enabled,
      mode: c.mode,
      status: c.status,
      targetChannelOrEndpoint: c.targetChannelOrEndpoint,
      publishAsDraftOnly: c.publishAsDraftOnly,
      lastDispatchedAt: c.lastDispatchedAt,
      lastStatusMessage: c.lastStatusMessage,
      hasWebhookUrl: Boolean(c.webhookUrl)
    }))

    res.status(200).json({ success: true, data: safeConfigs })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// PUT /api/integrations/:provider - Update provider configuration
router.put('/:provider', async (req, res) => {
  try {
    const { provider } = req.params
    const { enabled, mode, webhookUrl, targetChannelOrEndpoint } = req.body

    const updateFields = {}
    if (typeof enabled === 'boolean') updateFields.enabled = enabled
    if (mode) {
      updateFields.mode = mode
      updateFields.status = mode === 'live' ? 'Connected' : 'Test Mode'
    }
    if (typeof webhookUrl === 'string') {
      updateFields.webhookUrl = webhookUrl
      if (webhookUrl) updateFields.status = 'Connected'
    }
    if (targetChannelOrEndpoint) updateFields.targetChannelOrEndpoint = targetChannelOrEndpoint

    const updated = await IntegrationConfig.findOneAndUpdate(
      { provider },
      updateFields,
      { new: true }
    )

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Integration provider not found' })
    }

    res.status(200).json({
      success: true,
      data: {
        provider: updated.provider,
        displayName: updated.displayName,
        enabled: updated.enabled,
        mode: updated.mode,
        status: updated.status,
        targetChannelOrEndpoint: updated.targetChannelOrEndpoint,
        publishAsDraftOnly: updated.publishAsDraftOnly
      }
    })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

// GET /api/integrations/events - Get audit trail of recent webhook dispatch events
router.get('/events', async (req, res) => {
  try {
    const events = await WebhookEvent.find().sort({ dispatchedAt: -1 }).limit(20)
    res.status(200).json({ success: true, count: events.length, data: events })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
