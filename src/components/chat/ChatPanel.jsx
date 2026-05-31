import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../services/store'
import { getSocket } from '../../services/socket'

function FlyBubble({ text, role, id }) {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 0, scale: 0.85 }}
      animate={{ opacity: [0, 1, 1, 0], y: [0, -12, -36, -60], scale: [0.85, 1, 1, 0.9] }}
      transition={{ duration: 1.9, times: [0, 0.15, 0.8, 1], ease: 'easeOut' }}
      style={{
        position: 'absolute',
        bottom: 8,
        ...(role === 'user' ? { right: 12 } : { left: 12 }),
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: 11,
        padding: '5px 10px',
        borderRadius: role === 'user' ? '8px 8px 2px 8px' : '8px 8px 8px 2px',
        background: role === 'user' ? 'rgba(0,80,200,0.35)' : 'rgba(0,20,50,0.88)',
        border: `0.5px solid ${role === 'user' ? 'rgba(0,140,255,0.4)' : 'rgba(0,255,136,0.25)'}`,
        color: role === 'user' ? '#80aaff' : '#60cc88',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: 10,
        maxWidth: 180,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {text.length > 28 ? text.slice(0, 28) + '...' : text}
    </motion.div>
  )
}

const AZIM_REPLIES = [
  'Bajarildi! YouTube ochildi.',
  'Telegram ochildi.',
  "Bugungi ob-havo: +24°C, quyoshli.",
  'Xabar yuborildi!',
  'Buyruqni qabul qildim.',
  'Ha, albatta! Qilindi.',
  'Boshqa nima kerak?',
]

export default function ChatPanel() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, role: 'azim', text: 'Salom! Men Azim. Buyruq bering 🤖' },
  ])
  const [typing, setTyping] = useState(false)
  const [flyBubbles, setFlyBubbles] = useState([])
  const logRef = useRef(null)
  const socket = getSocket()
  const { setSpeaking } = useStore()

  useEffect(() => {
    socket.on('ai:response', (data) => {
      setTyping(false)
      addMsg('azim', data.text)
      setSpeaking(true)
      setTimeout(() => setSpeaking(false), 1400 + data.text.length * 38)
    })
    return () => socket.off('ai:response')
  }, [])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [messages, typing])

  const addMsg = (role, text) => {
    const id = Date.now() + Math.random()
    setMessages((prev) => [...prev, { id, role, text }])
    addFly(text, role, id)
  }

  const addFly = (text, role, id) => {
    setFlyBubbles((prev) => [...prev, { text, role, id }])
    setTimeout(() => setFlyBubbles((prev) => prev.filter((b) => b.id !== id)), 2200)
  }

  const send = () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    addMsg('user', text)
    setTyping(true)
    socket.emit('voice:command', { text })

    setTimeout(() => {
      setTyping(false)
      const reply = AZIM_REPLIES[Math.floor(Math.random() * AZIM_REPLIES.length)]
      addMsg('azim', reply)
      setSpeaking(true)
      setTimeout(() => setSpeaking(false), 1400 + reply.length * 38)
    }, 1200 + Math.random() * 800)
  }

  const getTime = () => {
    const d = new Date()
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: 'rgba(3,8,20,0.95)',
      borderLeft: '0.5px solid rgba(0,170,255,0.15)',
      fontFamily: "'Share Tech Mono', monospace",
      position: 'relative',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px', borderBottom: '0.5px solid rgba(0,170,255,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(0,10,25,0.8)',
      }}>
        <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 13, color: '#00aaff', letterSpacing: 1 }}>
          AZIM_CHAT
        </span>
        <motion.span style={{ fontSize: 10, color: '#00ff88' }}
          animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }}>
          ● ULANDI
        </motion.span>
      </div>

      {/* Messages */}
      <div ref={logRef} style={{
        flex: 1, overflowY: 'auto', padding: '12px 14px',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '85%', padding: '8px 12px',
                borderRadius: msg.role === 'user' ? '10px 10px 3px 10px' : '10px 10px 10px 3px',
                background: msg.role === 'user' ? 'rgba(0,80,200,0.3)' : 'rgba(0,20,50,0.8)',
                border: `0.5px solid ${msg.role === 'user' ? 'rgba(0,140,255,0.3)' : 'rgba(0,170,255,0.18)'}`,
                fontSize: 12, lineHeight: 1.5,
                color: msg.role === 'user' ? '#a0c8f0' : '#80c0e8',
              }}>
                {msg.text}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(0,170,255,0.3)', marginTop: 2, padding: '0 4px' }}>
                {getTime()}
              </div>
            </motion.div>
          ))}
          {typing && (
            <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div style={{
                padding: '8px 14px', borderRadius: '10px 10px 10px 3px',
                background: 'rgba(0,20,50,0.8)', border: '0.5px solid rgba(0,170,255,0.18)',
                display: 'flex', gap: 4, alignItems: 'center',
              }}>
                {[0, 0.2, 0.4].map((d, i) => (
                  <motion.div key={i}
                    style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(0,170,255,0.5)' }}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.9, delay: d, repeat: Infinity }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fly bubbles */}
      <div style={{ position: 'absolute', bottom: 64, left: 0, right: 0, height: 80, pointerEvents: 'none', overflow: 'hidden' }}>
        <AnimatePresence>
          {flyBubbles.map((b) => <FlyBubble key={b.id} {...b} />)}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div style={{
        display: 'flex', gap: 8, padding: '10px 14px',
        borderTop: '0.5px solid rgba(0,170,255,0.15)',
        background: 'rgba(0,10,25,0.8)',
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Buyruq yoki savol..."
          style={{
            flex: 1, background: 'rgba(0,30,70,0.6)',
            border: '0.5px solid rgba(0,140,255,0.25)',
            borderRadius: 6, padding: '9px 12px',
            fontSize: 12, color: '#a0ccf0', outline: 'none',
            fontFamily: "'Share Tech Mono', monospace",
          }}
        />
        <button onClick={send} style={{
          width: 36, height: 36, borderRadius: 6, flexShrink: 0,
          background: 'linear-gradient(135deg,#0044bb,#0077ff)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <i className="ti ti-send" style={{ fontSize: 16, color: '#fff' }} aria-hidden="true" />
        </button>
      </div>

      {/* Hacker ticker */}
      <div style={{
        fontSize: 10, color: 'rgba(0,255,136,0.4)', overflow: 'hidden',
        whiteSpace: 'nowrap', borderTop: '0.5px solid rgba(0,255,136,0.08)',
        padding: '5px 0', background: 'rgba(0,5,12,0.9)',
      }}>
        <motion.span
          style={{ display: 'inline-block', paddingLeft: '100%' }}
          animate={{ x: [0, -2000] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        >
          [ AZIM_AI ] &nbsp; OVOZ: FAOL &nbsp;|&nbsp; OLLAMA: ULANDI &nbsp;|&nbsp; TELEGRAM: TAYYOR &nbsp;|&nbsp; BUYRUQLAR: YOUTUBE · TELEGRAM · GOOGLE · OB-HAVO &nbsp;|&nbsp; v2.0.1 &nbsp;|&nbsp; STATUS: ESHITMOQDA...
        </motion.span>
      </div>
    </div>
  )
}
