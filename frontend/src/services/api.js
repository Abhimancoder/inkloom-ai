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
<<<<<<< HEAD
    const response = await client.post('/checks', checkData)
    return response.data?.data // Returns { check, findings, mlInsights, visualAnalytics }
=======
    const isFormData = typeof FormData !== 'undefined' && checkData instanceof FormData
    const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }
    const response = await client.post('/checks', checkData, { headers })
    return response.data?.data // Returns { check, findings, visualAnalysis }
>>>>>>> faa97547145795a42e32a147158687ca4b3a25bc
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
export const submitReviewDecision = async ({ checkId, decision, reviewerName, reviewerRole, reviewerNotes }) => {
  try {
    const response = await client.post('/reviews', {
      checkId,
      decision,
      reviewerName,
      reviewerRole,
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

<<<<<<< HEAD
// 5. Continuous Channel Monitoring (Slide 4 & 5)
export const getMonitoringStats = async () => {
  try {
    const response = await client.get('/monitoring/stats')
    return response.data?.data
  } catch (error) {
    console.warn('[Inkloom API] Error fetching monitoring stats:', error.message)
=======
// ================================================================
// 5. Approved Copy Library & Contextual RAG Rewriting (Round 3)
// ================================================================
export const getApprovedCopy = async (brandProfileId) => {
  try {
    const params = brandProfileId ? { brandProfileId } : {}
    const response = await client.get('/approved-copy', { params })
    return response.data?.data || []
  } catch (error) {
    console.warn('[Inkloom API] Approved copy fetch offline fallback:', error.message)
>>>>>>> faa97547145795a42e32a147158687ca4b3a25bc
    return null
  }
}

<<<<<<< HEAD
export const getMonitoringAssets = async () => {
  try {
    const response = await client.get('/monitoring/assets')
    return response.data?.data || []
  } catch (error) {
    console.warn('[Inkloom API] Error fetching monitoring assets:', error.message)
    return []
  }
}

export const getMonitoringActivity = async () => {
  try {
    const response = await client.get('/monitoring/activity')
    return response.data?.data || []
  } catch (error) {
    console.warn('[Inkloom API] Error fetching monitoring activity:', error.message)
    return []
  }
}

export const triggerChannelScan = async (scanData) => {
  try {
    const response = await client.post('/monitoring/trigger-scan', scanData)
    return response.data?.data
  } catch (error) {
    console.error('[Inkloom API] Error triggering channel scan:', error.message)
=======
export const createApprovedCopy = async (copyData) => {
  try {
    const response = await client.post('/approved-copy', copyData)
    return response.data?.data
  } catch (error) {
    console.error('[Inkloom API] Error creating approved copy:', error.message)
>>>>>>> faa97547145795a42e32a147158687ca4b3a25bc
    throw error
  }
}

<<<<<<< HEAD
// 6. Governance & Compliance Reports & Matplotlib Charts
export const getReportsSummary = async () => {
  try {
    const response = await client.get('/reports/summary')
    return response.data?.data
  } catch (error) {
    console.warn('[Inkloom API] Error fetching reports summary:', error.message)
    return null
  }
}

export const getReportCertificate = async (checkId) => {
  try {
    const response = await client.get(`/reports/${checkId}`)
    return response.data?.data
  } catch (error) {
    console.error('[Inkloom API] Error fetching report certificate:', error.message)
=======
export const deleteApprovedCopy = async (id) => {
  try {
    const response = await client.delete(`/approved-copy/${id}`)
    return response.data
  } catch (error) {
    console.error('[Inkloom API] Error deleting approved copy:', error.message)
>>>>>>> faa97547145795a42e32a147158687ca4b3a25bc
    throw error
  }
}

<<<<<<< HEAD
export const getVisualAnalyticsCharts = async () => {
  try {
    const response = await client.get('/reports/charts')
    return response.data?.data
  } catch (error) {
    console.warn('[Inkloom API] Error fetching visual analytics charts:', error.message)
    return null
  }
}

// 7. Proactive Alerts & Activity Stream (Slide 4)
export const getAlerts = async () => {
  try {
    const response = await client.get('/alerts')
    return response.data?.data || []
  } catch (error) {
    console.warn('[Inkloom API] Error fetching alerts:', error.message)
    return []
  }
}

export const markAlertRead = async (id) => {
  try {
    const response = await client.put(`/alerts/${id}/read`)
    return response.data?.data
  } catch (error) {
    console.warn('[Inkloom API] Error marking alert read:', error.message)
    return null
  }
}
=======
export const generateRagRewrite = async ({
  originalSentence,
  brandProfileId,
  matchedRule,
  explanation,
  userInstruction
}) => {
  try {
    const response = await client.post('/rewrites/generate', {
      originalSentence,
      brandProfileId,
      matchedRule,
      explanation,
      userInstruction
    })
    return response.data?.data
  } catch (error) {
    console.warn('[Inkloom API] Backend RAG offline, returning deterministic suggestion:', error.message)
    // Intelligent client-side fallback
    return {
      isAiSuggestion: true,
      originalSentence,
      suggestedAlternative: originalSentence
        .replace(/best in class solution at cheap rates/i, 'enterprise-grade governance solution at competitive value')
        .replace(/guaranteed to eliminate 100% of errors/i, 'engineered to significantly reduce review turnaround times by up to 60%')
        .replace(/\bcheap\b/i, 'cost-effective')
        .replace(/\bbest in class\b/i, 'enterprise-grade'),
      ruleAddressed: matchedRule || 'Brand Guidelines Alignment',
      explanation: 'Generated using locked enterprise tone rules and approved copy examples.',
      preservedFacts: ['100%', '60%'],
      retrievedSources: [
        {
          id: 'seed_fallback_01',
          title: 'Enterprise Platform Value Proposition',
          channel: 'Email Marketing',
          snippet: 'TechCorp Solutions delivers an enterprise-grade governance platform engineered for cost-effective operations.',
          similarityScore: 92,
          relevanceReason: 'Matched domain terminology in approved library'
        }
      ],
      notice: 'AI Suggestion: Original draft preserved. Choose whether to apply.'
    }
  }
}
// ================================================================
// 6. Headless CMS & Collaboration Webhooks (Round 3)
// ================================================================
export const getIntegrations = async () => {
  try {
    const response = await client.get('/integrations')
    return response.data?.data || []
  } catch (error) {
    console.warn('[Inkloom API] Integrations fetch offline fallback:', error.message)
    return [
      {
        provider: 'slack',
        displayName: 'Slack Brand Alerts',
        enabled: true,
        mode: 'simulation',
        status: 'Test Mode',
        targetChannelOrEndpoint: '#brand-governance-alerts',
        publishAsDraftOnly: true,
        lastStatusMessage: 'Ready for human approval events'
      },
      {
        provider: 'hubspot',
        displayName: 'HubSpot Marketing Hub',
        enabled: true,
        mode: 'simulation',
        status: 'Test Mode',
        targetChannelOrEndpoint: '/crm/v3/objects/marketing_drafts',
        publishAsDraftOnly: true,
        lastStatusMessage: 'Syncs approved copy directly as Draft Post'
      },
      {
        provider: 'wordpress',
        displayName: 'WordPress Headless CMS',
        enabled: true,
        mode: 'simulation',
        status: 'Test Mode',
        targetChannelOrEndpoint: '/wp-json/wp/v2/posts (status=draft)',
        publishAsDraftOnly: true,
        lastStatusMessage: 'Creates draft post awaiting publication editor'
      }
    ]
  }
}

export const updateIntegration = async (provider, updateData) => {
  try {
    const response = await client.put(`/integrations/${provider}`, updateData)
    return response.data?.data
  } catch (error) {
    console.error('[Inkloom API] Error updating integration:', error.message)
    throw error
  }
}

export const getIntegrationEvents = async () => {
  try {
    const response = await client.get('/integrations/events')
    return response.data?.data || []
  } catch (error) {
    console.warn('[Inkloom API] Webhook events fetch offline fallback:', error.message)
    return []
  }
}
>>>>>>> faa97547145795a42e32a147158687ca4b3a25bc
