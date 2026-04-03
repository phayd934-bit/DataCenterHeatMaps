import { useFilterContext } from '../../context/FilterContext.jsx'
import { PRESETS } from '../../hooks/useFilters.js'
import FilterChips from './FilterChips.jsx'

const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'DE', label: 'Germany' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'IE', label: 'Ireland' },
  { value: 'FR', label: 'France' },
  { value: 'SE', label: 'Sweden' },
  { value: 'FI', label: 'Finland' },
  { value: 'GB', label: 'United Kingdom' },
]

const STATUSES = ['operational', 'under_construction', 'planned', 'announced']
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
        <RangeSlider min={0} max={50} step={1} value={filters.capacityRange || [0, 50]}
          onChange={(v) => setFilter('capacityRange', v[0] === 0 && v[1] === 50 ? null : v)}
          highlight={[0, 10]} highlightLabel="Solar Steam range" />
      </FilterSection>

      <FilterSection title="PUE">
        <RangeSlider min={1.0} max={2.0} step={0.01} value={filters.pueRange || [1.0, 2.0]}
          onChange={(v) => setFilter('pueRange', v[0] === 1.0 && v[1] === 2.0 ? null : v)}
          highlight={[1.04, 1.20]} highlightLabel="Primary focus" />
      </FilterSection>

      <FilterSection title="Cooling Method">
        <ChipSelect options={COOLING_METHODS} selected={filters.coolingMethods || []} onChange={(v) => setFilter('coolingMethods', v)} labelFn={coolingChipLabel} />
      </FilterSection>

      <FilterSection title="Cooling Fit Score">
        <RangeSlider min={0} max={100} step={1} value={filters.coolingFitRange || [0, 100]}
          onChange={(v) => setFilter('coolingFitRange', v[0] === 0 && v[1] === 100 ? null : v)}
          highlight={[70, 100]} highlightLabel="SOM threshold" />
      </FilterSection>

      <FilterSection title="Market Tier">
        <ChipSelect options={MARKET_TIERS} selected={filters.marketTiers || []} onChange={(v) => setFilter('marketTiers', v)} labelFn={(t) => t.toUpperCase()} />
      </FilterSection>
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
  return (
    <div>
      <div className="flex justify-between text-[10px] text-[#5f6368] mb-1">
        <span>{step < 1 ? lo.toFixed(2) : lo}</span>
        <span>{step < 1 ? hi.toFixed(2) : hi}</span>
      </div>
      <div className="flex gap-2">
        <input type="range" min={min} max={max} step={step} value={lo}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi), hi])}
          className="w-full accent-[#1a73e8]" />
        <input type="range" min={min} max={max} step={step} value={hi}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo)])}
          className="w-full accent-[#1a73e8]" />
      </div>
      {highlight && highlightLabel && (
        <div className="text-[9px] text-[#34a853] mt-0.5">
          ★ {highlightLabel}: {step < 1 ? highlight[0].toFixed(2) : highlight[0]}–{step < 1 ? highlight[1].toFixed(2) : highlight[1]}
        </div>
      )}
    </div>
  )
}

function statusChipLabel(s) {
  const map = { operational: 'Operational', under_construction: 'Under Construction', planned: 'Planned', announced: 'Announced' }
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
