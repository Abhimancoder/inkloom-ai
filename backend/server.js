import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { connectDB } from './config/db.js'

// Route Imports
import profileRoutes from './routes/profileRoutes.js'
import checkRoutes from './routes/checkRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import assistantRoutes from './routes/assistantRoutes.js'
import monitoringRoutes from './routes/monitoringRoutes.js'
import reportRoutes from './routes/reportRoutes.js'
import alertRoutes from './routes/alertRoutes.js'
import approvedCopyRoutes from './routes/approvedCopyRoutes.js'
import rewriteRoutes from './routes/rewriteRoutes.js'
import integrationRoutes from './routes/integrationRoutes.js'

// Load environment variables from .env
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ensure private uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
// Serve static uploaded media safely
app.use('/uploads', express.static(uploadsDir))

// Connect to MongoDB Atlas
connectDB()

// API Routes
app.use('/api/profiles', profileRoutes)
app.use('/api/checks', checkRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/assistant', assistantRoutes)
app.use('/api/monitoring', monitoringRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/alerts', alertRoutes)
app.use('/api/approved-copy', approvedCopyRoutes)
app.use('/api/rewrites', rewriteRoutes)
app.use('/api/integrations', integrationRoutes)

// Health Check Endpoint (Required by Phase M1)
app.get('/api/health', (req, res) => {
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  }

  const dbState = mongoose.connection.readyState

  res.status(200).json({
    status: 'ok',
    service: 'inkloom-backend',
    version: '1.0.0',
    message: 'Inkloom AI Backend is healthy and running',
    database: {
      status: dbStatusMap[dbState] || 'unknown',
      connected: dbState === 1
    },
    timestamp: new Date().toISOString()
  })
})

// Global Error Handler (Handles Multer file errors, validation errors, bad inputs)
app.use((err, req, res, next) => {
  console.error('[Inkloom Error]', err.message)
  res.status(err.status || 400).json({
    success: false,
    error: err.message || 'An unexpected error occurred during request processing'
  })
})

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Start Server
app.listen(PORT, () => {
  console.log(`[Inkloom Backend] Server running on http://localhost:${PORT}`)
  console.log(`[Inkloom Backend] Health check at http://localhost:${PORT}/api/health`)
  console.log(`[Inkloom Backend] Profiles API at http://localhost:${PORT}/api/profiles`)
  console.log(`[Inkloom Backend] Checks API at http://localhost:${PORT}/api/checks`)
  console.log(`[Inkloom Backend] Reviews API at http://localhost:${PORT}/api/reviews`)
  console.log(`[Inkloom Backend] Approved Copy API at http://localhost:${PORT}/api/approved-copy`)
  console.log(`[Inkloom Backend] RAG Rewrites API at http://localhost:${PORT}/api/rewrites/generate`)
  console.log(`[Inkloom Backend] Integrations API at http://localhost:${PORT}/api/integrations`)
})
