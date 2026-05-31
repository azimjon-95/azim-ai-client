import { useStore } from '../../services/store'

const BARS = [6,14,26,20,10,28,16,8,22,32,24,10,18,28,12,20,8,24,30,14]

export default function Waveform() {
  const { isListening, isSpeaking } = useStore()
  const active = isListening || isSpeaking
  const color = isListening ? '#00ff88' : isSpeaking ? '#00aaff' : 'rgba(0,100,200,0.35)'

  return (
    <div style={{display:'flex',alignItems:'center',gap:3,height:40}} aria-hidden="true">
      {BARS.map((h,i)=>(
        <div key={i} style={{
          width:3,borderRadius:2,
          height: active ? h : 4,
          background: color,
          animation: active ? `wave-bar 1.1s ease-in-out ${i*.07}s infinite` : 'none',
          transition:'height .3s ease,background .3s ease',
        }}/>
      ))}
    </div>
  )
}
