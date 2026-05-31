import { create } from 'zustand'

export const useStore = create((set, get) => ({
  // State
  isListening: false,
  isSpeaking: false,
  isOnline: true,
  activePage: 'home',
  messages: [],
  commands: [],
  recentCommands: [
    { time: '14:35', label: 'YouTube ochildi', done: true },
    { time: '14:33', label: 'Telegram ochildi', done: true },
    { time: '14:30', label: 'Google ochildi', done: true },
    { time: '14:28', label: "Ob-havo so'raldi", done: true },
    { time: '14:25', label: 'Xabar yuborildi', done: true },
  ],
  transcript: '',
  response: '',
  volume: 0,

  // Actions
  setListening: (val) => set({ isListening: val }),
  setSpeaking: (val) => set({ isSpeaking: val }),
  setActivePage: (page) => set({ activePage: page }),
  setTranscript: (text) => set({ transcript: text }),
  setResponse: (text) => set({ response: text }),
  setVolume: (v) => set({ volume: v }),
  setOnline: (val) => set({ isOnline: val }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, { ...msg, id: Date.now(), ts: new Date() }],
    })),

  addRecentCommand: (label) =>
    set((state) => {
      const now = new Date()
      const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
      return {
        recentCommands: [{ time, label, done: true }, ...state.recentCommands].slice(0, 10),
      }
    }),
}))
