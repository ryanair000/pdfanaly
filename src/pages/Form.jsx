import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'

const CATEGORIES = [
  { value: 'product', label: 'Product — I sell physical or digital items' },
  { value: 'service', label: 'Service — I offer skills or time' },
  { value: 'both', label: 'Both — Products and services' },
]

const BUSINESS_TYPES = [
  { value: 'physical', label: 'Physical — In-person, at a location' },
  { value: 'digital', label: 'Digital — Online, remote, or via phone' },
  { value: 'both', label: 'Both — Physical and digital' },
]

const TIMELINES = [
  { value: '1week', label: 'This week — I want to start immediately' },
  { value: '1month', label: 'Within 1 month' },
  { value: '3months', label: 'Within 3 months' },
  { value: 'flexible', label: 'Flexible — I am still planning' },
]

const FIELDS = [
  {
    key: 'businessIdea',
    label: 'Your business idea',
    helper: 'Describe your idea in 1–2 sentences. Keep it simple.',
    type: 'textarea',
    placeholder: 'e.g. I want to sell home-cooked meals to office workers in my area.',
    required: true,
  },
  {
    key: 'category',
    label: 'Business category',
    helper: 'What kind of business is this?',
    type: 'select',
    options: CATEGORIES,
    required: true,
  },
  {
    key: 'businessType',
    label: 'Business type',
    helper: 'Where or how does your business operate?',
    type: 'select',
    options: BUSINESS_TYPES,
    required: true,
  },
  {
    key: 'targetCustomer',
    label: 'Who is your customer?',
    helper: 'Describe the person most likely to buy from you.',
    type: 'textarea',
    placeholder: 'e.g. Students living in campus hostels aged 18–25 who want affordable meals.',
    required: true,
  },
  {
    key: 'problemSolved',
    label: 'What problem does it solve?',
    helper: 'What frustration or gap does your business fix?',
    type: 'textarea',
    placeholder: 'e.g. Affordable food near campus is hard to find. Canteen food is unhealthy and restaurants are expensive.',
    required: true,
  },
  {
    key: 'solution',
    label: 'Your solution',
    helper: 'How exactly do you solve that problem?',
    type: 'textarea',
    placeholder: 'e.g. I will cook fresh meals daily and deliver via WhatsApp orders within a 2 km radius.',
    required: true,
  },
  {
    key: 'budget',
    label: 'Starting budget (KSh)',
    helper: 'How much money can you start with? Approximate is fine.',
    type: 'number',
    placeholder: 'e.g. 5000',
    required: true,
  },
  {
    key: 'skills',
    label: 'Skills or resources you have',
    helper: 'What do you already have that helps? (skills, tools, contacts, equipment)',
    type: 'textarea',
    placeholder: 'e.g. I can cook well. I have a smartphone, a gas cooker, and 200 WhatsApp contacts.',
    required: true,
  },
  {
    key: 'timeline',
    label: 'When do you want to launch?',
    helper: 'Pick the option that matches your plan.',
    type: 'select',
    options: TIMELINES,
    required: true,
  },
  {
    key: 'pricingIdea',
    label: 'Pricing idea (optional)',
    helper: 'Do you have a price in mind? Leave blank if unsure.',
    type: 'text',
    placeholder: 'e.g. KSh 150 per meal',
    required: false,
  },
]

const EMPTY = {
  businessIdea: '',
  category: '',
  businessType: '',
  targetCustomer: '',
  problemSolved: '',
  solution: '',
  budget: '',
  skills: '',
  timeline: '',
  pricingIdea: '',
}

export default function Form() {
  const username = useStore((s) => s.username)
  const savedForm = useStore((s) => s.formData)
  const setFormData = useStore((s) => s.setFormData)
  const setMvpPlan = useStore((s) => s.setMvpPlan)
  const logout = useStore((s) => s.logout)
  const navigate = useNavigate()

  const [form, setForm] = useState(() => ({
    ...EMPTY,
    ...(savedForm || {}),
    username,
  }))
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const update = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }))
    setErrors((e) => ({ ...e, [key]: '' }))
  }

  const validate = () => {
    const errs = {}
    FIELDS.forEach((f) => {
      if (f.required && !form[f.key]?.toString().trim()) {
        errs[f.key] = 'This field is required.'
      }
    })
    return errs
  }

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      const firstKey = Object.keys(errs)[0]
      document.getElementById(firstKey)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setLoading(true)
    setApiError('')
    setFormData(form)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Server error ${res.status}`)
      }

      const data = await res.json()
      setMvpPlan(data)
      navigate('/results')
    } catch (err) {
      setApiError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const progress = FIELDS.filter((f) => f.required && form[f.key]?.toString().trim()).length
  const total = FIELDS.filter((f) => f.required).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-green-700 font-semibold text-sm flex items-center gap-1">
            ← MvpGen Kenya
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Hi, <strong>{username}</strong></span>
            <button onClick={() => { logout(); navigate('/') }} className="text-xs text-gray-400 hover:text-red-500">
              Change name
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="max-w-2xl mx-auto mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Form progress</span>
            <span>{progress}/{total} fields filled</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${(progress / total) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Tell us about your idea</h1>
          <p className="text-gray-500 text-sm mt-1">Fill in the form below and we'll generate your MVP plan.</p>
        </div>

        <div className="space-y-5">
          {FIELDS.map((field) => (
            <div key={field.key} id={field.key} className="bg-white rounded-xl border border-gray-100 p-5">
              <label className="block font-semibold text-gray-800 text-sm mb-0.5">
                {field.label}
                {!field.required && <span className="text-gray-400 font-normal ml-1">(optional)</span>}
              </label>
              <p className="text-xs text-gray-400 mb-3">{field.helper}</p>

              {field.type === 'textarea' && (
                <textarea
                  value={form[field.key]}
                  onChange={(e) => update(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 resize-none ${
                    errors[field.key] ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
              )}

              {field.type === 'text' && (
                <input
                  type="text"
                  value={form[field.key]}
                  onChange={(e) => update(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              )}

              {field.type === 'number' && (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">KSh</span>
                  <input
                    type="number"
                    value={form[field.key]}
                    onChange={(e) => update(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    min="0"
                    className={`w-full border rounded-lg pl-12 pr-3 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 ${
                      errors[field.key] ? 'border-red-400' : 'border-gray-200'
                    }`}
                  />
                </div>
              )}

              {field.type === 'select' && (
                <select
                  value={form[field.key]}
                  onChange={(e) => update(field.key, e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 ${
                    errors[field.key] ? 'border-red-400' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select an option...</option>
                  {field.options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              )}

              {errors[field.key] && (
                <p className="text-red-500 text-xs mt-1">{errors[field.key]}</p>
              )}
            </div>
          ))}
        </div>

        {apiError && (
          <div className="mt-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
            {apiError}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-bold py-4 rounded-xl text-base transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Building your MVP plan...
            </span>
          ) : (
            '⚡ Generate My MVP Plan'
          )}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          Takes about 10–20 seconds. Powered by AI.
        </p>
      </main>
    </div>
  )
}
