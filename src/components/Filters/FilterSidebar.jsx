import { useFilterContext } from '../../context/FilterContext.jsx'
import { PRESETS } from '../../hooks/useFilters.js'
import FilterChips from './FilterChips.jsx'
import TamSamSom from '../Dashboard/TamSamSom.jsx'
import RegionBreakdown from '../Dashboard/RegionBreakdown.jsx'
import CoolingFitDistribution from '../Dashboard/CoolingFitDistribution.jsx'

const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'FR', label: 'France' },
  { value: 'IE', label: 'Ireland' },
  { value: 'SE', label: 'Sweden' },
  { value: 'FI', label: 'Finland' },
  { value: 'NO', label: 'Norway' },
  { value: 'DK', label: 'Denmark' },
  { value: 'IS', label: 'Iceland' },
  { value: 'ES', label: 'Spain' },
  { value: 'IT', label: 'Italy' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'PL', label: 'Poland' },
  { value: 'PT', label: 'Portugal' },
  { value: 'JP', label: 'Japan' },
  { value: 'KR', label: 'South Korea' },
  { value: 'CN', label: 'China' },
  { value: 'SG', label: 'Singapore' },
  { value: 'AU', label: 'Australia' },
  { value: 'IN', label: 'India' },
  { value: 'SA', label: 'Saudi Arabia' },
  { value: 'AE', label: 'UAE' },
  { value: 'BR', label: 'Brazil' },
]

const STATUSES = ['operational', 'in_development', 'planned']
const FACILITY_TYPES = ['colocation', 'enterprise', 'hyperscale', 'edge', 'government', 'ai_factory']
const COOLING_METHODS = ['air_cooled', 'liquid_cooled', 'immersion', 'hybrid', 'evaporative', 'unknown']
const MARKET_TIERS = ['tam', 'sam', 'som']

export default function FilterSidebar() {
  const { facilities, filters, filtered, setFilter, applyPreset, resetFilters } = useFilterContext()

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="text-lg font-semibold text-[#1a73e8]">Solar Steam</h1>
        <p className="text-[10px] text-[#5f6368] mt-0.5">Data Center Cooling Market Intelligence</p>
      </div>

      <div className="text-xs text-[#5f6368]">
        Showing <span className="font-semibold text-[#1a73e8]">{filtered.length}</span> of {facilities.length} facilities
      </div>

      <div className="flex flex-wrap gap-1.5">
        {Object.keys(PRESETS).map((name) => (
          <button key={name} onClick={() => applyPreset(name)}
            className="text-[10px] bg-[#e8f0fe] text-[#1967d2] px-2.5 py-1 rounded-full hover:bg-[#d2e3fc] transition-colors">
            {name}
          </button>
        ))}
        <button onClick={resetFilters}
          className="text-[10px] bg-[#f1f3f4] text-[#5f6368] px-2.5 py-1 rounded-full hover:bg-[#dadce0] transition-colors">
          Reset All
        </button>
      </div>

      <FilterChips />

      <FilterSection title="Market Tier">
        <ChipSelect options={MARKET_TIERS} selected={filters.marketTiers || []} onChange={(v) => setFilter('marketTiers', v)} labelFn={(t) => t.toUpperCase()} />
      </FilterSection>

      <TamSamSom />

      <FilterSection title="Country">
        <MultiCheck options={COUNTRIES} selected={filters.countries || []} onChange={(v) => setFilter('countries', v)} />
      </FilterSection>

      <FilterSection title="Status">
        <ChipSelect options={STATUSES} selected={filters.statuses || []} onChange={(v) => setFilter('statuses', v)} labelFn={statusChipLabel} />
      </FilterSection>

      <FilterSection title="Facility Type">
        <MultiCheck options={FACILITY_TYPES.map((t) => ({ value: t, label: typeCheckLabel(t) }))} selected={filters.facilityTypes || []} onChange={(v) => setFilter('facilityTypes', v)} />
      </FilterSection>

      <FilterSection title="Capacity (MW)">
        <RangeSlider min={0} max={5000} step={5} value={filters.capacityRange || [0, 5000]}
          onChange={(v) => setFilter('capacityRange', v[0] === 0 && v[1] === 5000 ? null : v)}
          highlight={[0, 10]} highlightLabel="Solar Steam range" />
      </FilterSection>

      <FilterSection title="PUE">
        <RangeSlider min={1.0} max={2.0} step={0.01} value={filters.pueRange || [1.0, 2.0]}
          onChange={(v) => setFilter('pueRange', v[0] === 1.0 && v[1] === 2.0 ? null : v)}
          highlight={[1.0, 1.20]} highlightLabel="SOM target (≤1.20)" />
      </FilterSection>

      <FilterSection title="Cooling Method">
        <ChipSelect options={COOLING_METHODS} selected={filters.coolingMethods || []} onChange={(v) => setFilter('coolingMethods', v)} labelFn={coolingChipLabel} />
      </FilterSection>

      <FilterSection title="Cooling Fit Score">
        <RangeSlider min={0} max={100} step={1} value={filters.coolingFitRange || [0, 100]}
          onChange={(v) => setFilter('coolingFitRange', v[0] === 0 && v[1] === 100 ? null : v)}
          highlight={[70, 100]} highlightLabel="SOM threshold" />
      </FilterSection>

      <RegionBreakdown />
      <CoolingFitDistribution />
    </div>
  )
}

