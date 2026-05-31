import { motion } from 'framer-motion'
import RobotAvatar from '../components/robot/RobotAvatar'
import Waveform from '../components/robot/Waveform'
import { useVoice } from '../hooks/useVoice'
import { useStore } from '../services/store'
import { getSocket } from '../services/socket'

const QUICK = [
  { label:'YouTube och',      icon:'ti-brand-youtube',  color:'#ff5555', cmd:'YouTube och'  },
  { label:'Telegram och',     icon:'ti-brand-telegram', color:'#2aabee', cmd:'Telegram och' },
  { label:'Google och',       icon:'ti-brand-google',   color:'#6699ff', cmd:'Google och'   },
  { label:"Ob-havoni ko'rsat",icon:'ti-cloud-rain',     color:'#7dcfee', cmd:'ob-havo'      },
  { label:'Xabar yozish',     icon:'ti-message-2',      color:'#9090ff', cmd:'xabar yoz'    },
]

export default function HomePage() {
  const { toggleListening } = useVoice()
  const { isListening, isSpeaking, transcript, response, addRecentCommand } = useStore()
  const socket = getSocket()

  const run = (btn) => { socket.emit('voice:command',{text:btn.cmd}); addRecentCommand(btn.label) }

  return (
    <main style={{
      flex:1,display:'flex',flexDirection:'column',alignItems:'center',
      overflowY:'auto',padding:'22px 20px',
      background:'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(0,80,200,0.07) 0%, transparent 75%)',
    }}>
      <motion.div initial={{opacity:0,y:-18}} animate={{opacity:1,y:0}} transition={{duration:.6}}>
        <RobotAvatar/>
      </motion.div>

      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.3}} style={{margin:'4px 0 12px'}}>
        <Waveform/>
      </motion.div>

      <motion.h2 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.4}}
        style={{fontFamily:"'Orbitron',monospace",fontSize:20,fontWeight:500,textAlign:'center',marginBottom:6}}>
        Salom, men <span style={{color:'#0099ff'}}>Azim!</span>
      </motion.h2>

      <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.5}}
        style={{fontSize:12,color:'#4a7aaa',textAlign:'center',marginBottom:20,minHeight:18}}>
        {transcript ? `"${transcript}"` : response ? response : 'Buyruq bering yoki gapiring, men eshitayapman...'}
      </motion.p>

      {/* Mic */}
      <motion.div initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} transition={{delay:.55,type:'spring'}}
        style={{position:'relative',marginBottom:10}}>
        {(isListening||isSpeaking) && [0,.5,1].map((d,i)=>(
          <motion.div key={i} style={{
            position:'absolute',inset:0,borderRadius:'50%',
            border:`1.5px solid ${isListening?'rgba(0,210,100,0.4)':'rgba(0,140,255,0.4)'}`,
          }} initial={{scale:.85,opacity:.9}} animate={{scale:1.7,opacity:0}}
            transition={{duration:1.8,repeat:Infinity,delay:d,ease:'easeOut'}}/>
        ))}
        <motion.button onClick={toggleListening}
          whileHover={{scale:1.07}} whileTap={{scale:.93}}
          style={{
            width:62,height:62,borderRadius:'50%',border:'none',cursor:'pointer',
            background: isListening
              ? 'linear-gradient(135deg,#bb0030,#ff2255)'
              : isSpeaking
              ? 'linear-gradient(135deg,#007040,#00bb66)'
              : 'linear-gradient(135deg,#0050cc,#0088ff)',
            display:'flex',alignItems:'center',justifyContent:'center',
            position:'relative',zIndex:1,
            boxShadow: isListening?'0 0 22px rgba(200,0,50,.4)':'0 0 22px rgba(0,100,255,.28)',
          }}>
          <i className={`ti ${isListening?'ti-microphone-off':'ti-microphone'}`}
            style={{fontSize:27,color:'#fff'}}/>
        </motion.button>
      </motion.div>

      <p style={{fontSize:11,color:'#4a7aaa',marginBottom:22}}>
        {isListening?'Tinglayapman...':isSpeaking?'Gapiryapman...':'Gapirish uchun bosing'}
      </p>

      {/* Quick buttons */}
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:.65}}
        style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',maxWidth:480}}>
        {QUICK.map(btn=>(
          <motion.button key={btn.cmd} onClick={()=>run(btn)}
            whileHover={{scale:1.04,y:-1}} whileTap={{scale:.96}}
            style={{
              display:'flex',alignItems:'center',gap:7,padding:'7px 14px',
              border:'0.5px solid rgba(0,140,255,0.25)',background:'rgba(0,60,120,0.28)',
              borderRadius:20,fontSize:12,color:'#7ab0e0',cursor:'pointer',
              fontFamily:"'Exo 2',sans-serif",
            }}>
            <i className={`ti ${btn.icon}`} style={{fontSize:14,color:btn.color}}/>
            {btn.label}
          </motion.button>
        ))}
      </motion.div>
    </main>
  )
}
