import { useMemo } from 'react'
import { useFilterContext } from '../../context/FilterContext.jsx'

export default function ChoroplethLayer({ onRegionClick }) {
  const { filtered } = useFilterContext()

  const regionData = useMemo(() => {
    const byZone = {}
    filtered.forEach((f) => {
      const zone = f.regulatory_zone
      if (!zone) return
      if (!byZone[zone]) byZone[zone] = { count: 0, totalScore: 0 }
      byZone[zone].count++
      byZone[zone].totalScore += f.cooling_fit_score
    })
    return byZone
  }, [filtered])

  // Placeholder — full choropleth requires GeoJSON boundary data
  return null
}
