// Hidden element used as PDF source — print-optimized layout
export default function PdfSummary({ plan, username, formData }) {
  if (!plan) return null

  const today = new Date().toLocaleDateString('en-KE', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div
      id="pdf-summary"
      style={{
        position: 'absolute',
        left: '-9999px',
        top: 0,
        width: '794px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '11px',
        color: '#111',
        background: '#fff',
        padding: '32px 40px',
        lineHeight: '1.5',
      }}
    >
      {/* Header */}
      <div style={{ borderBottom: '3px solid #16a34a', paddingBottom: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#15803d' }}>MvpGen Kenya</div>
            <div style={{ color: '#6b7280', fontSize: '10px' }}>MVP Business Plan</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '10px', color: '#6b7280' }}>
            <div>Prepared for: <strong>{username}</strong></div>
            <div>Date: {today}</div>
          </div>
        </div>
      </div>

      {/* Scores */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        {[
          { label: 'Feasibility', data: plan.feasibilityScore, color: '#16a34a' },
          { label: 'Cost Level', data: plan.costLevelScore, color: '#2563eb' },
          { label: 'Speed to Launch', data: plan.speedToLaunchScore, color: '#d97706' },
        ].map(({ label, data, color }) => (
          <div key={label} style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px' }}>
            <div style={{ fontSize: '9px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color }}>{data?.score}/10</div>
            <div style={{ fontSize: '10px', color: '#374151' }}>{data?.label}</div>
          </div>
        ))}
      </div>

      {/* Idea Summary */}
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px' }}>
        <div style={{ fontWeight: 'bold', color: '#15803d', marginBottom: '4px' }}>Business Idea</div>
        <div>{plan.businessSummary}</div>
      </div>

      {/* Two-column table sections */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px', fontSize: '10.5px' }}>
        <tbody>
          {[
            ['Target Customer', plan.targetCustomer],
            ['Problem Solved', plan.problemSolved],
            ['Value Proposition', plan.valueProposition],
            ['Simplest MVP', plan.simplestMVP],
            ['Revenue Model', plan.revenueModel],
            ['Suggested Pricing', plan.suggestedPricing],
            ['Startup Cost', plan.startupCostEstimate?.total],
          ].map(([label, value]) => (
            <tr key={label} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ width: '140px', padding: '5px 8px', background: '#f9fafb', fontWeight: '600', color: '#374151', verticalAlign: 'top' }}>
                {label}
              </td>
              <td style={{ padding: '5px 8px', verticalAlign: 'top' }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Lists section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
        {[
          { title: 'Must-Have Features', items: plan.mustHaveFeatures },
          { title: 'Key Assumptions', items: plan.keyAssumptions },
          { title: 'Validation Methods', items: plan.validationMethods },
          { title: 'Success Metrics', items: plan.successMetrics },
        ].map(({ title, items }) => (
          <div key={title} style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px' }}>
            <div style={{ fontWeight: 'bold', color: '#15803d', marginBottom: '4px', fontSize: '10px' }}>{title}</div>
            {items?.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '4px', marginBottom: '2px' }}>
                <span style={{ color: '#16a34a' }}>•</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Marketing Channels */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px', marginBottom: '12px' }}>
        <div style={{ fontWeight: 'bold', color: '#15803d', marginBottom: '6px', fontSize: '10px' }}>MARKETING CHANNELS</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {[
            { icon: '💬', name: 'WhatsApp', key: 'whatsapp' },
            { icon: '🎵', name: 'TikTok', key: 'tiktok' },
            { icon: '📸', name: 'Instagram', key: 'instagram' },
            { icon: '👥', name: 'Facebook', key: 'facebook' },
          ].map(({ icon, name, key }) => (
            plan.marketingChannels?.[key] && (
              <div key={key}>
                <span style={{ fontWeight: '600' }}>{name}: </span>
                <span>{plan.marketingChannels[key]}</span>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px', marginBottom: '12px' }}>
        <div style={{ fontWeight: 'bold', color: '#15803d', marginBottom: '6px' }}>Your Next 3 Steps</div>
        {plan.next3Steps?.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
            <span style={{ background: '#16a34a', color: '#fff', fontWeight: 'bold', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', flexShrink: 0 }}>
              {i + 1}
            </span>
            <span>{step}</span>
          </div>
        ))}
      </div>

      {/* Risks */}
      {plan.keyRisks?.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontWeight: 'bold', color: '#15803d', marginBottom: '6px', fontSize: '10px' }}>KEY RISKS & HOW TO REDUCE THEM</div>
          {plan.keyRisks.map((r, i) => (
            <div key={i} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '6px 8px', marginBottom: '4px' }}>
              <div style={{ fontWeight: '600', color: '#dc2626' }}>⚠ {r.risk}</div>
              <div style={{ color: '#374151' }}>→ {r.reduction}</div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '10px', color: '#9ca3af', fontSize: '9px', display: 'flex', justifyContent: 'space-between' }}>
        <span>Generated with MvpGen Kenya — Free business planning for Kenyan youth</span>
        <span>{today}</span>
      </div>
    </div>
  )
}
