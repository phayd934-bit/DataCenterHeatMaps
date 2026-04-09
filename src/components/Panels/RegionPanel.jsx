import { useState, useMemo } from 'react'
import RegulatoryCard from './RegulatoryCard.jsx'
import usRegulatory from '../../data/regulatory/us.json'
import canadaRegulatory from '../../data/regulatory/canada.json'
import euRegulatory from '../../data/regulatory/eu.json'
import apacRegulatory from '../../data/regulatory/new-apac-reg.json'
import emergingRegulatory from '../../data/regulatory/new-emerging-reg.json'
import euSouthRegulatory from '../../data/regulatory/new-eu-south-reg.json'
import nordicsUkRegulatory from '../../data/regulatory/new-nordics-uk-reg.json'
import { isSupplementaryRegulation } from '../../utils/regulatory.js'

const allRegulatory = [...usRegulatory, ...canadaRegulatory, ...euRegulatory, ...apacRegulatory, ...emergingRegulatory, ...euSouthRegulatory, ...nordicsUkRegulatory]

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'energy_efficiency', label: 'Energy' },
  { value: 'water_use', label: 'Water' },
  { value: 'environmental', label: 'Environmental' },
  { value: 'safety', label: 'Safety' },
  { value: 'building_code', label: 'Building' },
  { value: 'tax_incentive', label: 'Tax' },
]

export default function RegionPanel({ zoneId, onClose }) {
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showSupplementary, setShowSupplementary] = useState(false)
  const zone = useMemo(() => allRegulatory.find((r) => r.zone_id === zoneId), [zoneId])

  if (!zone) {
    return (
      <aside className="w-[300px] flex-shrink-0 border-l border-[#dadce0] bg-white overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-[#5f6368]">No regulatory data for this zone</span>
          <button onClick={onClose} className="text-[#9aa0a6] hover:text-[#3c4043] text-lg">&times;</button>
        </div>
      </aside>
    )
  }

  const visibleRegs = showSupplementary ? zone.regulations : zone.regulations.filter((r) => !isSupplementaryRegulation(r))
  const filteredRegs = categoryFilter === 'all' ? visibleRegs : visibleRegs.filter((r) => r.category === categoryFilter)

  return (
    <aside className="w-[300px] flex-shrink-0 border-l border-[#dadce0] bg-white overflow-y-auto p-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-[15px] font-semibold text-[#202124]">{zone.region}</h2>
          <p className="text-[11px] text-[#5f6368]">{zone.country}</p>
        </div>
        <button onClick={onClose} className="text-[#9aa0a6] hover:text-[#3c4043] text-lg">&times;</button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-[9px] font-semibold text-[#5f6368] uppercase">Complexity</span>
        <div className="flex-1 bg-[#f1f3f4] h-2 rounded-full">
          <div className="h-2 rounded-full" style={{
            width: `${zone.regulatory_complexity_score}%`,
            backgroundColor: zone.regulatory_complexity_score > 70 ? '#ea4335' : zone.regulatory_complexity_score > 40 ? '#fbbc04' : '#34a853',
          }} />
        </div>
        <span className="text-[11px] font-semibold text-[#3c4043]">{zone.regulatory_complexity_score}/100</span>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {CATEGORIES.map((cat) => (
          <button key={cat.value} onClick={() => setCategoryFilter(cat.value)}
            className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
              categoryFilter === cat.value ? 'bg-[#1a73e8] text-white border-[#1a73e8]' : 'bg-[#f1f3f4] text-[#5f6368] border-[#dadce0] hover:bg-[#e8eaed]'
            }`}>{cat.label}</button>
        ))}
      </div>

      <button
        onClick={() => setShowSupplementary((value) => !value)}
        className={`text-[10px] px-2 py-1 rounded-full border mb-3 transition-colors ${
          showSupplementary ? 'bg-[#fef7e0] text-[#e37400] border-[#fbbc04]' : 'bg-[#f1f3f4] text-[#5f6368] border-[#dadce0] hover:bg-[#e8eaed]'
        }`}
      >
        {showSupplementary ? 'Showing all entries' : 'Showing binding entries'}
      </button>

      <div className="flex flex-col gap-2">
        {filteredRegs.length === 0 ? (
          <p className="text-[11px] text-[#9aa0a6] text-center py-4">No regulations in this category</p>
        ) : (
          filteredRegs.map((reg, i) => <RegulatoryCard key={i} regulation={reg} />)
        )}
      </div>
    </aside>
  )
}
