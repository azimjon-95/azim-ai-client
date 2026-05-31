export default function ProfilePage() {
  return (
    <div className="flex-1 overflow-y-auto p-5">
      <h2 className="font-orbitron mb-4" style={{ fontSize: 16, color: '#0099ff' }}>
        Profil
      </h2>
      <div
        style={{
          background: 'rgba(0,20,50,0.5)',
          border: '0.5px solid rgba(0,140,255,0.15)',
          borderRadius: 12,
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #003080, #0077ff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            border: '2px solid rgba(0,140,255,0.4)',
          }}
        >
          👤
        </div>
        <div>
          <p style={{ fontSize: 16, fontWeight: 500, color: '#e0eeff' }}>Azim Foydalanuvchi</p>
          <p style={{ fontSize: 12, color: '#4a7aaa', marginTop: 3 }}>Shaxsiy AI yordamchingiz</p>
        </div>
      </div>

      <div
        style={{
          background: 'rgba(0,20,50,0.5)',
          border: '0.5px solid rgba(0,140,255,0.15)',
          borderRadius: 12,
          padding: '4px 16px',
        }}
      >
        {[
          { label: 'Til', value: "O'zbek (uz-UZ)" },
          { label: 'AI Model', value: 'Llama3 (Offline)' },
          { label: 'TTS', value: 'Coqui TTS' },
          { label: 'STT', value: 'Web Speech API / Vosk' },
          { label: 'Server', value: 'localhost:5000' },
        ].map((row) => (
          <div
            key={row.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '11px 0',
              borderBottom: '0.5px solid rgba(0,140,255,0.08)',
              fontSize: 13,
            }}
          >
            <span style={{ color: '#4a7aaa' }}>{row.label}</span>
            <span style={{ color: '#a0c8e8' }}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
