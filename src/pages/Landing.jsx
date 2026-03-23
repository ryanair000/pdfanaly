import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { EXAMPLES } from '../data/examples'

export default function Landing() {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const setUsername = useStore((s) => s.setUsername)
  const setFormData = useStore((s) => s.setFormData)
  const navigate = useNavigate()

  const handleStart = () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Please enter your name to get started.')
      return
    }
    setUsername(trimmed)
    navigate('/form')
  }

  const handleExample = (example) => {
    const trimmed = name.trim() || 'Youth'
    setUsername(trimmed)
    setFormData({ username: trimmed, ...example.form })
    navigate('/form')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-green-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-700">MvpGen</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Kenya</span>
          </div>
          <span className="text-sm text-gray-500">Built for Kenyan youth</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
            Turn your idea into a<br />
            <span className="text-green-600">business plan in minutes</span>
          </h1>
          <p className="text-gray-600 text-lg">
            No experience needed. No jargon. Just your idea and your name.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Let's get started</h2>
          <p className="text-sm text-gray-500 mb-4">Enter your first name — no password needed.</p>
          <div className="flex gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              placeholder="Your name, e.g. Amina"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              maxLength={40}
            />
            <button
              onClick={handleStart}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
            >
              Start →
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* How it works */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { step: '1', icon: '✍️', text: 'Fill in your idea' },
            { step: '2', icon: '⚡', text: 'AI builds your plan' },
            { step: '3', icon: '📄', text: 'Download as PDF' },
          ].map((s) => (
            <div key={s.step} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xs font-semibold text-green-600 mb-1">Step {s.step}</div>
              <div className="text-sm text-gray-700">{s.text}</div>
            </div>
          ))}
        </div>

        {/* Example Ideas */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Need inspiration?</h2>
          <p className="text-sm text-gray-500 mb-4">Click any idea below — it will fill the form for you automatically.</p>
          <div className="grid grid-cols-2 gap-3">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.id}
                onClick={() => handleExample(ex)}
                className="bg-white border border-gray-100 hover:border-green-300 hover:shadow-sm rounded-xl p-4 text-left transition-all group"
              >
                <div className="text-xl mb-1">{ex.emoji}</div>
                <div className="font-semibold text-gray-800 text-sm group-hover:text-green-700">{ex.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{ex.description}</div>
                <div className="flex gap-1 mt-2">
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{ex.category}</span>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{ex.type}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-gray-400 py-4">
          MvpGen Kenya — Free for Kenyan youth
        </footer>
      </main>
    </div>
  )
}
