import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../services/store'

export default function RobotAvatar() {
  const { isListening, isSpeaking } = useStore()
  const mouthRef = useRef(null)

  // Eye tracking
  useEffect(() => {
    const fn = (e) => {
      const svg = document.getElementById('az-svg')
      if (!svg) return
      const r = svg.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width/2)) / (r.width * .5)
      const dy = (e.clientY - (r.top + r.height * .34)) / (r.height * .5)
      const mx = Math.max(-4, Math.min(4, dx * 5))
      const my = Math.max(-2.5, Math.min(2.5, dy * 3))
      ;['az-pL','az-pR'].forEach((id,i) => {
        const el = document.getElementById(id)
        if (el) { el.setAttribute('cx', (i===0?82:138)+mx); el.setAttribute('cy', 77+my) }
      })
    }
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  // Auto blink
  useEffect(() => {
    const blink = () => {
      ['az-bL','az-bR'].forEach(id => {
        const el = document.getElementById(id)
        if (!el) return
        el.style.transition = 'transform .08s'
        el.style.transform = 'scaleY(1)'
        setTimeout(() => { el.style.transform = 'scaleY(0)' }, 130)
      })
    }
    const id = setInterval(blink, 3500 + Math.random()*2000)
    return () => clearInterval(id)
  }, [])

  // Mouth when speaking
  useEffect(() => {
    const idle = document.getElementById('az-mIdle')
    const open = document.getElementById('az-mOpen')
    if (!idle || !open) return
    if (isSpeaking) {
      let ry = 0, dir = 1
      mouthRef.current = setInterval(() => {
        ry = Math.max(0, Math.min(9, ry + dir*(1.2 + Math.random()*2.5)))
        if (ry >= 9) dir = -1
        if (ry <= 0) dir = 1
        open.setAttribute('ry', ry)
        idle.style.opacity = ry > 3 ? '0' : '1'
      }, 72)
    } else {
      clearInterval(mouthRef.current)
      idle.style.opacity = '1'
      open?.setAttribute('ry', '0')
    }
    return () => clearInterval(mouthRef.current)
  }, [isSpeaking])

  const eyeColor = isListening ? '#00ff88' : isSpeaking ? '#00ddff' : '#00ccff'

  return (
    <motion.div style={{position:'relative',width:220,height:260,display:'flex',alignItems:'center',justifyContent:'center'}}
      animate={{y:[0,-9,0]}} transition={{duration:3.5,repeat:Infinity,ease:'easeInOut'}}>

      {/* glow */}
      <motion.div style={{
        position:'absolute',inset:-28,borderRadius:'50%',
        background:'radial-gradient(circle, rgba(0,140,255,0.18) 0%, transparent 68%)',
      }} animate={{scale:[1,1.1,1],opacity:[.45,.9,.45]}} transition={{duration:3,repeat:Infinity}}/>

      {/* rings when active */}
      {(isListening||isSpeaking) && [0,.5,1].map((d,i)=>(
        <motion.div key={i} style={{
          position:'absolute',inset:0,borderRadius:'50%',
          border:`1.5px solid ${isListening?'rgba(0,220,100,0.4)':'rgba(0,150,255,0.4)'}`,
        }} initial={{scale:.85,opacity:.9}} animate={{scale:1.65,opacity:0}}
          transition={{duration:1.8,repeat:Infinity,delay:d,ease:'easeOut'}}/>
      ))}

      <svg id="az-svg" width="215" height="258" viewBox="0 0 220 260" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="hg" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#1a3a6e"/><stop offset="100%" stopColor="#091428"/></radialGradient>
          <radialGradient id="fg" cx="50%" cy="35%" r="55%"><stop offset="0%" stopColor="#0d2044"/><stop offset="100%" stopColor="#040d1c"/></radialGradient>
          <radialGradient id="eg" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={eyeColor}/><stop offset="100%" stopColor="#003888"/></radialGradient>
          <filter id="ef"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>

        {/* ── DUPPI ── */}
        <ellipse cx="110" cy="34" rx="57" ry="20" fill="#0c0c0c" stroke="#1c1c1c" strokeWidth="1"/>
        <path d="M53 34 Q53 3 110 3 Q167 3 167 34Z" fill="#080808" stroke="#141414" strokeWidth="1"/>
        <circle cx="110" cy="5.5" r="5.5" fill="#c8a500" stroke="#ffd700" strokeWidth=".6"/>
        {/* embroidery white geo */}
        <ellipse cx="110" cy="34" rx="57" ry="20" fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="1.8"/>
        <line x1="110" y1="5.5" x2="78"  y2="34" stroke="rgba(255,255,255,0.09)" strokeWidth="1"/>
        <line x1="110" y1="5.5" x2="142" y2="34" stroke="rgba(255,255,255,0.09)" strokeWidth="1"/>
        <line x1="110" y1="5.5" x2="110" y2="34" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
        {/* diamonds */}
        <polygon points="110,10 115,18 110,26 105,18" fill="none" stroke="rgba(255,210,0,.55)" strokeWidth=".9"/>
        <polygon points="82,20 87,27 82,34 77,27"   fill="none" stroke="rgba(255,210,0,.38)" strokeWidth=".7"/>
        <polygon points="138,20 143,27 138,34 133,27" fill="none" stroke="rgba(255,210,0,.38)" strokeWidth=".7"/>
        {/* dots */}
        {[[88,13],[132,13],[68,26],[152,26]].map(([cx,cy],i)=>(
          <circle key={i} cx={cx} cy={cy} r="1.2" fill="rgba(255,210,0,.6)"/>
        ))}
        {/* zigzag band */}
        <polyline points="53,34 62,30 71,34 80,30 89,34 98,30 107,34 116,30 125,34 134,30 143,34 152,30 161,34 167,30 167,34"
          fill="none" stroke="rgba(255,255,255,.14)" strokeWidth=".7"/>

        {/* ── HEAD ── */}
        <rect x="36" y="32" width="148" height="90" rx="23" fill="url(#hg)" stroke="#1a4a7a" strokeWidth="1.2"/>
        <line x1="36" y1="52" x2="184" y2="52" stroke="rgba(0,140,255,.12)" strokeWidth=".5"/>
        <rect x="50" y="54" width="120" height="62" rx="15" fill="url(#fg)" stroke="rgba(0,100,200,.2)" strokeWidth=".5"/>

        {/* ── EYES ── */}
        {[82,138].map((cx,i)=>(
          <g key={i}>
            <ellipse cx={cx} cy="78" rx="17" ry="15" fill="#000c1e" stroke="#005299" strokeWidth="1.2"/>
            <ellipse cx={cx} cy="78" rx="12" ry="11" fill="#001224"/>
            <ellipse id={i===0?'az-pL':'az-pR'} cx={cx} cy="78" rx="7.5" ry="7.5" fill="url(#eg)" filter="url(#ef)"/>
            <circle cx={cx+3} cy="75" r="2.5" fill="rgba(180,235,255,.72)"/>
            <ellipse id={i===0?'az-bL':'az-bR'} cx={cx} cy="78" rx="17" ry="15" fill="#091428"
              style={{transformOrigin:`${cx}px 78px`,transform:'scaleY(0)'}}/>
          </g>
        ))}

        {/* ── MOUTH ── */}
        <path id="az-mIdle" d="M92 104 Q110 113 128 104" stroke="#0077cc" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <ellipse id="az-mOpen" cx="110" cy="106" rx="14" ry="0" fill="#000e1c" stroke="#0077cc" strokeWidth="1"/>

        {/* ── EARS ── */}
        <rect x="21" y="55" width="17" height="30" rx="8.5" fill="#091428" stroke="#1a4a7a" strokeWidth=".8"/>
        <rect x="24.5" y="63" width="9" height="13" rx="4.5" fill="#003280" opacity=".8"/>
        <rect x="182" y="55" width="17" height="30" rx="8.5" fill="#091428" stroke="#1a4a7a" strokeWidth=".8"/>
        <rect x="186.5" y="63" width="9" height="13" rx="4.5" fill="#003280" opacity=".8"/>

        {/* antennas */}
        <line x1="74" y1="32" x2="58" y2="15" stroke="rgba(0,140,255,.45)" strokeWidth="1.2"/>
        <circle cx="58" cy="14" r="3.8" fill="#0066cc" stroke="#00aaff" strokeWidth=".8"><animate attributeName="opacity" values="1;.3;1" dur="1.4s" repeatCount="indefinite"/></circle>
        <line x1="146" y1="32" x2="162" y2="15" stroke="rgba(0,140,255,.45)" strokeWidth="1.2"/>
        <circle cx="162" cy="14" r="3.8" fill="#0066cc" stroke="#00aaff" strokeWidth=".8"><animate attributeName="opacity" values="1;.3;1" dur="1.4s" begin=".7s" repeatCount="indefinite"/></circle>

        {/* ── NECK ── */}
        <rect x="93" y="122" width="34" height="18" rx="5" fill="#0a1a30" stroke="#1a4a7a" strokeWidth=".8"/>
        <line x1="93" y1="128" x2="127" y2="128" stroke="rgba(0,140,255,.18)" strokeWidth=".5"/>
        <line x1="93" y1="134" x2="127" y2="134" stroke="rgba(0,140,255,.18)" strokeWidth=".5"/>

        {/* ── BODY ── */}
        <rect x="44" y="140" width="132" height="100" rx="20" fill="url(#hg)" stroke="#1a4a7a" strokeWidth="1.2"/>
        <rect x="60" y="152" width="100" height="64" rx="9" fill="rgba(0,28,65,.55)" stroke="rgba(0,100,200,.22)" strokeWidth=".5"/>
        <rect x="68" y="160" width="36" height="20" rx="4" fill="#001840" stroke="rgba(0,140,255,.25)" strokeWidth=".5"/>
        <rect x="72" y="164" width="11" height="7" rx="2" fill={isSpeaking?'#00bbff':'#0055cc'}/>
        <rect x="87" y="164" width="11" height="7" rx="2" fill={isListening?'#00ff88':'#00aaff'}/>
        <rect x="116" y="160" width="36" height="20" rx="4" fill="#001840" stroke="rgba(0,140,255,.25)" strokeWidth=".5"/>
        <rect x="120" y="164" width="11" height="7" rx="2" fill="#004299"/>
        <rect x="135" y="164" width="11" height="7" rx="2" fill="#0077ff"/>
        <circle cx="110" cy="196" r="12" fill="#001224" stroke="rgba(0,170,255,.35)" strokeWidth="1"/>
        <circle cx="110" cy="196" r="7" fill={isSpeaking?'#00aaff':'#0044cc'}><animate attributeName="r" values="7;9;7" dur="2s" repeatCount="indefinite"/></circle>

        {/* ── ARMS ── */}
        <rect x="20" y="144" width="26" height="64" rx="13" fill="#0a1728" stroke="#1a4a7a" strokeWidth=".8" transform="rotate(-8 33 176)"/>
        <rect x="174" y="144" width="26" height="64" rx="13" fill="#0a1728" stroke="#1a4a7a" strokeWidth=".8" transform="rotate(8 187 176)"/>
        <rect x="24" y="163" width="18" height="5" rx="2.5" fill="rgba(0,140,255,.22)" transform="rotate(-8 33 165)"/>
        <rect x="178" y="163" width="18" height="5" rx="2.5" fill="rgba(0,140,255,.22)" transform="rotate(8 187 165)"/>
      </svg>
    </motion.div>
  )
}
