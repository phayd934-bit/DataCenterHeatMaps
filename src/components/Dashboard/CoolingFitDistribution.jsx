import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useFilterContext } from '../../context/FilterContext.jsx'
import { coolingLabel } from '../../utils/formatters.js'

const METHOD_COLORS = {
  air_cooled: '#ea4335', evaporative: '#fbbc04', hybrid: '#a142f4',
  liquid_cooled: '#1a73e8', immersion: '#1a73e8', unknown: '#9aa0a6',
}

export default function CoolingFitDistribution() {
  const { filtered } = useFilterContext()
  const data = useMemo(() => {
    const counts = {}
    filtered.forEach((f) => { const m = f.cooling_method || 'unknown'; counts[m] = (counts[m] || 0) + 1 })
    return Object.entries(counts)
      .map(([method, count]) => ({ method, label: coolingLabel(method), count, color: METHOD_COLORS[method] || '#9aa0a6' }))
      .sort((a, b) => b.count - a.count)
  }, [filtered])

  return (
    <div className="border border-[#dadce0] rounded-lg p-2.5 bg-white">
      <div className="text-[9px] font-semibold text-[#5f6368] uppercase tracking-wide mb-1">Cooling Methods</div>
      <ResponsiveContainer width="100%" height={Math.max(60, data.length * 24)}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="label" width={65} tick={{ fontSize: 10, fill: '#5f6368' }} />
          <Tooltip formatter={(value) => [`${value} facilities`]} />
          <Bar dataKey="count" radius={[0, 3, 3, 0]} barSize={14}>
            {data.map((d) => <Cell key={d.method} fill={d.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
