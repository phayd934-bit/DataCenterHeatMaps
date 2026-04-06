export default function MapLegend() {
  const tierItems = [
    { color: '#34a853', label: 'SOM — High Fit' },
    { color: '#fbbc04', label: 'SAM — Moderate Fit' },
    { color: '#ea4335', label: 'TAM — All Facilities' },
  ]

  const pipelineItems = [
    { color: '#4285f4', label: 'In Development' },
    { color: '#ff9800', label: 'Planned' },
  ]

  return (
    <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 border border-[#dadce0] rounded-lg px-3 py-2 shadow-sm">
      <div className="text-[9px] font-semibold text-[#5f6368] uppercase tracking-wide mb-1">Operational — Market Tier</div>
      {tierItems.map(({ color, label }) => (
        <div key={label} className="flex items-center gap-2 text-xs text-[#3c4043]">
          <Dot color={color} />
          {label}
        </div>
      ))}
      <div className="text-[9px] font-semibold text-[#5f6368] uppercase tracking-wide mt-2 mb-1">Pipeline</div>
      {pipelineItems.map(({ color, label }) => (
        <div key={label} className="flex items-center gap-2 text-xs text-[#3c4043]">
          <Dot color={color} />
          {label}
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
