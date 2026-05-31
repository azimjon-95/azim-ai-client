import { useState } from 'react'
import { motion } from 'framer-motion'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    hotword: 'Azim',
    language: 'uz-UZ',
    voiceClone: false,
    faceRecognition: false,
    telegramNotifs: true,
    offlineMode: false,
  })

  const toggle = (key) => setSettings((s) => ({ ...s, [key]: !s[key] }))

  const Toggle = ({ label, keyName, description }) => (
    <div className="flex items-center justify-between" style={{ padding: '12px 0', borderBottom: '0.5px solid rgba(0,140,255,0.08)' }}>
      <div>
        <p style={{ fontSize: 13.5, color: '#c0d8f0' }}>{label}</p>
        {description && <p style={{ fontSize: 11, color: '#4a7aaa', marginTop: 2 }}>{description}</p>}
      </div>
      <button
        onClick={() => toggle(keyName)}
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          border: 'none',
          background: settings[keyName] ? '#0077ff' : 'rgba(255,255,255,0.1)',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        <motion.div
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#fff',
            position: 'absolute',
            top: 3,
          }}
          animate={{ left: settings[keyName] ? 23 : 3 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  )

  return (
    <div className="flex-1 overflow-y-auto p-5">
      <h2 className="font-orbitron mb-5" style={{ fontSize: 16, color: '#0099ff' }}>
        Sozlamalar
      </h2>

      <div
        style={{
          background: 'rgba(0,20,50,0.5)',
          border: '0.5px solid rgba(0,140,255,0.15)',
          borderRadius: 12,
          padding: '4px 16px',
          marginBottom: 16,
        }}
      >
        <Toggle label="Ovoz klonlash" keyName="voiceClone" description="User ovozini AI orqali klonlash" />
        <Toggle label="Yuz identifikatsiyasi" keyName="faceRecognition" description="Kamera orqali yuz tanish" />
        <Toggle label="Telegram bildirishnomalari" keyName="telegramNotifs" description="Real-time xabarlar" />
        <Toggle label="Offline rejim" keyName="offlineMode" description="Internetsiz ishlash (Ollama)" />
      </div>

      <div
        style={{
          background: 'rgba(0,20,50,0.5)',
          border: '0.5px solid rgba(0,140,255,0.15)',
          borderRadius: 12,
          padding: '16px',
        }}
      >
        <p style={{ fontSize: 11, color: '#4a7aaa', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          Hotword sozlash
        </p>
        <input
          type="text"
          value={settings.hotword}
          onChange={(e) => setSettings((s) => ({ ...s, hotword: e.target.value }))}
          style={{
            width: '100%',
            background: 'rgba(0,40,100,0.3)',
            border: '0.5px solid rgba(0,140,255,0.25)',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 14,
            color: '#c0d8f0',
            outline: 'none',
            fontFamily: "'Exo 2', sans-serif",
          }}
          placeholder="Hotword nomi..."
        />
        <p style={{ fontSize: 11, color: '#4a7aaa', marginTop: 6 }}>
          Misol: "Azim YouTube och"
        </p>
      </div>
    </div>
  )
}
