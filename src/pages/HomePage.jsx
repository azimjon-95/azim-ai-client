import { motion } from 'framer-motion'
import RobotAvatar from '../components/robot/RobotAvatar'
import Waveform from '../components/robot/Waveform'
import { useVoice } from '../hooks/useVoice'
import { useStore } from '../services/store'
import { getSocket } from '../services/socket'

const QUICK_BTNS = [
  { label: 'YouTube och', icon: 'ti-brand-youtube', color: '#ff5555', cmd: 'YouTube och' },
  { label: 'Telegram och', icon: 'ti-brand-telegram', color: '#2aabee', cmd: 'Telegram och' },
  { label: 'Google och', icon: 'ti-brand-google', color: '#6699ff', cmd: 'Google och' },
  { label: "Ob-havoni ko'rsat", icon: 'ti-cloud-rain', color: '#7dcfee', cmd: 'ob-havo' },
  { label: 'Xabar yozish', icon: 'ti-message-2', color: '#9090ff', cmd: 'xabar yoz' },
]

export default function HomePage() {
  const { toggleListening } = useVoice()
  const { isListening, isSpeaking, transcript, response, addRecentCommand } = useStore()
  const socket = getSocket()

  const handleQuickCmd = (btn) => {
    socket.emit('voice:command', { text: btn.cmd })
    addRecentCommand(btn.label)
  }

  return (
    <main className="flex flex-col items-center flex-1 overflow-y-auto" style={{ padding: '24px 20px' }}>
      {/* Robot */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <RobotAvatar />
      </motion.div>

      {/* Waveform */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="my-3"
      >
        <Waveform />
      </motion.div>

      {/* Greeting */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="font-orbitron text-center mb-1"
        style={{ fontSize: 20, fontWeight: 500 }}
      >
        Salom, men <span style={{ color: '#0099ff' }}>Azim!</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ fontSize: 12, color: '#4a7aaa', textAlign: 'center', marginBottom: 20 }}
      >
        {transcript
          ? `"${transcript}"`
          : response
          ? response
          : 'Buyruq bering yoki gapiring, men eshitayapman...'}
      </motion.p>

      {/* Mic Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.55, type: 'spring' }}
        className="relative mb-3"
      >
        {/* Pulse rings */}
        {(isListening || isSpeaking) &&
          [0, 0.5, 1].map((delay, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full"
              style={{
                border: `1.5px solid ${isListening ? 'rgba(0,200,100,0.4)' : 'rgba(0,140,255,0.4)'}`,
              }}
              initial={{ scale: 0.85, opacity: 0.9 }}
              animate={{ scale: 1.7, opacity: 0 }}
              transition={{ duration: 1.8, repeat: Infinity, delay, ease: 'easeOut' }}
            />
          ))}

        <motion.button
          onClick={toggleListening}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.93 }}
          className="relative flex items-center justify-center rounded-full z-10"
          style={{
            width: 60,
            height: 60,
            background: isListening
              ? 'linear-gradient(135deg, #cc0033, #ff2255)'
              : isSpeaking
              ? 'linear-gradient(135deg, #007744, #00bb66)'
              : 'linear-gradient(135deg, #0050cc, #0088ff)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: isListening ? '0 0 20px rgba(200,0,50,0.4)' : '0 0 20px rgba(0,100,255,0.3)',
          }}
        >
          <i
            className={`ti ${isListening ? 'ti-microphone-off' : 'ti-microphone'} text-white`}
            style={{ fontSize: 26 }}
          />
        </motion.button>
      </motion.div>

      <p style={{ fontSize: 11, color: '#4a7aaa', marginBottom: 20 }}>
        {isListening ? 'Tinglayapman...' : isSpeaking ? 'Gapiryapman...' : 'Gapirish uchun bosing'}
      </p>

      {/* Quick buttons */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="flex flex-wrap gap-2 justify-center"
        style={{ maxWidth: 480 }}
      >
        {QUICK_BTNS.map((btn) => (
          <motion.button
            key={btn.cmd}
            onClick={() => handleQuickCmd(btn)}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 rounded-full"
            style={{
              padding: '7px 14px',
              border: '0.5px solid rgba(0,140,255,0.25)',
              background: 'rgba(0,60,120,0.3)',
              fontSize: 12,
              color: '#7ab0e0',
              cursor: 'pointer',
              fontFamily: "'Exo 2', sans-serif",
            }}
          >
            <i className={`ti ${btn.icon}`} style={{ fontSize: 14, color: btn.color }} />
            {btn.label}
          </motion.button>
        ))}
      </motion.div>
    </main>
  )
}
