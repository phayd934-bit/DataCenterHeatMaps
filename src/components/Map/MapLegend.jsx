export default function MapLegend() {
  const items = [
    { color: '#34a853', label: 'SOM — High Fit' },
    { color: '#fbbc04', label: 'SAM — Moderate Fit' },
    { color: '#ea4335', label: 'TAM — All Facilities' },
  ]

  return (
    <div className="absolute bottom-4 left-4 bg-white/95 border border-[#dadce0] rounded-lg px-3 py-2 shadow-sm">
      <div className="text-[9px] font-semibold text-[#5f6368] uppercase tracking-wide mb-1">Market Tier</div>
      {items.map(({ color, label }) => (
        <div key={label} className="flex items-center gap-2 text-xs text-[#3c4043]">
          <div className="w-2.5 h-2.5 rounded-full border border-white" style={{ backgroundColor: color, boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }} />
          {label}
        </div>
      ))}
    </div>
  )
}
