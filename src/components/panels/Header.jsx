import { useStore } from '../../services/store'
import { motion } from 'framer-motion'

export default function Header() {
  const { isOnline } = useStore()

  return (
    <header
      className="flex items-center justify-between flex-shrink-0"
      style={{
        padding: '12px 20px',
        borderBottom: '0.5px solid rgba(0,140,255,0.15)',
        background: 'rgba(0,0,0,0.2)',
      }}
    >
      <div>
        <h1
          className="font-orbitron"
          style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.5px' }}
        >
          Azim <span style={{ color: '#0099ff' }}>AI Assistant</span>
        </h1>
        <p style={{ fontSize: 11, color: '#4a7aaa', marginTop: 2 }}>
          Sizning shaxsiy ovozli yordamchingiz
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          style={{
            background: 'rgba(0,140,255,0.1)',
            border: '0.5px solid rgba(0,140,255,0.3)',
            borderRadius: 6,
            padding: '4px 10px',
            fontSize: 12,
            color: '#5090d0',
            cursor: 'pointer',
            fontFamily: "'Exo 2', sans-serif",
          }}
        >
          🌐 UZ
        </button>

        <button
          style={{
            background: 'rgba(255,200,0,0.08)',
            border: '0.5px solid rgba(255,200,0,0.25)',
            borderRadius: 6,
            padding: '4px 10px',
            fontSize: 14,
            color: '#9a8a50',
            cursor: 'pointer',
          }}
        >
          ☀
        </button>

        <div className="flex items-center gap-2">
          <motion.div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: isOnline ? '#3dbf6f' : '#ff4466',
            }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span style={{ fontSize: 12, color: isOnline ? '#3dbf6f' : '#ff4466' }}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    </header>
  )
}
