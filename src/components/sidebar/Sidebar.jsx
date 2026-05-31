import { motion } from 'framer-motion'
import { useStore } from '../../services/store'

const NAV = [
  { id:'home',      icon:'ti-home',          label:'Asosiy'  },
  { id:'commands',  icon:'ti-terminal-2',    label:'Buyruq'  },
  { id:'voice',     icon:'ti-microphone-2',  label:'Ovoz'    },
  { id:'history',   icon:'ti-history',       label:'Tarix'   },
  { id:'settings',  icon:'ti-settings',      label:'Sozlama' },
  { id:'profile',   icon:'ti-user',          label:'Profil'  },
]

export default function Sidebar() {
  const { activePage, setActivePage, isListening } = useStore()

  return (
    <nav style={{
      width:80, flexShrink:0,
      background:'rgba(255,255,255,0.025)',
      borderRight:'0.5px solid rgba(0,140,255,0.18)',
      display:'flex',flexDirection:'column',alignItems:'center',
      padding:'16px 0',gap:4,
    }}>
      {/* Logo */}
      <div style={{
        width:44,height:44,borderRadius:'50%',marginBottom:18,
        background:'linear-gradient(135deg,#0050cc,#00aaff)',
        display:'flex',alignItems:'center',justifyContent:'center',
      }}>
        <i className="ti ti-robot" style={{fontSize:22,color:'#fff'}}/>
      </div>

      {NAV.map(item => {
        const active = activePage === item.id
        return (
          <button key={item.id} onClick={() => setActivePage(item.id)}
            style={{
              width:56,height:56,borderRadius:12,
              display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
              gap:3,cursor:'pointer',border:'none',
              background: active ? 'rgba(0,100,255,0.2)' : 'transparent',
              outline: active ? '0.5px solid rgba(0,140,255,0.4)' : '0.5px solid transparent',
              transition:'all .2s',
            }}>
            <i className={`ti ${item.icon}`}
              style={{fontSize:20,color: active ? '#40aaff' : '#3a5a7a'}}/>
            <span style={{fontSize:9,color: active ? '#7ac0ff' : '#3a5a7a',fontWeight:500,letterSpacing:.3}}>
              {item.label}
            </span>
          </button>
        )
      })}

      <div style={{flex:1}}/>

      {/* Azim badge */}
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,paddingBottom:6}}>
        <motion.div style={{
          width:36,height:36,borderRadius:'50%',
          background:'linear-gradient(135deg,#001844,#003880)',
          border:'1px solid rgba(0,100,200,0.5)',
          display:'flex',alignItems:'center',justifyContent:'center',
        }}
          animate={{boxShadow: isListening
            ? ['0 0 0 0 rgba(0,200,100,0)','0 0 0 6px rgba(0,200,100,0.3)','0 0 0 0 rgba(0,200,100,0)']
            : '0 0 0 0 transparent'}}
          transition={{duration:1.5,repeat:Infinity}}>
          <i className="ti ti-wave-sine" style={{fontSize:17,color:'#3090ff'}}/>
        </motion.div>
        <span style={{fontSize:9,color:'#2a5080',textAlign:'center',lineHeight:1.3}}>
          Azim<br/>eshitm...
        </span>
      </div>
    </nav>
  )
}
