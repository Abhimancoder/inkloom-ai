import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export async function sendAssistantMessage(messages) {
  const response = await axios.post(`${API_BASE_URL}/assistant/chat`, { messages }, {
    timeout: 35000,
    headers: { 'Content-Type': 'application/json' }
  })

  return response.data?.data?.answer || ''
}