function FilterSection({ title, children }) {
  return (
    <div className="border border-[#dadce0] rounded-lg p-2.5 bg-white">
      <div className="text-[9px] font-semibold text-[#5f6368] uppercase tracking-wide mb-1.5">{title}</div>
      {children}
    </div>
  )
}

function MultiCheck({ options, selected, onChange }) {
  const toggle = (val) => {
    const next = selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]
    onChange(next)
  }
  return (
    <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
      {options.map((opt) => {
        const value = typeof opt === 'string' ? opt : opt.value
        const label = typeof opt === 'string' ? opt : opt.label
        return (
          <label key={value} className="flex items-center gap-1.5 text-[11px] text-[#3c4043] cursor-pointer">
            <input type="checkbox" checked={selected.includes(value)} onChange={() => toggle(value)} className="rounded border-[#dadce0]" />
            {label}
          </label>
        )
      })}
    </div>
  )
}

function ChipSelect({ options, selected, onChange, labelFn }) {
  const toggle = (val) => {
    const next = selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]
    onChange(next)
  }
  return (
    <div className="flex flex-wrap gap-1">
      {options.map((opt) => (
        <button key={opt} onClick={() => toggle(opt)}
          className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
            selected.includes(opt) ? 'bg-[#1a73e8] text-white border-[#1a73e8]' : 'bg-[#f1f3f4] text-[#5f6368] border-[#dadce0] hover:bg-[#e8eaed]'
          }`}>
          {labelFn ? labelFn(opt) : opt}
        </button>
      ))}
    </div>
  )
}

function RangeSlider({ min, max, step, value, onChange, highlight, highlightLabel }) {
  const [lo, hi] = value
  const fmt = (v) => step < 1 ? v.toFixed(2) : v

  const handleLo = (raw) => {
    const n = Number(raw)
    if (!isNaN(n)) onChange([Math.max(min, Math.min(n, hi)), hi])
  }
  const handleHi = (raw) => {
    const n = Number(raw)
    if (!isNaN(n)) onChange([lo, Math.min(max, Math.max(n, lo))])
  }

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <input type="number" min={min} max={hi} step={step} value={fmt(lo)}
          onChange={(e) => handleLo(e.target.value)}
          className="w-[72px] text-[11px] text-[#3c4043] border border-[#dadce0] rounded px-1.5 py-0.5 focus:border-[#1a73e8] focus:outline-none" />
        <span className="text-[10px] text-[#9aa0a6]">to</span>
        <input type="number" min={lo} max={max} step={step} value={fmt(hi)}
          onChange={(e) => handleHi(e.target.value)}
          className="w-[72px] text-[11px] text-[#3c4043] border border-[#dadce0] rounded px-1.5 py-0.5 focus:border-[#1a73e8] focus:outline-none" />
      </div>
      {highlight && highlightLabel && (
        <div className="text-[9px] text-[#34a853] mt-0.5">
          ★ {highlightLabel}: {fmt(highlight[0])}–{fmt(highlight[1])}
        </div>
      )}
    </div>
  )
}

function statusChipLabel(s) {
  const map = { operational: 'Operational', in_development: 'In Development', planned: 'Planned' }
  return map[s] || s
}

function typeCheckLabel(t) {
  const map = { colocation: 'Colocation', enterprise: 'Enterprise', hyperscale: 'Hyperscale', edge: 'Edge', government: 'Government', ai_factory: 'AI Factory' }
  return map[t] || t
}

function coolingChipLabel(c) {
  const map = { air_cooled: 'Air', liquid_cooled: 'Liquid', immersion: 'Immersion', hybrid: 'Hybrid', evaporative: 'Evaporative', unknown: 'Unknown' }
  return map[c] || c
}
