import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Health Check Endpoint (Required by Phase M1)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'inkloom-backend',
    version: '1.0.0',
    message: 'Inkloom AI Backend is healthy and running',
    timestamp: new Date().toISOString()
  })
})

// Fallback for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Start Server
app.listen(PORT, () => {
  console.log(`[Inkloom Backend] Server running on http://localhost:${PORT}`)
  console.log(`[Inkloom Backend] Health check available at http://localhost:${PORT}/api/health`)
})
