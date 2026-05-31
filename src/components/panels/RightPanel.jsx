import { motion } from 'framer-motion'
import { useStore } from '../../services/store'
import { getSocket } from '../../services/socket'

const QUICK_CMDS = [
  { id: 'youtube', icon: 'ti-brand-youtube', label: 'YouTube och', color: '#ff5555', bg: 'rgba(255,60,60,0.12)' },
  { id: 'telegram', icon: 'ti-brand-telegram', label: 'Telegram och', color: '#2aabee', bg: 'rgba(42,171,238,0.12)' },
  { id: 'google', icon: 'ti-brand-google', label: 'Google och', color: '#6699ff', bg: 'rgba(66,133,244,0.12)' },
  { id: 'weather', icon: 'ti-cloud-rain', label: "Ob-havoni ko'rsat", color: '#7dcfee', bg: 'rgba(100,200,230,0.12)' },
  { id: 'message', icon: 'ti-message-2', label: 'Xabar yozish', color: '#9090ff', bg: 'rgba(120,120,255,0.12)' },
]

export default function RightPanel() {
  const { recentCommands, addRecentCommand } = useStore()
  const socket = getSocket()

  const handleCmd = (cmd) => {
    socket.emit('voice:command', { text: cmd.label })
    addRecentCommand(cmd.label)
  }

  return (
    <aside
      className="flex flex-col gap-4 overflow-y-auto"
      style={{ padding: '16px 14px', width: 220, flexShrink: 0 }}
    >
      {/* TEZKOR BUYRUQLAR */}
      <section>
        <p style={{ fontSize: 11, fontWeight: 500, color: '#4a7aaa', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 8 }}>
          Tezkor buyruqlar
        </p>
        <div className="flex flex-col gap-1">
          {QUICK_CMDS.map((cmd, i) => (
            <motion.button
              key={cmd.id}
              onClick={() => handleCmd(cmd)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 text-left w-full rounded-lg transition-all"
              style={{
                padding: '7px 10px',
                border: '0.5px solid rgba(0,140,255,0.12)',
                background: 'rgba(0,30,60,0.4)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0,60,120,0.45)'
                e.currentTarget.style.borderColor = 'rgba(0,140,255,0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0,30,60,0.4)'
                e.currentTarget.style.borderColor = 'rgba(0,140,255,0.12)'
              }}
            >
              <div
                className="flex items-center justify-center rounded-md flex-shrink-0"
                style={{ width: 28, height: 28, background: cmd.bg }}
              >
                <i className={`ti ${cmd.icon}`} style={{ fontSize: 15, color: cmd.color }} />
              </div>
              <span style={{ fontSize: 12.5, color: '#80b0d8', flex: 1 }}>{cmd.label}</span>
              <i className="ti ti-chevron-right" style={{ fontSize: 13, color: '#2a5080' }} />
            </motion.button>
          ))}
        </div>
      </section>

      {/* OXIRGI BUYRUQLAR */}
      <section>
        <p style={{ fontSize: 11, fontWeight: 500, color: '#4a7aaa', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 8 }}>
          Oxirgi buyruqlar
        </p>
        <div className="flex flex-col">
          {recentCommands.slice(0, 5).map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2"
              style={{
                padding: '6px 4px',
                borderBottom: '0.5px solid rgba(0,140,255,0.07)',
              }}
            >
              <span style={{ fontSize: 11, color: '#2a5a8a', width: 32, flexShrink: 0 }}>
                {item.time}
              </span>
              <span style={{ fontSize: 12, color: '#5080a0', flex: 1 }} className="truncate">
                {item.label}
              </span>
              {item.done && (
                <i className="ti ti-circle-check" style={{ fontSize: 14, color: '#2a9060' }} />
              )}
            </motion.div>
          ))}
        </div>
        <p
          style={{ fontSize: 11, color: '#0070cc', textAlign: 'right', marginTop: 6, cursor: 'pointer' }}
          onClick={() => {}}
        >
          Barchasini ko'rish &rsaquo;
        </p>
      </section>
    </aside>
  )
}
