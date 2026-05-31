import { useStore } from '../../services/store'
import { motion } from 'framer-motion'

const NAV_ITEMS = [
  { id: 'home', icon: 'ti-home', label: 'Asosiy' },
  { id: 'commands', icon: 'ti-terminal-2', label: 'Buyruq' },
  { id: 'voice', icon: 'ti-microphone-2', label: 'Ovoz' },
  { id: 'history', icon: 'ti-history', label: 'Tarix' },
  { id: 'settings', icon: 'ti-settings', label: 'Sozlama' },
  { id: 'profile', icon: 'ti-user', label: 'Profil' },
]

export default function Sidebar() {
  const { activePage, setActivePage, isListening } = useStore()

  return (
    <nav
      className="flex flex-col items-center py-4 gap-1 flex-shrink-0"
      style={{
        width: 80,
        background: 'rgba(255,255,255,0.02)',
        borderRight: '0.5px solid rgba(0,140,255,0.18)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-center mb-5 rounded-full"
        style={{
          width: 44,
          height: 44,
          background: 'linear-gradient(135deg, #0050cc, #00aaff)',
        }}
      >
        <i className="ti ti-robot text-white text-xl" />
      </div>

      {/* Nav links */}
      {NAV_ITEMS.map((item) => {
        const active = activePage === item.id
        return (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className="relative flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-200"
            style={{
              width: 52,
              height: 52,
              background: active ? 'rgba(0,100,255,0.2)' : 'transparent',
              border: active ? '0.5px solid rgba(0,140,255,0.4)' : '0.5px solid transparent',
              cursor: 'pointer',
            }}
          >
            {active && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute inset-0 rounded-xl"
                style={{ background: 'rgba(0,100,255,0.15)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            <i
              className={`ti ${item.icon} text-xl`}
              style={{ color: active ? '#40aaff' : '#4a6a8a' }}
            />
            <span style={{ fontSize: 9, color: active ? '#7ac0ff' : '#3a5a7a', fontWeight: 500 }}>
              {item.label}
            </span>
          </button>
        )
      })}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Azim indicator badge */}
      <div className="flex flex-col items-center gap-1 pb-2">
        <motion.div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 36,
            height: 36,
            background: 'linear-gradient(135deg, #001844, #003880)',
            border: '1px solid rgba(0,100,200,0.5)',
          }}
          animate={{ boxShadow: isListening ? ['0 0 0 0 rgba(0,200,100,0)', '0 0 0 6px rgba(0,200,100,0.3)', '0 0 0 0 rgba(0,200,100,0)'] : 'none' }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <i className="ti ti-wave-sine text-lg" style={{ color: '#3090ff' }} />
        </motion.div>
        <span style={{ fontSize: 9, color: '#2a5080', textAlign: 'center', lineHeight: 1.3 }}>
          Azim<br />eshitm...
        </span>
      </div>
    </nav>
  )
}
