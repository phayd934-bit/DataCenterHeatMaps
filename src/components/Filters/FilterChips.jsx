import { useFilterContext } from '../../context/FilterContext.jsx'

export default function FilterChips() {
  const { filters, setFilter } = useFilterContext()

  const chips = []

  if (filters.countries?.length) filters.countries.forEach((c) => chips.push({ key: 'countries', value: c, label: c }))
  if (filters.statuses?.length) filters.statuses.forEach((s) => chips.push({ key: 'statuses', value: s, label: s }))
  if (filters.facilityTypes?.length) filters.facilityTypes.forEach((t) => chips.push({ key: 'facilityTypes', value: t, label: t }))
  if (filters.coolingMethods?.length) filters.coolingMethods.forEach((m) => chips.push({ key: 'coolingMethods', value: m, label: m }))
  if (filters.marketTiers?.length) filters.marketTiers.forEach((t) => chips.push({ key: 'marketTiers', value: t, label: t.toUpperCase() }))
  if (filters.capacityRange) chips.push({ key: 'capacityRange', value: null, label: `${filters.capacityRange[0]}–${filters.capacityRange[1]} MW` })
  if (filters.pueRange) chips.push({ key: 'pueRange', value: null, label: `PUE ${filters.pueRange[0].toFixed(2)}–${filters.pueRange[1].toFixed(2)}` })
  if (filters.coolingFitRange) chips.push({ key: 'coolingFitRange', value: null, label: `Fit ${filters.coolingFitRange[0]}–${filters.coolingFitRange[1]}` })

  if (chips.length === 0) return null

  const remove = (chip) => {
    const current = filters[chip.key]
    if (Array.isArray(current)) {
      setFilter(chip.key, current.filter((v) => v !== chip.value))
    } else {
      setFilter(chip.key, null)
    }
  }

  return (
    <div className="flex flex-wrap gap-1">
      {chips.map((chip, i) => (
        <span key={`${chip.key}-${chip.value || i}`}
          className="text-[10px] bg-white border border-[#dadce0] text-[#3c4043] px-2 py-0.5 rounded-full flex items-center gap-1">
          {chip.label}
          <button onClick={() => remove(chip)} className="text-[#9aa0a6] hover:text-[#3c4043]">&times;</button>
        </span>
      ))}
    </div>
  )
}
