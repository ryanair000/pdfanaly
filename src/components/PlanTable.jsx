function Row({ label, children }) {
  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide w-48 align-top bg-gray-50">
        {label}
      </td>
      <td className="py-3 px-4 text-sm text-gray-800 align-top">{children}</td>
    </tr>
  )
}

function List({ items }) {
  if (!items?.length) return null
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-green-500 mt-0.5 shrink-0">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function PlanTable({ plan, username }) {
  if (!plan) return null

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <table className="w-full border-collapse">
        <tbody>
          {/* Identity */}
          <tr className="bg-green-700">
            <td colSpan={2} className="px-4 py-3 text-white font-bold text-sm tracking-wide">
              BUSINESS OVERVIEW
            </td>
          </tr>
          <Row label="Business Summary">{plan.businessSummary}</Row>
          <Row label="Target Customer">{plan.targetCustomer}</Row>
          <Row label="Problem Solved">{plan.problemSolved}</Row>
          <Row label="Value Proposition">{plan.valueProposition}</Row>
          <Row label="Business Type">{plan.businessType}</Row>

          {/* MVP */}
          <tr className="bg-green-700">
            <td colSpan={2} className="px-4 py-3 text-white font-bold text-sm tracking-wide">
              MVP DEFINITION
            </td>
          </tr>
          <Row label="Simplest MVP">{plan.simplestMVP}</Row>
          <Row label="Must-Have Features"><List items={plan.mustHaveFeatures} /></Row>
          <Row label="Nice-to-Have Features"><List items={plan.niceToHaveFeatures} /></Row>
          <Row label="Key Assumptions"><List items={plan.keyAssumptions} /></Row>
          <Row label="Validation Methods"><List items={plan.validationMethods} /></Row>

          {/* Money */}
          <tr className="bg-green-700">
            <td colSpan={2} className="px-4 py-3 text-white font-bold text-sm tracking-wide">
              MONEY & PRICING
            </td>
          </tr>
          <Row label="Revenue Model">{plan.revenueModel}</Row>
          <Row label="Suggested Pricing">{plan.suggestedPricing}</Row>
          <Row label="Startup Cost Estimate">
            <div>
              <div className="font-bold text-green-700 mb-1">{plan.startupCostEstimate?.total}</div>
              {plan.startupCostEstimate?.breakdown?.map((b, i) => (
                <div key={i} className="flex justify-between text-xs text-gray-600 border-b border-gray-50 py-0.5">
                  <span>{b.item}</span>
                  <span className="font-medium">{b.cost}</span>
                </div>
              ))}
            </div>
          </Row>

          {/* Go to Market */}
          <tr className="bg-green-700">
            <td colSpan={2} className="px-4 py-3 text-white font-bold text-sm tracking-wide">
              GO-TO-MARKET
            </td>
          </tr>
          <Row label="Starting Plan"><List items={plan.goToMarket} /></Row>
          <Row label="Marketing Channels">
            <div className="space-y-2">
              {[
                { key: 'whatsapp', icon: '💬', name: 'WhatsApp' },
                { key: 'tiktok', icon: '🎵', name: 'TikTok' },
                { key: 'instagram', icon: '📸', name: 'Instagram' },
                { key: 'facebook', icon: '👥', name: 'Facebook' },
              ].map(({ key, icon, name }) => (
                plan.marketingChannels?.[key] && (
                  <div key={key} className="flex gap-2">
                    <span className="text-base leading-5">{icon}</span>
                    <div>
                      <span className="font-semibold text-xs text-gray-500">{name}: </span>
                      <span className="text-sm">{plan.marketingChannels[key]}</span>
                    </div>
                  </div>
                )
              ))}
            </div>
          </Row>

          {/* Timeline */}
          <tr className="bg-green-700">
            <td colSpan={2} className="px-4 py-3 text-white font-bold text-sm tracking-wide">
              TIMELINE
            </td>
          </tr>
          <Row label="Phase Breakdown">
            <div className="space-y-3">
              {plan.timeline?.map((t, i) => (
                <div key={i}>
                  <div className="font-semibold text-green-700 text-xs mb-1">{t.phase}</div>
                  <List items={t.actions} />
                </div>
              ))}
            </div>
          </Row>

          {/* Risk */}
          <tr className="bg-green-700">
            <td colSpan={2} className="px-4 py-3 text-white font-bold text-sm tracking-wide">
              RISKS & MITIGATION
            </td>
          </tr>
          <Row label="Key Risks">
            <div className="space-y-3">
              {plan.keyRisks?.map((r, i) => (
                <div key={i} className="bg-red-50 rounded-lg p-3">
                  <div className="text-sm font-semibold text-red-700 mb-1">⚠ {r.risk}</div>
                  <div className="text-sm text-gray-700">→ {r.reduction}</div>
                </div>
              ))}
            </div>
          </Row>

          {/* Results */}
          <tr className="bg-green-700">
            <td colSpan={2} className="px-4 py-3 text-white font-bold text-sm tracking-wide">
              SUCCESS & NEXT STEPS
            </td>
          </tr>
          <Row label="Success Metrics"><List items={plan.successMetrics} /></Row>
          <Row label="Your Next 3 Steps">
            <div className="space-y-2">
              {plan.next3Steps?.map((step, i) => (
                <div key={i} className="flex gap-3 items-start bg-green-50 rounded-lg p-2.5">
                  <span className="bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm">{step}</span>
                </div>
              ))}
            </div>
          </Row>
        </tbody>
      </table>
    </div>
  )
}
