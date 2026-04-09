import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useFilterContext } from '../../context/FilterContext.jsx'

const COUNTRY_LABELS = { US: 'US', CA: 'Canada', DE: 'Germany', NL: 'Netherlands', IE: 'Ireland', FR: 'France', SE: 'Sweden', FI: 'Finland', GB: 'UK' }

export default function RegionBreakdown() {
  const { filtered } = useFilterContext()
  const data = useMemo(() => {
    const counts = {}
    filtered.forEach((f) => { counts[f.country] = (counts[f.country] || 0) + 1 })
    return Object.entries(counts)
      .map(([country, count]) => ({ country: COUNTRY_LABELS[country] || country, count }))
      .sort((a, b) => b.count - a.count)
  }, [filtered])

  return (
    <div className="border border-[#dadce0] rounded-lg p-2.5 bg-white">
      <div className="text-[9px] font-semibold text-[#5f6368] uppercase tracking-wide mb-1">By Region</div>
      <ResponsiveContainer width="100%" height={Math.max(60, data.length * 24)}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="country" width={50} tick={{ fontSize: 10, fill: '#5f6368' }} />
          <Tooltip formatter={(value) => [`${value} facilities`]} />
          <Bar dataKey="count" fill="#1a73e8" radius={[0, 3, 3, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
