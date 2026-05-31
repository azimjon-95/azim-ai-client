import { motion } from 'framer-motion'
import { useStore } from '../../services/store'

export default function RobotAvatar() {
  const { isListening, isSpeaking } = useStore()

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: 180, height: 180 }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,120,255,0.25) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Listening rings */}
      {isListening && (
        <>
          {[0, 0.4, 0.8].map((delay, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border"
              style={{ borderColor: 'rgba(0,140,255,0.4)' }}
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 1.6, repeat: Infinity, delay, ease: 'easeOut' }}
            />
          ))}
        </>
      )}

      <svg viewBox="0 0 140 140" width="155" height="155" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bodyGrad" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#1a4080" />
            <stop offset="100%" stopColor="#0a1a30" />
          </radialGradient>
          <radialGradient id="faceGrad" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#0f2a50" />
            <stop offset="100%" stopColor="#060d1a" />
          </radialGradient>
        </defs>

        {/* Body */}
        <ellipse cx="70" cy="96" rx="32" ry="28" fill="url(#bodyGrad)" stroke="#1a5a9a" strokeWidth="1" />
        <rect x="55" y="85" width="30" height="18" rx="4" fill="rgba(0,80,160,0.4)" stroke="rgba(0,140,255,0.3)" strokeWidth="0.5" />
        <rect x="59" y="89" width="8" height="5" rx="2" fill={isSpeaking ? '#00aaff' : '#0060cc'} opacity="0.9" />
        <rect x="73" y="89" width="8" height="5" rx="2" fill={isListening ? '#00ff88' : '#00a0ff'} opacity="0.7" />
        <circle cx="70" cy="97" r="3" fill="rgba(0,180,255,0.5)" stroke="#00bbff" strokeWidth="0.5" />

        {/* Neck */}
        <rect x="63" y="68" width="14" height="12" rx="3" fill="#0e2040" stroke="#1a4a7a" strokeWidth="0.8" />

        {/* Head */}
        <rect x="30" y="22" width="80" height="50" rx="16" fill="url(#bodyGrad)" stroke="#1a5a9a" strokeWidth="1.2" />

        {/* Hat band */}
        <rect x="30" y="22" width="80" height="12" rx="10" fill="rgba(10,25,60,0.85)" stroke="rgba(0,100,200,0.4)" strokeWidth="0.5" />
        <rect x="38" y="27" width="64" height="2" rx="1" fill="rgba(0,140,255,0.5)" />
        {[55, 62, 70, 78, 85].map((cx, i) => (
          <circle key={i} cx={cx} cy="28.5" r="1.5" fill="#ffd700" opacity="0.85" />
        ))}

        {/* Face panel */}
        <rect x="38" y="36" width="64" height="34" rx="10" fill="url(#faceGrad)" stroke="rgba(0,100,200,0.3)" strokeWidth="0.5" />

        {/* Eyes */}
        {[56, 84].map((cx, i) => (
          <g key={i} style={{ animation: 'eye-blink 4s ease-in-out infinite', transformOrigin: `${cx}px 50px` }}>
            <ellipse cx={cx} cy="50" rx="9" ry="8" fill="#001020" stroke="#0066cc" strokeWidth="1" />
            <ellipse cx={cx} cy="50" rx="6" ry="6" fill="#001a40" />
            <circle cx={cx} cy="50" r="4" fill={isListening ? '#00ff88' : isSpeaking ? '#00aaff' : '#1a8fff'} opacity="0.95" />
            <circle cx={cx + 1.5} cy={48} r="1.5" fill="#80cfff" opacity="0.7" />
          </g>
        ))}

        {/* Mouth */}
        <path
          d={isSpeaking ? 'M 58 62 Q 70 72 82 62' : 'M 58 62 Q 70 69 82 62'}
          stroke="#0088ff"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Ears */}
        {[
          { x: 22, cx: 24.5 },
          { x: 108, cx: 110.5 },
        ].map(({ x, cx }, i) => (
          <g key={i}>
            <rect x={x} y="38" width="10" height="16" rx="5" fill="#0e2040" stroke="#1a4a7a" strokeWidth="0.8" />
            <rect x={cx} y="43" width="5" height="6" rx="2.5" fill="#0066cc" opacity="0.6" />
          </g>
        ))}
      </svg>
    </motion.div>
  )
}
