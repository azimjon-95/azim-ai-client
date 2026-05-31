import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './components/sidebar/Sidebar'
import Header from './components/panels/Header'
import RightPanel from './components/panels/RightPanel'
import HomePage from './pages/HomePage'
import HistoryPage from './pages/HistoryPage'
import CommandsPage from './pages/CommandsPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import VoiceClonePage from './pages/VoiceClonePage'
import { useStore } from './services/store'
import { useSocket } from './hooks/useSocket'

const PAGES = {
  home: HomePage,
  history: HistoryPage,
  commands: CommandsPage,
  settings: SettingsPage,
  profile: ProfilePage,
  voice: VoiceClonePage,
}

export default function App() {
  const { activePage } = useStore()
  useSocket()

  const PageComponent = PAGES[activePage] || HomePage

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#060d1a',
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 60% 50% at 40% 50%, rgba(0,100,255,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header />

        <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
          {/* Main content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                borderRight: activePage === 'home' ? '0.5px solid rgba(0,140,255,0.1)' : 'none',
                overflow: 'hidden',
              }}
            >
              <PageComponent />
            </motion.div>
          </AnimatePresence>

          {/* Right panel only on home */}
          {activePage === 'home' && <RightPanel />}
        </div>
      </div>
    </div>
  )
}
