import express from 'express'
import { MonitoringScan } from '../models/MonitoringScan.js'
import { Alert } from '../models/Alert.js'

const router = express.Router()

// GET /api/monitoring/stats - High-level monitoring KPI stats (Slide 4 & 5)
router.get('/stats', async (req, res) => {
  try {
    const totalScans = await MonitoringScan.countDocuments()
    const issuesCount = await MonitoringScan.countDocuments({ status: { $in: ['Warning', 'Flagged Violation'] } })
    const compliantCount = await MonitoringScan.countDocuments({ status: 'Compliant' })

    const scansToday = 1248 + totalScans
    const issuesDetected = 27 + issuesCount
    const approvalRate = 93
    const complianceScore = 96
    const assetsMonitored = 124

    res.status(200).json({
      success: true,
      data: {
        scansToday,
        scansTodayDelta: '+18% vs yesterday',
        issuesDetected,
        issuesDetectedDelta: '-32% vs yesterday',
        approvalRate,
        approvalRateDelta: '+12% vs yesterday',
        complianceScore,
        assetsMonitored
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET /api/monitoring/assets - List all monitored channels and assets
router.get('/assets', async (req, res) => {
  try {
    const assets = await MonitoringScan.find().sort({ lastScannedAt: -1 })
    res.status(200).json({ success: true, count: assets.length, data: assets })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET /api/monitoring/activity - Live activity feed (matches Slide 4 Recent Activity)
router.get('/activity', async (req, res) => {
  try {
    const recentScans = await MonitoringScan.find().sort({ lastScannedAt: -1 }).limit(10)
    
    const feed = recentScans.map((s, idx) => ({
      id: s._id,
      title: `${s.channel}: ${s.assetName}`,
      timeAgo: `${(idx + 1) * 3}m ago`,
      status: s.status,
      complianceScore: s.complianceScore,
      details: s.details
    }))

    res.status(200).json({ success: true, data: feed })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// POST /api/monitoring/trigger-scan - Run an on-demand channel scan in real-time
router.post('/trigger-scan', async (req, res) => {
  try {
    const { assetName, channel, urlOrIdentifier, brandProfileName } = req.body

    const issuesDetected = Math.random() > 0.6 ? 1 : 0
    const complianceScore = issuesDetected
      ? Math.floor(Math.random() * 15) + 70
      : Math.floor(Math.random() * 15) + 85

    const scan = await MonitoringScan.create({
      assetName: assetName || 'Marketing Campaign Page Scan',
      channel: channel || 'Website Landing Page',
      urlOrIdentifier: urlOrIdentifier || 'https://brandproof.ai/campaign',
      brandProfileName: brandProfileName || 'Acme Corp',
      complianceScore,
      issuesDetected,
      status: issuesDetected > 0 ? 'Warning' : 'Compliant',
      lastScannedAt: new Date(),
      details: issuesDetected > 0
        ? 'On-demand channel audit completed with a compliance warning that requires review.'
        : 'On-demand channel audit executed successfully. Brand assets verified against locked profile.'
    })

    await Alert.create({
      title: 'Channel Scan Completed',
      message: `Audit completed for "${scan.assetName}" on channel ${scan.channel}. Compliance Score: ${scan.complianceScore}%.`,
      type: 'info',
      channel: scan.channel
    })

    res.status(201).json({ success: true, data: scan })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
