import { motion } from 'framer-motion'
import { useStore } from '../../services/store'

export default function Header() {
  const { isOnline } = useStore()
  return (
    <header style={{
      padding:'11px 20px',
      borderBottom:'0.5px solid rgba(0,140,255,0.15)',
      background:'rgba(6,13,26,0.95)',
      display:'flex',alignItems:'center',justifyContent:'space-between',
      flexShrink:0,
    }}>
      <div>
        <h1 style={{fontFamily:"'Orbitron',monospace",fontSize:18,fontWeight:700,letterSpacing:.5}}>
          Azim <span style={{color:'#0099ff'}}>AI Assistant</span>
        </h1>
        <p style={{fontSize:11,color:'#4a7aaa',marginTop:2}}>Sizning shaxsiy ovozli yordamchingiz</p>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <button style={{
          background:'rgba(0,140,255,0.1)',border:'0.5px solid rgba(0,140,255,0.3)',
          borderRadius:6,padding:'4px 10px',fontSize:12,color:'#5090d0',cursor:'pointer',
          fontFamily:"'Exo 2',sans-serif",
        }}>🌐 UZ</button>
        <button style={{
          background:'rgba(255,200,0,0.07)',border:'0.5px solid rgba(255,200,0,0.22)',
          borderRadius:6,padding:'4px 10px',fontSize:14,color:'#9a8a50',cursor:'pointer',
        }}>☀</button>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <motion.div style={{
            width:8,height:8,borderRadius:'50%',
            background: isOnline ? '#3dbf6f' : '#ff4466',
          }} animate={{opacity:[1,.3,1]}} transition={{duration:2,repeat:Infinity}}/>
          <span style={{fontSize:12,color: isOnline ? '#3dbf6f' : '#ff4466'}}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    </header>
  )
}
