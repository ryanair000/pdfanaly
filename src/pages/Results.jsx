import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import ScoreBar from '../components/ScoreBar'
import PlanTable from '../components/PlanTable'
import PdfSummary from '../components/PdfSummary'

export default function Results() {
  const username = useStore((s) => s.username)
  const plan = useStore((s) => s.mvpPlan)
  const formData = useStore((s) => s.formData)
  const clearPlan = useStore((s) => s.clearPlan)
  const logout = useStore((s) => s.logout)
  const navigate = useNavigate()
  const printRef = useRef()

  if (!plan) {
    navigate('/form')
    return null
  }

  const handleDownloadPDF = async () => {
    const element = document.getElementById('pdf-summary')
    if (!element) return
    const html2pdf = (await import('html2pdf.js')).default
    html2pdf()
      .set({
        margin: 0,
        filename: `mvp-plan-${username?.toLowerCase().replace(/\s+/g, '-') || 'kenya'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(element)
      .save()
  }

  const handleEdit = () => {
    clearPlan()
    navigate('/form')
  }

  const handleNew = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10 no-print">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-700">MvpGen Kenya</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Your MVP Plan</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="text-sm border border-gray-200 hover:border-green-400 text-gray-700 hover:text-green-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              ✏️ Edit & Regenerate
            </button>
            <button
              onClick={handleDownloadPDF}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              ⬇ Download PDF
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Top hero card */}
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-green-200 text-sm mb-1">MVP Plan for {username}</p>
              <h1 className="text-2xl font-bold leading-tight mb-2">{plan.businessSummary}</h1>
              <p className="text-green-100 text-sm">{plan.valueProposition}</p>
            </div>
          </div>
        </div>

        {/* Scores */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Viability Scores</h2>
          <div className="space-y-3">
            <ScoreBar
              label={`Feasibility — ${plan.feasibilityScore?.label}`}
              score={plan.feasibilityScore?.score}
              color="green"
            />
            <ScoreBar
              label={`Cost Level — ${plan.costLevelScore?.label}`}
              score={plan.costLevelScore?.score}
              color="blue"
            />
            <ScoreBar
              label={`Speed to Launch — ${plan.speedToLaunchScore?.label}`}
              score={plan.speedToLaunchScore?.score}
              color="orange"
            />
          </div>
        </div>

        {/* Next 3 steps highlight */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-bold text-green-800 uppercase tracking-wide mb-3">Your Next 3 Steps</h2>
          <div className="space-y-2">
            {plan.next3Steps?.map((step, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="bg-green-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-800">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Full plan table */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Full MVP Plan</h2>
          <PlanTable plan={plan} username={username} />
        </div>

        {/* Action buttons bottom */}
        <div className="flex flex-col sm:flex-row gap-3 no-print">
          <button
            onClick={handleDownloadPDF}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            ⬇ Download as PDF
          </button>
          <button
            onClick={handleEdit}
            className="flex-1 border-2 border-green-600 text-green-700 hover:bg-green-50 font-bold py-3.5 rounded-xl transition-colors"
          >
            ✏️ Edit Idea & Regenerate
          </button>
          <button
            onClick={handleNew}
            className="sm:w-auto border border-gray-200 text-gray-600 hover:text-gray-900 font-semibold py-3.5 px-5 rounded-xl transition-colors text-sm"
          >
            + New Idea
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 no-print">
          MvpGen Kenya — Free for Kenyan youth
        </p>
      </main>

      {/* Hidden PDF element */}
      <PdfSummary plan={plan} username={username} formData={formData} />
    </div>
  )
}
