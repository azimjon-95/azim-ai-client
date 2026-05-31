import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const USER_ID = 'azimjon'

const SAMPLE_TEXT = `Salom, men Azim. Bugun ob-havo juda yaxshi, quyosh chiqib turibdi.
Men sizning shaxsiy AI yordamchingizman va har qanday masalada yordam beraman.`

export default function VoiceClonePage() {
  const [status, setStatus] = useState(null)
  const [recording, setRecording] = useState(false)
  const [recTime, setRecTime] = useState(0)
  const [blob, setBlob] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [testText, setTestText] = useState('Salom! Men Azim. Bugun sizga qanday yordam bera olaman?')
  const [playing, setPlaying] = useState(false)
  const [log, setLog] = useState([])

  const mrRef   = useRef(null)
  const timer   = useRef(null)
  const chunks  = useRef([])
  const audioEl = useRef(null)

  useEffect(() => { fetch_(); return () => clearInterval(timer.current) }, [])

  const fetch_ = async () => {
    try {
      const r = await axios.get(`${API}/voice/status?userId=${USER_ID}`)
      setStatus(r.data)
    } catch {
      setStatus({ samplesCount:0, coquiRunning:false, instructions:'Server bilan ulanib boʻlmadi' })
    }
  }

  const lg = (msg, type='info') =>
    setLog(p => [{ msg, type, ts: new Date().toLocaleTimeString() }, ...p].slice(0,8))

  // ── RECORD ──
  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      chunks.current = []
      const mr = new MediaRecorder(stream, { mimeType:'audio/webm' })
      mr.ondataavailable = e => { if (e.data.size>0) chunks.current.push(e.data) }
      mr.onstop = () => {
        setBlob(new Blob(chunks.current, { type:'audio/webm' }))
        stream.getTracks().forEach(t => t.stop())
        lg('Yozildi! Yuklang.', 'success')
      }
      mr.start(100); mrRef.current = mr
      setRecording(true); setRecTime(0)
      timer.current = setInterval(() => setRecTime(t => t+1), 1000)
    } catch { lg('Mikrofon ruxsati kerak!', 'error') }
  }

  const stopRec = () => {
    mrRef.current?.stop()
    clearInterval(timer.current)
    setRecording(false)
  }

  // ── UPLOAD ──
  const upload = async () => {
    if (!blob) return lg('Avval ovoz yozing!', 'error')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('audio', blob, 'sample.webm')
      fd.append('userId', USER_ID)
      const r = await axios.post(`${API}/voice/sample`, fd)
      lg(r.data.message, 'success')
      setBlob(null)
      await fetch_()
    } catch (e) {
      lg('Yuklash xatosi: ' + (e.response?.data?.error || e.message), 'error')
    } finally { setUploading(false) }
  }

  // ── SYNTHESIZE ──
  const synthesize = async () => {
    if (!testText.trim()) return
    setPlaying(true)
    lg('Ovoz sintezi...', 'info')
    try {
      const r = await axios.post(`${API}/voice/synthesize`,
        { text: testText, userId: USER_ID, language: 'en' },
        { responseType:'blob', timeout: 60000 })
      const url = URL.createObjectURL(r.data)
      if (audioEl.current) {
        audioEl.current.src = url
        audioEl.current.play()
        audioEl.current.onended = () => { setPlaying(false); URL.revokeObjectURL(url) }
      }
      lg('Klonlangan ovozda gapiryapti!', 'success')
    } catch (e) {
      lg('Sintez xatosi: '+(e.response?.data?.error||e.message), 'error')
      setPlaying(false)
    }
  }

  const clearAll = async () => {
    if (!confirm("Barcha namunalarni o'chirasizmi?")) return
    await axios.delete(`${API}/voice/samples?userId=${USER_ID}`)
    lg("O'chirildi", 'warn')
    await fetch_()
  }

  const prog = Math.min((status?.samplesCount||0)/3,1)*100

  const Card = ({children, style={}}) => (
    <div style={{
      background:'rgba(0,20,50,0.6)',
      border:'0.5px solid rgba(0,140,255,0.15)',
      borderRadius:12,padding:16,marginBottom:14,...style,
    }}>{children}</div>
  )

  const SectionTitle = ({children}) => (
    <p style={{fontSize:11,color:'#4a7aaa',marginBottom:10,
      textTransform:'uppercase',letterSpacing:'.8px',fontWeight:500}}>
      {children}
    </p>
  )

  const Btn = ({onClick,disabled,color,children,style={}}) => (
    <motion.button onClick={onClick} disabled={disabled}
      whileHover={{scale:disabled?1:1.03}} whileTap={{scale:disabled?1:.96}}
      style={{
        padding:'10px 20px',borderRadius:8,border:'none',cursor:disabled?'not-allowed':'pointer',
        background:disabled?'rgba(255,255,255,0.06)':color,
        color:disabled?'#3a5a7a':'#fff',fontSize:13,fontFamily:"'Exo 2',sans-serif",
        display:'flex',alignItems:'center',gap:8,...style,
      }}>
      {children}
    </motion.button>
  )

  return (
    <div style={{flex:1,overflowY:'auto',padding:'20px 22px',fontFamily:"'Exo 2',sans-serif"}}>
      <audio ref={audioEl} hidden/>

      <h2 style={{fontFamily:"'Orbitron',monospace",fontSize:16,color:'#0099ff',marginBottom:4}}>
        🎙️ Ovoz Klonlash
      </h2>
      <p style={{fontSize:12,color:'#4a7aaa',marginBottom:18}}>XTTS v2 — AI sizning ovozingizda gapiradi</p>

      {/* STATUS */}
      {status && (
        <Card>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
            <span style={{fontSize:13,color:'#a0c8e8'}}>
              Namunalar: <strong style={{color:'#0099ff'}}>{status.samplesCount}</strong>/3
            </span>
            <span style={{
              fontSize:11,padding:'3px 10px',borderRadius:20,
              background: status.coquiRunning?'rgba(0,180,100,0.15)':'rgba(255,100,60,0.15)',
              color: status.coquiRunning?'#3dbf6f':'#ff6644',
              border:`0.5px solid ${status.coquiRunning?'rgba(0,180,100,0.3)':'rgba(255,100,60,0.3)'}`,
            }}>
              {status.coquiRunning ? '● XTTS Online' : '● XTTS Offline'}
            </span>
          </div>
          <div style={{height:6,background:'rgba(255,255,255,0.06)',borderRadius:3,overflow:'hidden'}}>
            <motion.div style={{height:'100%',borderRadius:3,background:'linear-gradient(90deg,#0055cc,#00aaff)'}}
              animate={{width:`${prog}%`}} transition={{duration:.5}}/>
          </div>
          <p style={{fontSize:11,color:'#4a7aaa',marginTop:8}}>{status.instructions}</p>
          {!status.coquiRunning && (
            <div style={{marginTop:10,padding:'8px 12px',background:'rgba(255,150,0,0.08)',
              border:'0.5px solid rgba(255,150,0,0.2)',borderRadius:8,fontSize:11,color:'#cc9944'}}>
              <strong>O'rnatish:</strong><br/>
              <code style={{color:'#ffaa44'}}>pip install TTS</code><br/>
              <code style={{color:'#ffaa44',fontSize:10}}>tts-server --model_name tts_models/multilingual/multi-dataset/xtts_v2</code>
            </div>
          )}
        </Card>
      )}

      {/* RECORD */}
      <Card>
        <SectionTitle>1. Ovoz Namunasi Yozish (5-10 soniya)</SectionTitle>
        <div style={{background:'rgba(0,60,120,0.2)',borderRadius:8,padding:'10px 14px',
          marginBottom:14,fontSize:13,color:'#a0c8e8',lineHeight:1.6,fontStyle:'italic'}}>
          "{SAMPLE_TEXT}"
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
          <Btn onClick={recording ? stopRec : startRec}
            color={recording?'linear-gradient(135deg,#bb0022,#ff2255)':'linear-gradient(135deg,#0050cc,#0088ff)'}>
            {recording && <motion.div style={{width:8,height:8,borderRadius:'50%',background:'#fff'}}
              animate={{opacity:[1,.2,1]}} transition={{duration:.6,repeat:Infinity}}/>}
            <i className={`ti ${recording?'ti-square':'ti-microphone'}`}/>
            {recording ? `To'xtatish (${recTime}s)` : 'Yozishni boshlash'}
          </Btn>

          {blob && !recording && (
            <Btn onClick={upload} disabled={uploading}
              color={uploading?'rgba(0,140,255,0.3)':'linear-gradient(135deg,#007744,#00bb66)'}>
              <i className={`ti ${uploading?'ti-loader':'ti-upload'}`}
                style={uploading?{animation:'spin 1s linear infinite'}:{}}/>
              {uploading ? 'Yuklanmoqda...' : 'Namunani yuklash'}
            </Btn>
          )}
        </div>
      </Card>

      {/* TEST */}
      <Card>
        <SectionTitle>2. Klonlangan Ovozni Sinash</SectionTitle>
        <textarea value={testText} onChange={e=>setTestText(e.target.value)} rows={3}
          placeholder="Sinash uchun matn..."
          style={{
            width:'100%',background:'rgba(0,40,100,0.3)',
            border:'0.5px solid rgba(0,140,255,0.2)',borderRadius:8,
            padding:'10px 14px',fontSize:13,color:'#c0d8f0',outline:'none',
            resize:'none',fontFamily:"'Exo 2',sans-serif",marginBottom:12,
          }}/>
        <Btn onClick={synthesize} disabled={playing || !status?.samplesReady}
          style={{opacity: status?.samplesReady ? 1 : .5}}
          color={playing?'rgba(0,140,255,0.3)':'linear-gradient(135deg,#440099,#7700ff)'}>
          <i className={`ti ${playing?'ti-volume':'ti-player-play'}`}/>
          {playing ? 'Gapiryapman...' : !status?.samplesReady ? 'Avval namuna yuklang' : "Mening ovozimda o'qi"}
        </Btn>
      </Card>

      {/* LOG */}
      <AnimatePresence>
        {log.length > 0 && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{background:'rgba(0,10,25,0.8)',border:'0.5px solid rgba(0,140,255,0.1)',
              borderRadius:10,padding:12,marginBottom:12}}>
            <p style={{fontSize:10,color:'#2a5080',marginBottom:6,textTransform:'uppercase',letterSpacing:'.8px'}}>Log</p>
            {log.map((l,i)=>(
              <div key={i} style={{fontSize:11,marginBottom:3,display:'flex',gap:8}}>
                <span style={{color:'#2a5a8a',flexShrink:0}}>{l.ts}</span>
                <span style={{color:l.type==='error'?'#ff6644':l.type==='success'?'#3dbf6f':l.type==='warn'?'#ffaa44':'#7ab0d8'}}>
                  {l.msg}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {status?.samplesCount > 0 && (
        <button onClick={clearAll} style={{
          padding:'7px 16px',borderRadius:8,
          border:'0.5px solid rgba(255,60,60,0.3)',background:'rgba(255,60,60,0.08)',
          color:'#ff6644',fontSize:12,cursor:'pointer',fontFamily:"'Exo 2',sans-serif",
          display:'flex',alignItems:'center',gap:6,
        }}>
          <i className="ti ti-trash"/>
          Barcha namunalarni o'chirish
        </button>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
