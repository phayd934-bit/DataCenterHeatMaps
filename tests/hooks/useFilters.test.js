import { describe, it, expect } from 'vitest'
import { applyFilters, PRESETS } from '../../src/hooks/useFilters.js'

const facilities = [
  { id: '1', country: 'US', region: 'Virginia', status: 'operational', facility_type: 'colocation', capacity_mw: 5, pue: 1.10, cooling_method: 'air_cooled', cooling_fit_score: 90, market_tier: 'som' },
  { id: '2', country: 'CA', region: 'Ontario', status: 'planned', facility_type: 'ai_factory', capacity_mw: 8, pue: null, cooling_method: 'unknown', cooling_fit_score: 72, market_tier: 'som' },
  { id: '3', country: 'US', region: 'California', status: 'operational', facility_type: 'hyperscale', capacity_mw: 32, pue: 1.50, cooling_method: 'evaporative', cooling_fit_score: 26, market_tier: 'tam' },
]

describe('applyFilters', () => {
  it('returns all facilities with empty filters', () => {
    expect(applyFilters(facilities, {})).toHaveLength(3)
  })

  it('filters by country', () => {
    expect(applyFilters(facilities, { countries: ['CA'] })).toHaveLength(1)
    expect(applyFilters(facilities, { countries: ['US'] })).toHaveLength(2)
    expect(applyFilters(facilities, { countries: ['US', 'CA'] })).toHaveLength(3)
  })

  it('filters by status', () => {
    expect(applyFilters(facilities, { statuses: ['planned'] })).toHaveLength(1)
  })

  it('filters by facility type', () => {
    expect(applyFilters(facilities, { facilityTypes: ['colocation', 'ai_factory'] })).toHaveLength(2)
  })

  it('filters by capacity range', () => {
    expect(applyFilters(facilities, { capacityRange: [0, 10] })).toHaveLength(2)
  })

  it('filters by PUE range — nulls are included', () => {
    expect(applyFilters(facilities, { pueRange: [1.0, 1.20] })).toHaveLength(2)
  })

  it('filters by cooling method', () => {
    expect(applyFilters(facilities, { coolingMethods: ['air_cooled'] })).toHaveLength(1)
  })

  it('filters by market tier', () => {
    expect(applyFilters(facilities, { marketTiers: ['som'] })).toHaveLength(2)
  })

  it('filters by cooling fit score range', () => {
    expect(applyFilters(facilities, { coolingFitRange: [70, 100] })).toHaveLength(2)
  })

  it('combines filters with AND logic', () => {
    expect(applyFilters(facilities, { countries: ['US'], statuses: ['operational'] })).toHaveLength(2)
    expect(applyFilters(facilities, { countries: ['US'], capacityRange: [0, 10] })).toHaveLength(1)
  })
})

describe('PRESETS', () => {
  it('has Solar Steam Targets preset', () => {
    expect(PRESETS['Solar Steam Targets']).toBeDefined()
    expect(PRESETS['Solar Steam Targets'].capacityRange).toEqual([0, 10])
    expect(PRESETS['Solar Steam Targets'].pueRange).toEqual([1.04, 1.20])
  })

  it('has Competitive Landscape preset', () => {
    expect(PRESETS['Competitive Landscape']).toBeDefined()
    expect(PRESETS['Competitive Landscape'].pueRange).toEqual([1.04, 1.20])
  })

  it('has Greenfield Opportunities preset', () => {
    expect(PRESETS['Greenfield Opportunities']).toBeDefined()
    expect(PRESETS['Greenfield Opportunities'].statuses).toContain('planned')
  })
})
