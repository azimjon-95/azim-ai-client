import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const USER_ID = 'azimjon'

export default function VoiceClonePage() {
  const [status, setStatus] = useState(null)
  const [recording, setRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [chunks, setChunks] = useState([])
  const [uploading, setUploading] = useState(false)
  const [testText, setTestText] = useState("Salom, men Azim! Bugun ob-havo yaxshi.")
  const [playing, setPlaying] = useState(false)
  const [log, setLog] = useState([])
  const [audioBlob, setAudioBlob] = useState(null)

  const mediaRef = useRef(null)
  const timerRef = useRef(null)
  const chunksRef = useRef([])
  const audioRef = useRef(null)

  useEffect(() => {
    fetchStatus()
    return () => clearInterval(timerRef.current)
  }, [])

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${API}/voice/status?userId=${USER_ID}`)
      setStatus(res.data)
    } catch {
      setStatus({ samplesCount: 0, coquiRunning: false, instructions: 'Server bilan ulanib bo\'lmadi' })
    }
  }

  const addLog = (msg, type = 'info') => {
    setLog((prev) => [{ msg, type, ts: new Date().toLocaleTimeString() }, ...prev].slice(0, 10))
  }

  // ── RECORD ────────────────────────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      chunksRef.current = []
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        stream.getTracks().forEach((t) => t.stop())
        addLog('Yozib olindi! Endi yuklang.', 'success')
      }
      mr.start(100)
      mediaRef.current = mr
      setRecording(true)
      setRecordingTime(0)
      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000)
    } catch (err) {
      addLog('Mikrofon ruxsati kerak!', 'error')
    }
  }

  const stopRecording = () => {
    mediaRef.current?.stop()
    clearInterval(timerRef.current)
    setRecording(false)
  }

  // ── UPLOAD SAMPLE ─────────────────────────────────────────────────────────
  const uploadSample = async () => {
    if (!audioBlob) return addLog('Avval ovoz yozing!', 'error')
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'sample.webm')
      formData.append('userId', USER_ID)
      const res = await axios.post(`${API}/voice/sample`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      addLog(res.data.message, 'success')
      setAudioBlob(null)
      await fetchStatus()
    } catch (err) {
      addLog('Yuklash xatosi: ' + (err.response?.data?.error || err.message), 'error')
    } finally {
      setUploading(false)
    }
  }

  // ── TEST VOICE CLONE ──────────────────────────────────────────────────────
  const testClone = async () => {
    if (!testText.trim()) return
    setPlaying(true)
    addLog('Ovoz sintezi boshlandi...', 'info')
    try {
      const res = await axios.post(
        `${API}/voice/synthesize`,
        { text: testText, userId: USER_ID, language: 'en' },
        { responseType: 'blob', timeout: 40000 }
      )
      const url = URL.createObjectURL(res.data)
      if (audioRef.current) {
        audioRef.current.src = url
        audioRef.current.play()
        audioRef.current.onended = () => {
          setPlaying(false)
          URL.revokeObjectURL(url)
        }
      }
      addLog('Klonlangan ovozda gapirmoqda!', 'success')
    } catch (err) {
      addLog('Sintez xatosi: ' + (err.response?.data?.error || err.message), 'error')
      setPlaying(false)
    }
  }

  // ── CLEAR SAMPLES ─────────────────────────────────────────────────────────
  const clearSamples = async () => {
    if (!confirm("Barcha ovoz namunalarini o'chirasizmi?")) return
    await axios.delete(`${API}/voice/samples?userId=${USER_ID}`)
    addLog("Barcha namunalar o'chirildi", 'warn')
    await fetchStatus()
  }

  const progress = Math.min((status?.samplesCount || 0) / 3, 1) * 100

  return (
    <div className="flex-1 overflow-y-auto p-5" style={{ fontFamily: "'Exo 2', sans-serif" }}>
      <audio ref={audioRef} hidden />

      <h2 className="font-orbitron mb-1" style={{ fontSize: 16, color: '#0099ff' }}>
        🎙️ Ovoz Klonlash
      </h2>
      <p style={{ fontSize: 12, color: '#4a7aaa', marginBottom: 20 }}>
        XTTS v2 — sizning ovozingizda gapiradi
      </p>

      {/* STATUS CARD */}
      {status && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(0,20,50,0.6)',
            border: '0.5px solid rgba(0,140,255,0.2)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span style={{ fontSize: 13, color: '#a0c8e8' }}>
              Namunalar: <strong style={{ color: '#0099ff' }}>{status.samplesCount}</strong> / 3
            </span>
            <span
              style={{
                fontSize: 11,
                padding: '3px 10px',
                borderRadius: 20,
                background: status.coquiRunning ? 'rgba(0,180,100,0.15)' : 'rgba(255,100,60,0.15)',
                color: status.coquiRunning ? '#3dbf6f' : '#ff6644',
                border: `0.5px solid ${status.coquiRunning ? 'rgba(0,180,100,0.3)' : 'rgba(255,100,60,0.3)'}`,
              }}
            >
              {status.coquiRunning ? '● XTTS Online' : '● XTTS Offline'}
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
            <motion.div
              style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #0055cc, #00aaff)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <p style={{ fontSize: 11, color: '#4a7aaa', marginTop: 8 }}>{status.instructions}</p>

          {!status.coquiRunning && (
            <div
              style={{
                marginTop: 10,
                padding: '8px 12px',
                background: 'rgba(255,150,0,0.08)',
                border: '0.5px solid rgba(255,150,0,0.2)',
                borderRadius: 8,
                fontSize: 11,
                color: '#cc9944',
              }}
            >
              <strong>XTTS o'rnatish:</strong>
              <br />
              <code style={{ color: '#ffaa44' }}>pip install TTS</code>
              <br />
              <code style={{ color: '#ffaa44' }}>
                tts-server --model_name tts_models/multilingual/multi-dataset/xtts_v2
              </code>
            </div>
          )}
        </motion.div>
      )}

      {/* RECORD SECTION */}
      <div
        style={{
          background: 'rgba(0,20,50,0.6)',
          border: '0.5px solid rgba(0,140,255,0.15)',
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <p style={{ fontSize: 12, color: '#4a7aaa', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          1. Ovoz Namunasi Yozish
        </p>
        <p style={{ fontSize: 12, color: '#7090a8', marginBottom: 14 }}>
          Quyidagi matnni o'qing (5-10 soniya):
        </p>

        {/* Sample texts */}
        <div
          style={{
            background: 'rgba(0,60,120,0.2)',
            borderRadius: 8,
            padding: '10px 14px',
            marginBottom: 14,
            fontSize: 13,
            color: '#a0c8e8',
            lineHeight: 1.6,
            fontStyle: 'italic',
          }}
        >
          "Salom, men Azim. Bugun ob-havo juda yaxshi, quyosh chiqib turibdi.
          Men sizning shaxsiy AI yordamchingizman va sizga har qanday masalada
          yordam berishga tayyorman."
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            onClick={recording ? stopRecording : startRecording}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '10px 22px',
              borderRadius: 8,
              border: 'none',
              background: recording
                ? 'linear-gradient(135deg, #cc0033, #ff2255)'
                : 'linear-gradient(135deg, #0050cc, #0088ff)',
              color: '#fff',
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: "'Exo 2', sans-serif",
            }}
          >
            <i className={`ti ${recording ? 'ti-square' : 'ti-microphone'}`} />
            {recording ? `To'xtatish (${recordingTime}s)` : 'Yozishni boshlash'}
          </motion.button>

          {recording && (
            <motion.div
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff2255' }}
            />
          )}

          {audioBlob && !recording && (
            <motion.button
              onClick={uploadSample}
              disabled={uploading}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.04 }}
              style={{
                padding: '10px 18px',
                borderRadius: 8,
                border: 'none',
                background: uploading ? 'rgba(0,140,255,0.3)' : 'linear-gradient(135deg, #007744, #00bb66)',
                color: '#fff',
                fontSize: 13,
                cursor: uploading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: "'Exo 2', sans-serif",
              }}
            >
              <i className={`ti ${uploading ? 'ti-loader ti-spin' : 'ti-upload'}`} />
              {uploading ? 'Yuklanmoqda...' : 'Namunani yuklash'}
            </motion.button>
          )}
        </div>
      </div>

      {/* TEST SECTION */}
      <div
        style={{
          background: 'rgba(0,20,50,0.6)',
          border: '0.5px solid rgba(0,140,255,0.15)',
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <p style={{ fontSize: 12, color: '#4a7aaa', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          2. Klonlangan Ovozni Sinash
        </p>

        <textarea
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          rows={3}
          placeholder="Sinash uchun matn kiriting..."
          style={{
            width: '100%',
            background: 'rgba(0,40,100,0.3)',
            border: '0.5px solid rgba(0,140,255,0.2)',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 13,
            color: '#c0d8f0',
            outline: 'none',
            resize: 'none',
            fontFamily: "'Exo 2', sans-serif",
            marginBottom: 12,
          }}
        />

        <motion.button
          onClick={testClone}
          disabled={playing || !status?.samplesReady}
          whileHover={{ scale: playing ? 1 : 1.03 }}
          whileTap={{ scale: 0.96 }}
          style={{
            padding: '10px 22px',
            borderRadius: 8,
            border: 'none',
            background: !status?.samplesReady
              ? 'rgba(255,255,255,0.06)'
              : playing
              ? 'rgba(0,140,255,0.3)'
              : 'linear-gradient(135deg, #440099, #7700ff)',
            color: status?.samplesReady ? '#fff' : '#4a6a8a',
            fontSize: 13,
            cursor: status?.samplesReady && !playing ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: "'Exo 2', sans-serif",
          }}
        >
          <i className={`ti ${playing ? 'ti-volume ti-spin' : 'ti-player-play'}`} />
          {playing ? 'Gapiryapman...' : !status?.samplesReady ? 'Avval namuna yuklang' : "Mening ovozimda o'qi"}
        </motion.button>
      </div>

      {/* LOG */}
      {log.length > 0 && (
        <div
          style={{
            background: 'rgba(0,10,25,0.8)',
            border: '0.5px solid rgba(0,140,255,0.1)',
            borderRadius: 10,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <p style={{ fontSize: 10, color: '#2a5080', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Log</p>
          {log.map((item, i) => (
            <div key={i} style={{ fontSize: 11, marginBottom: 3, display: 'flex', gap: 8 }}>
              <span style={{ color: '#2a5a8a', flexShrink: 0 }}>{item.ts}</span>
              <span style={{ color: item.type === 'error' ? '#ff6644' : item.type === 'success' ? '#3dbf6f' : item.type === 'warn' ? '#ffaa44' : '#7ab0d8' }}>
                {item.msg}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* CLEAR */}
      {status?.samplesCount > 0 && (
        <button
          onClick={clearSamples}
          style={{
            padding: '7px 16px',
            borderRadius: 8,
            border: '0.5px solid rgba(255,60,60,0.3)',
            background: 'rgba(255,60,60,0.08)',
            color: '#ff6644',
            fontSize: 12,
            cursor: 'pointer',
            fontFamily: "'Exo 2', sans-serif",
          }}
        >
          <i className="ti ti-trash" style={{ marginRight: 6 }} />
          Barcha namunalarni o'chirish
        </button>
      )}
    </div>
  )
}
