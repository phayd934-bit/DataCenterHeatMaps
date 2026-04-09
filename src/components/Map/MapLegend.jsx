export default function MapLegend() {
  const tierItems = [
    { color: '#34a853', label: 'SOM', desc: '≤10 MW, PUE ≤1.20, operational' },
    { color: '#f5c542', label: 'SAM', desc: 'Partial fit (size or PUE match)' },
    { color: '#ea4335', label: 'TAM', desc: 'All tracked facilities' },
  ]

  const pipelineItems = [
    { color: '#4285f4', label: 'In Development', desc: 'Under construction' },
    { color: '#00bcd4', label: 'Planned', desc: 'Announced / permitted' },
  ]

  return (
    <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 border border-[#dadce0] rounded-lg px-3 py-2.5 shadow-sm min-w-[200px]">
      <div className="text-[9px] font-semibold text-[#5f6368] uppercase tracking-wide mb-1.5">Operational — Market Tier</div>
      {tierItems.map(({ color, label, desc }) => (
        <div key={label} className="flex items-center gap-2 mb-1">
          <Dot color={color} />
          <div>
            <span className="text-xs font-semibold text-[#3c4043]">{label}</span>
            <span className="text-[10px] text-[#5f6368] ml-1">{desc}</span>
          </div>
        </div>
      ))}
      <div className="text-[9px] font-semibold text-[#5f6368] uppercase tracking-wide mt-2.5 mb-1.5">Pipeline</div>
      {pipelineItems.map(({ color, label, desc }) => (
        <div key={label} className="flex items-center gap-2 mb-1">
          <Dot color={color} />
          <div>
            <span className="text-xs font-semibold text-[#3c4043]">{label}</span>
            <span className="text-[10px] text-[#5f6368] ml-1">{desc}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function Dot({ color }) {
  return (
    <div
      className="w-2.5 h-2.5 rounded-full border border-white"
      style={{ backgroundColor: color, boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }}
    />
  )
}
