import { useState, useMemo, useCallback } from 'react'

export const PRESETS = {
  'Solar Steam Targets': {
    capacityRange: [0, 10],
    pueRange: [1.04, 1.20],
    statuses: ['operational'],
  },
  'Competitive Landscape': {
    pueRange: [1.04, 1.20],
    coolingMethods: ['liquid_cooled', 'immersion', 'hybrid'],
  },
  'Greenfield Opportunities': {
    statuses: ['planned', 'announced', 'under_construction'],
    capacityRange: [0, 10],
  },
}

export function applyFilters(facilities, filters) {
  return facilities.filter((f) => {
    if (filters.countries?.length && !filters.countries.includes(f.country)) return false
    if (filters.regions?.length && !filters.regions.includes(f.region)) return false
    if (filters.statuses?.length && !filters.statuses.includes(f.status)) return false
    if (filters.facilityTypes?.length && !filters.facilityTypes.includes(f.facility_type)) return false
    if (filters.coolingMethods?.length && !filters.coolingMethods.includes(f.cooling_method)) return false
    if (filters.marketTiers?.length && !filters.marketTiers.includes(f.market_tier)) return false

    if (filters.capacityRange) {
      const [min, max] = filters.capacityRange
      if (f.capacity_mw !== null && f.capacity_mw !== undefined) {
        if (f.capacity_mw < min || f.capacity_mw > max) return false
      }
    }

    if (filters.pueRange) {
      const [min, max] = filters.pueRange
      if (f.pue !== null && f.pue !== undefined) {
        if (f.pue < min || f.pue > max) return false
      }
    }

    if (filters.coolingFitRange) {
      const [min, max] = filters.coolingFitRange
      if (f.cooling_fit_score < min || f.cooling_fit_score > max) return false
    }

    return true
  })
}

export function useFilters(facilities) {
  const [filters, setFilters] = useState({})

  const filtered = useMemo(() => applyFilters(facilities, filters), [facilities, filters])

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => {
      if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
        const { [key]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [key]: value }
    })
  }, [])

  const applyPreset = useCallback((presetName) => {
    const preset = PRESETS[presetName]
    if (preset) setFilters(preset)
  }, [])

  const resetFilters = useCallback(() => setFilters({}), [])

  return { filters, filtered, setFilter, applyPreset, resetFilters }
}
