import express from 'express'
import { Alert } from '../models/Alert.js'

const router = express.Router()

// GET /api/alerts - List all alerts
router.get('/', async (req, res) => {
  try {
    let alerts = await Alert.find().sort({ createdAt: -1 }).limit(20)

    if (alerts.length === 0) {
      alerts = await Alert.create([
        {
          title: 'Ad Creative Flagged',
          message: 'Q4 Product Launch Ad Banner flagged for color contrast violation.',
          type: 'warning',
          channel: 'Display Ad Banner'
        },
        {
          title: 'Policy Guidelines Updated',
          message: 'Brand governance guidelines for Acme Corp updated with 2026 ESG claims.',
          type: 'info',
          channel: 'Guidelines'
        },
        {
          title: 'Scheduled Scan Completed',
          message: 'Global corporate website landing pages scanned: 98% compliant.',
          type: 'success',
          channel: 'Website'
        }
      ])
    }

    res.status(200).json({ success: true, count: alerts.length, data: alerts })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// PUT /api/alerts/:id/read - Mark alert as read
router.put('/:id/read', async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, { read: true }, { new: true })
    res.status(200).json({ success: true, data: alert })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
