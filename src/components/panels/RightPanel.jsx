import { motion } from 'framer-motion'
import { useStore } from '../../services/store'
import { getSocket } from '../../services/socket'

const CMDS = [
  { id:'youtube',  icon:'ti-brand-youtube',  label:'YouTube och',       color:'#ff5555', bg:'rgba(255,60,60,0.12)',  cmd:'YouTube och'  },
  { id:'telegram', icon:'ti-brand-telegram', label:'Telegram och',      color:'#2aabee', bg:'rgba(42,171,238,0.12)', cmd:'Telegram och' },
  { id:'google',   icon:'ti-brand-google',   label:'Google och',        color:'#6699ff', bg:'rgba(66,133,244,0.12)', cmd:'Google och'   },
  { id:'weather',  icon:'ti-cloud-rain',      label:"Ob-havoni ko'rsat", color:'#7dcfee', bg:'rgba(100,200,230,0.12)',cmd:'ob-havo'      },
  { id:'message',  icon:'ti-message-2',       label:'Xabar yozish',     color:'#9090ff', bg:'rgba(120,120,255,0.12)',cmd:'xabar yoz'    },
]

export default function RightPanel() {
  const { recentCommands, addRecentCommand } = useStore()
  const socket = getSocket()

  const run = (cmd) => {
    socket.emit('voice:command', { text: cmd.cmd })
    addRecentCommand(cmd.label)
  }

  return (
    <aside style={{width:222,flexShrink:0,padding:'14px 13px',display:'flex',flexDirection:'column',gap:14,overflowY:'auto'}}>

      {/* Tezkor buyruqlar */}
      <section>
        <p style={{fontSize:11,fontWeight:500,color:'#4a7aaa',letterSpacing:'.8px',textTransform:'uppercase',marginBottom:8}}>
          Tezkor buyruqlar
        </p>
        <div style={{display:'flex',flexDirection:'column',gap:4}}>
          {CMDS.map((c,i)=>(
            <motion.button key={c.id}
              initial={{opacity:0,x:18}} animate={{opacity:1,x:0}} transition={{delay:i*.07}}
              whileHover={{x:2}} whileTap={{scale:.97}}
              onClick={()=>run(c)}
              style={{
                display:'flex',alignItems:'center',gap:9,padding:'7px 10px',
                border:'0.5px solid rgba(0,140,255,0.12)',background:'rgba(0,30,60,0.4)',
                borderRadius:8,cursor:'pointer',textAlign:'left',width:'100%',
                fontFamily:"'Exo 2',sans-serif",
              }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(0,60,120,0.45)';e.currentTarget.style.borderColor='rgba(0,140,255,0.3)'}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(0,30,60,0.4)';e.currentTarget.style.borderColor='rgba(0,140,255,0.12)'}}>
              <div style={{width:28,height:28,borderRadius:6,background:c.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <i className={`ti ${c.icon}`} style={{fontSize:14,color:c.color}}/>
              </div>
              <span style={{fontSize:12.5,color:'#80b0d8',flex:1}}>{c.label}</span>
              <i className="ti ti-chevron-right" style={{fontSize:13,color:'#2a5080'}}/>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Oxirgi buyruqlar */}
      <section>
        <p style={{fontSize:11,fontWeight:500,color:'#4a7aaa',letterSpacing:'.8px',textTransform:'uppercase',marginBottom:8}}>
          Oxirgi buyruqlar
        </p>
        <div style={{display:'flex',flexDirection:'column'}}>
          {recentCommands.slice(0,5).map((item,i)=>(
            <motion.div key={i} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*.05}}
              style={{display:'flex',alignItems:'center',gap:8,padding:'6px 4px',borderBottom:'0.5px solid rgba(0,140,255,0.07)'}}>
              <span style={{fontSize:11,color:'#2a5a8a',width:32,flexShrink:0}}>{item.time}</span>
              <span style={{fontSize:12,color:'#5080a0',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.label}</span>
              {item.done && <i className="ti ti-circle-check" style={{fontSize:14,color:'#2a9060'}}/>}
            </motion.div>
          ))}
        </div>
        <p style={{fontSize:11,color:'#0070cc',textAlign:'right',marginTop:6,cursor:'pointer'}}>
          Barchasini ko'rish &rsaquo;
        </p>
      </section>
    </aside>
  )
}
