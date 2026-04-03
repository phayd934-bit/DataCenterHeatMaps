import { useState } from 'react'
import MapContainer from './components/Map/MapContainer.jsx'
import FacilityPanel from './components/Panels/FacilityPanel.jsx'
import FilterSidebar from './components/Filters/FilterSidebar.jsx'

export default function App() {
  const [selectedFacility, setSelectedFacility] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState(null)

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans text-[#3c4043]">
      <aside className="w-[280px] flex-shrink-0 border-r border-[#dadce0] bg-white overflow-y-auto p-4">
        <FilterSidebar />
      </aside>

      <main className="flex-1 relative">
        <MapContainer
          onSelectFacility={(f) => { setSelectedFacility(f); setSelectedRegion(null) }}
          onSelectRegion={(r) => { setSelectedRegion(r); setSelectedFacility(null) }}
        />
      </main>

      {selectedFacility && (
        <FacilityPanel
          facility={selectedFacility}
          onClose={() => setSelectedFacility(null)}
          onViewRegulatory={(zoneId) => { setSelectedRegion(zoneId); setSelectedFacility(null) }}
        />
      )}
    </div>
  )
}
