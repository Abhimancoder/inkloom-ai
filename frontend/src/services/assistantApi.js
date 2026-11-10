import axios from 'axios'
import { getLocalAssistantResponse } from './assistantKnowledge'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export async function sendAssistantMessage(messages) {
  try {
    const response = await axios.post(`${API_BASE_URL}/assistant/chat`, { messages }, {
      timeout: 8000,
      headers: { 'Content-Type': 'application/json' }
    })

    if (response.data?.data?.answer) {
      return response.data.data.answer
    }
  } catch (error) {
    console.info('[Inkloom Assistant] Remote API unavailable, using in-browser knowledge engine:', error.message)
  }

  // Graceful in-browser intelligent fallback
  await new Promise(resolve => setTimeout(resolve, 300))
  return getLocalAssistantResponse(messages)
}
