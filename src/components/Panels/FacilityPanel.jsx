import { useState } from 'react'
import { formatPue, formatCapacity, tierColor, tierLabel, statusLabel, coolingLabel, typeLabel, formatDate } from '../../utils/formatters.js'
import marketSizes from '../../data/market-sizes.json'

export default function FacilityPanel({ facility, onClose, onViewRegulatory }) {
  const [showBreakdown, setShowBreakdown] = useState(false)

  if (!facility) return null
  const f = facility
  const regulatoryZone = f.resolved_regulatory_zone || f.regulatory_zone

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

      <h2 className="text-[15px] font-semibold mb-0.5">
        {f.source_url ? (
          <a href={f.source_url} target="_blank" rel="noopener noreferrer"
            className="text-[#1a73e8] hover:underline">{f.facility_name}</a>
        ) : (
          <span className="text-[#202124]">{f.facility_name}</span>
        )}
      </h2>
      <p className="text-[11px] text-[#5f6368] mb-3">{f.company} &middot; {typeLabel(f.facility_type)}</p>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <MetricCard label="Capacity" value={formatCapacity(f.capacity_mw)} />
        <MetricCard label="PUE" value={formatPue(f.pue)} color={f.pue && f.pue <= 1.20 ? '#34a853' : f.pue && f.pue <= 1.40 ? '#fbbc04' : '#ea4335'} />
        <MetricCard
          label="Cooling Fit"
          value={f.cooling_fit_score}
          color={f.cooling_fit_score >= 70 ? '#34a853' : f.cooling_fit_score >= 40 ? '#fbbc04' : '#ea4335'}
          clickable
          onClick={() => setShowBreakdown(!showBreakdown)}
        />
        <MetricCard label="Cooling" value={coolingLabel(f.cooling_method)} small />
        <MetricCard label="DC Type" value={typeLabel(f.facility_type)} small />
        <MetricCard label="GPU" value={f.gpu || 'N/A'} small />
      </div>

      {showBreakdown && <CoolingFitBreakdown facility={f} onClose={() => setShowBreakdown(false)} />}

      <p className="text-[10px] text-[#5f6368] mb-1">📍 {f.address || 'Address not available'}</p>
      <p className="text-[10px] text-[#5f6368] mb-2">{statusIcon(f.status)} {statusLabel(f.status)}</p>

      {f.data_gaps?.length > 0 && (
        <p className="text-[9px] text-[#fbbc04] mb-2">⚠ Data gaps: {f.data_gaps.join(', ')}</p>
      )}

      <MarketSizeCard country={f.country} />

      {regulatoryZone && (
        <button
          onClick={() => onViewRegulatory?.(regulatoryZone)}
          className="text-[11px] text-[#1a73e8] hover:underline mb-2 text-left"
        >
          View compliance info for {f.region || f.country} →
        </button>
      )}

      <div className="border-t border-[#e8eaed] pt-2 text-[9px] text-[#9aa0a6]">
        Source: {f.source_url ? (
          <a href={f.source_url} target="_blank" rel="noopener noreferrer" className="text-[#1a73e8] hover:underline">{f.source || 'View source'}</a>
        ) : (f.source || 'N/A')} &middot; Verified: {formatDate(f.last_verified)}
        {f.confidence_tier && ` · ${f.confidence_tier}`}
      </div>
    </aside>
  )
}

