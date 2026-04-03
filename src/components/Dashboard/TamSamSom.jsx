import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useFilterContext } from '../../context/FilterContext.jsx'
import { tierColor } from '../../utils/formatters.js'

export default function TamSamSom() {
  const { filtered } = useFilterContext()
  const data = useMemo(() => {
    const counts = { tam: 0, sam: 0, som: 0 }
    filtered.forEach((f) => counts[f.market_tier]++)
    return [
      { name: 'TAM', value: counts.tam, color: tierColor('tam') },
      { name: 'SAM', value: counts.sam, color: tierColor('sam') },
      { name: 'SOM', value: counts.som, color: tierColor('som') },
    ]
  }, [filtered])

  return (
    <div className="border border-[#dadce0] rounded-lg p-2.5 bg-white">
      <div className="text-[9px] font-semibold text-[#5f6368] uppercase tracking-wide mb-1">TAM / SAM / SOM</div>
      <ResponsiveContainer width="100%" height={100}>
        <PieChart>
          <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={20} outerRadius={40}>
            {data.map((d) => <Cell key={d.name} fill={d.color} />)}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} facilities`, name]} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-between text-[10px] text-[#3c4043] mt-1">
        {data.map((d) => (
          <span key={d.name}><span style={{ color: d.color }} className="font-semibold">{d.value}</span> {d.name}</span>
        ))}
      </div>
    </div>
  )
}
