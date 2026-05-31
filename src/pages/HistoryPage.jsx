import { useStore } from '../services/store'
import { motion } from 'framer-motion'

export default function HistoryPage() {
  const { messages } = useStore()

  return (
    <div className="flex-1 overflow-y-auto p-5">
      <h2 className="font-orbitron mb-4" style={{ fontSize: 16, color: '#0099ff' }}>
        Suhbat Tarixi
      </h2>
      {messages.length === 0 ? (
        <p style={{ color: '#4a7aaa', fontSize: 13 }}>Hali suhbat yo'q.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex"
              style={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
            >
              <div
                style={{
                  maxWidth: '75%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? 'rgba(0,80,200,0.4)' : 'rgba(10,30,60,0.6)',
                  border: '0.5px solid rgba(0,140,255,0.2)',
                  fontSize: 13,
                  color: '#c0d8f0',
                  lineHeight: 1.5,
                }}
              >
                {msg.content}
                <div style={{ fontSize: 10, color: '#3a5a7a', marginTop: 4 }}>
                  {new Date(msg.ts).toLocaleTimeString('uz-UZ')}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
