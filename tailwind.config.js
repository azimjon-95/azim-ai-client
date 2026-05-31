/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
        exo: ['"Exo 2"', 'sans-serif'],
      },
      colors: {
        azim: {
          bg: '#060d1a',
          surface: '#0a1628',
          border: 'rgba(0,140,255,0.2)',
          blue: '#0088ff',
          accent: '#00aaff',
          muted: '#4a7aaa',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'wave': 'wave 1.2s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
      }
    }
  },
  plugins: []
}
