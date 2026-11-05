import axios from 'axios'

// API Base URL (defaults to local Express backend)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 8000
})

// ================================================================
// INKLOOM API SERVICE (AXIOS CLIENT)
// ================================================================

// 1. Health & Status
export const checkBackendHealth = async () => {
  try {
    const response = await client.get('/health')
    return response.data
  } catch (error) {
    return { status: 'offline', connected: false, error: error.message }
  }
}

// 2. Brand Profiles
export const getBrandProfiles = async () => {
  try {
    const response = await client.get('/profiles')
    return response.data?.data || []
  } catch (error) {
    console.warn('[Inkloom API] Backend offline, using local profiles cache:', error.message)
    return null
  }
}

export const createBrandProfile = async (profileData) => {
  try {
    const response = await client.post('/profiles', profileData)
    return response.data?.data
  } catch (error) {
    console.error('[Inkloom API] Error creating profile:', error.message)
    throw error
  }
}

export const updateBrandProfile = async (id, profileData) => {
  try {
    const response = await client.put(`/profiles/${id}`, profileData)
    return response.data?.data
  } catch (error) {
    console.error('[Inkloom API] Error updating profile:', error.message)
    throw error
  }
}

// 3. Content Checks & Deterministic Audit
export const getContentChecks = async () => {
  try {
    const response = await client.get('/checks')
    return response.data?.data || []
  } catch (error) {
    console.warn('[Inkloom API] Backend offline, using local checks cache:', error.message)
    return null
  }
}

export const submitContentCheck = async (checkData) => {
  try {
    const response = await client.post('/checks', checkData)
    return response.data?.data // Returns { check, findings }
  } catch (error) {
    console.error('[Inkloom API] Error submitting check to backend:', error.message)
    throw error
  }
}

export const getContentCheckDetail = async (id) => {
  try {
    const response = await client.get(`/checks/${id}`)
    return response.data?.data
  } catch (error) {
    console.error('[Inkloom API] Error fetching check detail:', error.message)
    throw error
  }
}

// 4. Human Review Decisions
export const submitReviewDecision = async ({ checkId, decision, reviewerName, reviewerNotes }) => {
  try {
    const response = await client.post('/reviews', {
      checkId,
      decision,
      reviewerName,
      reviewerNotes
    })
    return response.data?.data
  } catch (error) {
    console.error('[Inkloom API] Error submitting review decision:', error.message)
    throw error
  }
}

export const getReviewDecisions = async () => {
  try {
    const response = await client.get('/reviews')
    return response.data?.data || []
  } catch (error) {
    console.warn('[Inkloom API] Backend offline, using local reviews cache:', error.message)
    return null
  }
}