function CoolingFitBreakdown({ facility, onClose }) {
  const f = facility

  const pueScore = scorePue(f.pue)
  const capScore = scoreCap(f.capacity_mw)
  const coolScore = scoreCool(f.cooling_method)
  const typeScore = scoreType(f.facility_type)
  const statusScore = scoreStatus(f.status)

  const factors = [
    { label: 'PUE', weight: '30%', raw: pueScore, weighted: Math.round(pueScore * 0.3), detail: f.pue ? f.pue.toFixed(2) : 'Unknown' },
    { label: 'Capacity', weight: '25%', raw: capScore, weighted: Math.round(capScore * 0.25), detail: f.capacity_mw ? `${f.capacity_mw} MW` : 'Unknown' },
    { label: 'Cooling', weight: '20%', raw: coolScore, weighted: Math.round(coolScore * 0.2), detail: coolingLabel(f.cooling_method) },
    { label: 'Type', weight: '15%', raw: typeScore, weighted: Math.round(typeScore * 0.15), detail: typeLabel(f.facility_type) },
    { label: 'Status', weight: '10%', raw: statusScore, weighted: Math.round(statusScore * 0.1), detail: statusLabel(f.status) },
  ]

  return (
    <div className="mb-3 border border-[#dadce0] rounded-lg p-3 bg-[#f8f9fa]">
      <div className="flex justify-between items-center mb-2">
        <div className="text-[9px] font-semibold text-[#5f6368] uppercase tracking-wide">Cooling Fit Breakdown</div>
        <button onClick={onClose} className="text-[9px] text-[#9aa0a6] hover:text-[#3c4043]">&times; close</button>
      </div>
      {factors.map((f) => (
        <div key={f.label} className="mb-1.5">
          <div className="flex justify-between text-[10px] mb-0.5">
            <span className="text-[#3c4043]">{f.label} <span className="text-[#9aa0a6]">({f.weight})</span></span>
            <span className="text-[#5f6368]">{f.detail} → <span className="font-semibold">{f.raw}</span> × {f.weight} = <span className="font-bold text-[#202124]">{f.weighted}</span></span>
          </div>
          <div className="w-full bg-[#e8eaed] h-1.5 rounded-full">
            <div
              className="h-1.5 rounded-full transition-all"
              style={{
                width: `${f.raw}%`,
                backgroundColor: f.raw >= 70 ? '#34a853' : f.raw >= 40 ? '#fbbc04' : '#ea4335',
              }}
            />
          </div>
        </div>
      ))}
      <div className="border-t border-[#dadce0] mt-2 pt-1.5 flex justify-between text-[11px] font-bold text-[#202124]">
        <span>Total</span>
        <span>{factors.reduce((s, f) => s + f.weighted, 0)} / 100</span>
      </div>
    </div>
  )
}

function scorePue(pue) {
  if (pue === null || pue === undefined) return 40
  if (pue <= 1.20) return 100
  if (pue > 1.20 && pue <= 1.40) return 60
  return 30
}

function scoreCap(mw) {
  if (mw === null || mw === undefined) return 50
  if (mw <= 10) return 100
  if (mw <= 20) return 50
  return 10
}

function scoreCool(method) {
  const scores = { air_cooled: 100, evaporative: 70, hybrid: 40, liquid_cooled: 10, immersion: 10, unknown: 60 }
  return scores[method] ?? 60
}

function scoreType(type) {
  const scores = { ai_factory: 100, colocation: 80, enterprise: 70, government: 50, hyperscale: 40, edge: 30 }
  return scores[type] ?? 50
}

function scoreStatus(status) {
  const scores = { planned: 100, in_development: 80, operational: 60 }
  return scores[status] ?? 60
}

function MetricCard({ label, value, color, small, clickable, onClick, className }) {
  return (
    <div
      className={`bg-[#f8f9fa] rounded-md p-2 text-center ${clickable ? 'cursor-pointer hover:bg-[#e8eaed] transition-colors ring-1 ring-transparent hover:ring-[#dadce0]' : ''} ${className || ''}`}
      onClick={clickable ? onClick : undefined}
    >
      <div className="text-[9px] text-[#5f6368] uppercase tracking-wide">
        {label}
        {clickable && <span className="ml-0.5 text-[#1a73e8]">▾</span>}
      </div>
      <div className={`font-bold ${small ? 'text-[11px] mt-0.5' : 'text-base'}`}
        style={color ? { color } : { color: '#202124' }}>{value}</div>
    </div>
  )
}

function MarketSizeCard({ country }) {
  const data = marketSizes[country]
  if (!data) return null

  return (
    <div className="border border-[#dadce0] rounded-lg p-2.5 bg-[#f8f9fa] mb-2">
      <div className="text-[9px] font-semibold text-[#5f6368] uppercase tracking-wide mb-1.5">Market Size (2025)</div>
      <div className="grid grid-cols-2 gap-2">
        <div className="text-center">
          <div className="text-[9px] text-[#5f6368] uppercase">Data Centers</div>
          <div className="text-sm font-bold text-[#1a73e8]">${data.dc_market}B</div>
          <div className="text-[8px] text-[#9aa0a6]">{data.dc_source}</div>
        </div>
        <div className="text-center">
          <div className="text-[9px] text-[#5f6368] uppercase">DC Cooling</div>
          <div className="text-sm font-bold text-[#34a853]">${data.cooling_market}B</div>
          <div className="text-[8px] text-[#9aa0a6]">{data.cooling_source}</div>
        </div>
      </div>
    </div>
  )
}

function statusIcon(status) {
  if (status === 'operational') return '🟢'
  if (status === 'in_development') return '🔵'
  if (status === 'planned') return '🟠'
  return '⚪'
}
