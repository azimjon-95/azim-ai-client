import { motion } from 'framer-motion'
import { getSocket } from '../services/socket'
import { useStore } from '../services/store'

const ALL_COMMANDS = [
  { category: 'Browser', cmds: ['YouTube och', 'Google och', 'Telegram och', 'VS Code och'] },
  { category: 'Sistema', cmds: ['Faylni qidirish', 'Papkani och', 'Dasturni yop', 'Ekranni qulf'] },
  { category: 'Telegram', cmds: ['Xabar yuborish', 'Guruhni och', 'Bildirishnomalar'] },
  { category: 'Ob-Havo', cmds: ["Bugun ob-havo", 'Haftalik prognoz', 'Hozirgi holat'] },
]

export default function CommandsPage() {
  const socket = getSocket()
  const { addRecentCommand } = useStore()

  const run = (cmd) => {
    socket.emit('voice:command', { text: cmd })
    addRecentCommand(cmd)
  }

  return (
    <div className="flex-1 overflow-y-auto p-5">
      <h2 className="font-orbitron mb-4" style={{ fontSize: 16, color: '#0099ff' }}>
        Barcha Buyruqlar
      </h2>
      <div className="flex flex-col gap-5">
        {ALL_COMMANDS.map((group, gi) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.1 }}
          >
            <p style={{ fontSize: 11, color: '#4a7aaa', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              {group.category}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.cmds.map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => run(cmd)}
                  className="rounded-lg transition-all"
                  style={{
                    padding: '8px 14px',
                    border: '0.5px solid rgba(0,140,255,0.22)',
                    background: 'rgba(0,30,70,0.5)',
                    fontSize: 12.5,
                    color: '#7ab0d8',
                    cursor: 'pointer',
                    fontFamily: "'Exo 2', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0,70,160,0.4)'
                    e.currentTarget.style.color = '#a0ccf0'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0,30,70,0.5)'
                    e.currentTarget.style.color = '#7ab0d8'
                  }}
                >
                  {cmd}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
