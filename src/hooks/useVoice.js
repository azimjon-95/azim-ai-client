import { useEffect, useRef, useCallback } from 'react'
import { useStore } from '../services/store'
import { getSocket } from '../services/socket'

const HOTWORD = (import.meta.env.VITE_HOTWORD || 'Azim').toLowerCase()

export const useVoice = () => {
  const recognitionRef = useRef(null)
  const { setListening, setTranscript, addMessage, addRecentCommand, isListening } = useStore()
  const socket = getSocket()

  const startListening = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.warn('Web Speech API not supported')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = import.meta.env.VITE_VOICE_LANGUAGE || 'uz-UZ'
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onstart = () => {
      setListening(true)
      console.log('[Voice] Listening started')
    }

    recognition.onresult = (event) => {
      const results = Array.from(event.results)
      const transcript = results.map((r) => r[0].transcript).join('')
      setTranscript(transcript)

      const isFinal = results[results.length - 1].isFinal
      if (isFinal) {
        const lower = transcript.toLowerCase()
        if (lower.includes(HOTWORD)) {
          const command = lower.replace(HOTWORD, '').trim()
          if (command.length > 1) {
            handleCommand(command, transcript)
          }
        } else {
          handleCommand(transcript, transcript)
        }
        setTranscript('')
      }
    }

    recognition.onerror = (e) => {
      console.error('[Voice] Error:', e.error)
      setListening(false)
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setListening(false)
  }, [])

  const toggleListening = useCallback(() => {
    if (isListening) stopListening()
    else startListening()
  }, [isListening, startListening, stopListening])

  const handleCommand = (command, original) => {
    addMessage({ role: 'user', content: original })
    socket.emit('voice:command', { text: command })
    addRecentCommand(`"${command.slice(0, 20)}..."`)
  }

  useEffect(() => {
    socket.on('ai:response', (data) => {
      addMessage({ role: 'assistant', content: data.text })
      speak(data.text)
    })

    socket.on('command:executed', (data) => {
      addRecentCommand(data.label || data.action)
    })

    return () => {
      socket.off('ai:response')
      socket.off('command:executed')
    }
  }, [])

  const speak = (text) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = import.meta.env.VITE_VOICE_LANGUAGE || 'uz-UZ'
    utt.rate = 0.95
    utt.pitch = 1.0
    window.speechSynthesis.speak(utt)
  }

  return { startListening, stopListening, toggleListening, speak }
}
