import { useEffect, useState } from 'react'
import { getSocket } from '../services/socket'
import { useStore } from '../services/store'

export const useSocket = () => {
  const [connected, setConnected] = useState(false)
  const { setOnline } = useStore()

  useEffect(() => {
    const socket = getSocket()

    const onConnect = () => { setConnected(true); setOnline(true) }
    const onDisconnect = () => { setConnected(false); setOnline(false) }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    setConnected(socket.connected)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
    }
  }, [])

  return { connected, socket: getSocket() }
}
