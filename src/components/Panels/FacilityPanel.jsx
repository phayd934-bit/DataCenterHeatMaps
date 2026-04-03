import { formatPue, formatCapacity, tierColor, tierLabel, statusLabel, coolingLabel, typeLabel, formatDate } from '../../utils/formatters.js'

export default function FacilityPanel({ facility, onClose, onViewRegulatory }) {
  if (!facility) return null
  const f = facility

  return (
    <aside className="w-[300px] flex-shrink-0 border-l border-[#dadce0] bg-white overflow-y-auto p-4">
      <div className="flex justify-between items-center mb-3">
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${tierColor(f.market_tier)}20`, color: tierColor(f.market_tier) }}
        >
          {tierLabel(f.market_tier)}
        </span>
        <button onClick={onClose} className="text-[#9aa0a6] hover:text-[#3c4043] text-lg leading-none">&times;</button>
      </div>

      <h2 className="text-[15px] font-semibold text-[#202124] mb-0.5">{f.facility_name}</h2>
      <p className="text-[11px] text-[#5f6368] mb-3">{f.company} &middot; {typeLabel(f.facility_type)}</p>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <MetricCard label="Capacity" value={formatCapacity(f.capacity_mw)} />
        <MetricCard label="PUE" value={formatPue(f.pue)} color={f.pue && f.pue <= 1.20 ? '#34a853' : f.pue && f.pue <= 1.40 ? '#fbbc04' : '#ea4335'} />
        <MetricCard label="Cooling Fit" value={f.cooling_fit_score} color={f.cooling_fit_score >= 70 ? '#34a853' : f.cooling_fit_score >= 40 ? '#fbbc04' : '#ea4335'} />
        <MetricCard label="Cooling" value={coolingLabel(f.cooling_method)} small />
      </div>

      <p className="text-[10px] text-[#5f6368] mb-1">📍 {f.address || 'Address not available'}</p>
      <p className="text-[10px] text-[#5f6368] mb-2">{statusIcon(f.status)} {statusLabel(f.status)}</p>

      {f.data_gaps?.length > 0 && (
        <p className="text-[9px] text-[#fbbc04] mb-2">⚠ Data gaps: {f.data_gaps.join(', ')}</p>
      )}

      {f.regulatory_zone && (
        <button
          onClick={() => onViewRegulatory?.(f.regulatory_zone)}
          className="text-[11px] text-[#1a73e8] hover:underline mb-2 text-left"
        >
          View regulatory info for {f.region} →
        </button>
      )}

      <div className="border-t border-[#e8eaed] pt-2 text-[9px] text-[#9aa0a6]">
        Source: {f.source} &middot; Verified: {formatDate(f.last_verified)}
        {f.confidence_tier && ` · ${f.confidence_tier}`}
      </div>
    </aside>
  )
}

function MetricCard({ label, value, color, small }) {
  return (
    <div className="bg-[#f8f9fa] rounded-md p-2 text-center">
      <div className="text-[9px] text-[#5f6368] uppercase tracking-wide">{label}</div>
      <div className={`font-bold ${small ? 'text-[11px] mt-0.5' : 'text-base'}`}
        style={color ? { color } : { color: '#202124' }}>{value}</div>
    </div>
  )
}

function statusIcon(status) {
  if (status === 'operational') return '🟢'
  if (status === 'under_construction') return '🟡'
  if (status === 'planned' || status === 'announced') return '🔵'
  return '⚪'
}
