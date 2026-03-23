export default function ScoreBar({ label, score, outOf = 10, color = 'green' }) {
  const pct = Math.round((score / outOf) * 100)
  const colorMap = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    orange: 'bg-orange-500',
  }
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-28 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${colorMap[color]} score-bar-fill`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-bold text-gray-800 w-20 shrink-0">
        {score}/{outOf}
      </span>
    </div>
  )
}
