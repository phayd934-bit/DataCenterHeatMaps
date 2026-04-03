import { useMemo } from 'react'
import usFacilities from '../data/facilities/us.json'
import canadaFacilities from '../data/facilities/canada.json'
import euFacilities from '../data/facilities/eu.json'
import { calculateCoolingFit } from '../scoring/coolingFit.js'
import { classifyMarketTier } from '../scoring/marketTier.js'

export function useFacilities() {
  const facilities = useMemo(() => {
    const raw = [...usFacilities, ...canadaFacilities, ...euFacilities]
    return raw.map((f) => {
      const cooling_fit_score = calculateCoolingFit(f)
      const market_tier = classifyMarketTier({ ...f, cooling_fit_score })
      return { ...f, cooling_fit_score, market_tier }
    })
  }, [])

  return facilities
}
