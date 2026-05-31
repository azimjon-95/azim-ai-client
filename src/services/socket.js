import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

let socket = null

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id)
    })

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected')
    })

    socket.on('connect_error', (err) => {
      console.error('[Socket] Error:', err.message)
    })
  }
  return socket
}

export const emitVoiceCommand = (text) => {
  const s = getSocket()
  s.emit('voice:command', { text })
}

export const emitAudioChunk = (chunk) => {
  const s = getSocket()
  s.emit('audio:chunk', chunk)
}

export default getSocket
