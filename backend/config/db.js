import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/inkloom'

    // Mask password in logs to protect credentials (security requirement)
    const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')
    console.log(`[Inkloom DB] Connecting to: ${maskedUri}`)

    const conn = await mongoose.connect(uri)

    console.log(`[Inkloom DB] ✅ Connected successfully!`)
    console.log(`[Inkloom DB] Host: ${conn.connection.host}`)
    console.log(`[Inkloom DB] Database: ${conn.connection.name || 'inkloom'}`)
    return true
  } catch (error) {
    console.error(`[Inkloom DB] ❌ Connection error: ${error.message}`)
    console.error(`[Inkloom DB] Check your network, credentials, or IP whitelist in MongoDB Atlas.`)
    return false
  }
}
