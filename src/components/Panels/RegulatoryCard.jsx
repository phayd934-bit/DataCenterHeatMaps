const LEVEL_COLORS = {
  federal: { bg: '#e8f0fe', text: '#1967d2' },
  state_provincial: { bg: '#fef7e0', text: '#e37400' },
  local: { bg: '#ceead6', text: '#137333' },
  agency: { bg: '#f3e8fd', text: '#8430ce' },
}
const LEVEL_LABELS = { federal: 'Federal', state_provincial: 'State/Provincial', local: 'Local', agency: 'Agency' }
const CATEGORY_ICONS = { energy_efficiency: '⚡', water_use: '💧', environmental: '🌿', safety: '🛡️', building_code: '🏗️', tax_incentive: '💰' }

export default function RegulatoryCard({ regulation }) {
  const r = regulation
  const level = LEVEL_COLORS[r.level] || LEVEL_COLORS.federal

  return (
    <div className="border border-[#dadce0] rounded-lg p-3 bg-white">
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{CATEGORY_ICONS[r.category] || '📋'}</span>
          <span className="text-[9px] font-semibold text-[#5f6368] uppercase tracking-wide">{r.category?.replace(/_/g, ' ')}</span>
        </div>
        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
          style={{ backgroundColor: level.bg, color: level.text }}>{LEVEL_LABELS[r.level] || r.level}</span>
      </div>
      <h4 className="text-[13px] font-semibold text-[#202124] mb-1">{r.name}</h4>
      <p className="text-[11px] text-[#3c4043] leading-relaxed mb-2">{r.summary}</p>
      <a href={r.url} target="_blank" rel="noopener noreferrer"
        className="text-[11px] text-[#1a73e8] hover:underline break-all">→ View source legislation ↗</a>
      <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#f1f3f4] text-[9px] text-[#9aa0a6]">
        <span>Effective: {r.effective_date}</span>
      </div>
      {r.relevance && <p className="text-[10px] text-[#5f6368] italic mt-1">Relevance: {r.relevance}</p>}
    </div>
  )
}
