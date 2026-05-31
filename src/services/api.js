import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.error('[API Error]', err?.response?.data || err.message)
    return Promise.reject(err)
  }
)

export const chatAPI = {
  send: (message) => api.post('/chat', { message }),
  history: () => api.get('/chat/history'),
  clear: () => api.delete('/chat/history'),
}

export const commandAPI = {
  execute: (command) => api.post('/commands/execute', { command }),
  list: () => api.get('/commands'),
}

export const voiceAPI = {
  tts: (text) => api.post('/voice/tts', { text }),
  status: () => api.get('/voice/status'),
}

export const telegramAPI = {
  status: () => api.get('/telegram/status'),
  send: (chatId, text) => api.post('/telegram/send', { chatId, text }),
}

export const systemAPI = {
  health: () => api.get('/health'),
  settings: () => api.get('/settings'),
  updateSettings: (data) => api.patch('/settings', data),
}

export default api
