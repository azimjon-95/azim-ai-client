import { useStore } from '../../services/store'

const BARS = [8, 20, 32, 24, 14, 28, 18, 10, 22, 34, 26, 12]

export default function Waveform() {
  const { isListening, isSpeaking } = useStore()
  const active = isListening || isSpeaking

  return (
    <div className="flex items-center gap-[3px]" style={{ height: 40 }} aria-hidden="true">
      {BARS.map((h, i) => (
        <div
          key={i}
          style={{
            width: 3,
            height: active ? h : 4,
            borderRadius: 2,
            background: isListening
              ? `hsl(${140 + i * 5}, 80%, 50%)`
              : isSpeaking
              ? `hsl(${200 + i * 3}, 90%, 55%)`
              : 'rgba(0,100,200,0.4)',
            animation: active ? `wave-bar 1.2s ease-in-out ${i * 0.1}s infinite` : 'none',
            transition: 'height 0.3s ease, background 0.3s ease',
          }}
        />
      ))}
    </div>
  )
}
