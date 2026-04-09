import { useMemo } from 'react'
import usFacilities from '../data/facilities/us.json'
import canadaFacilities from '../data/facilities/canada.json'
import euFacilities from '../data/facilities/eu.json'
import { calculateCoolingFit } from '../scoring/coolingFit.js'
import { classifyMarketTier } from '../scoring/marketTier.js'
import { resolveRegulatoryZone } from '../utils/regulatory.js'

const COUNTRY_NORMALIZE = {
  'united states': 'US', 'usa': 'US',
  'canada': 'CA',
  'united kingdom': 'GB', 'uk': 'GB',
  'germany': 'DE',
  'netherlands': 'NL',
  'france': 'FR',
  'sweden': 'SE',
  'finland': 'FI',
  'norway': 'NO',
  'ireland': 'IE',
  'spain': 'ES',
  'italy': 'IT',
  'denmark': 'DK',
  'switzerland': 'CH',
  'japan': 'JP',
  'south korea': 'KR',
  'china': 'CN',
  'india': 'IN',
  'australia': 'AU',
  'singapore': 'SG',
  'saudi arabia': 'SA',
  'united arab emirates': 'AE', 'uae': 'AE',
  'brazil': 'BR',
  'taiwan': 'TW',
  'malaysia': 'MY',
  'indonesia': 'ID',
  'thailand': 'TH',
  'new zealand': 'NZ',
  'mexico': 'MX',
  'philippines': 'PH',
  'israel': 'IL',
  'belgium': 'BE',
  'austria': 'AT',
  'chile': 'CL',
  'nigeria': 'NG',
  'hong kong': 'HK',
  'vietnam': 'VN',
  'greece': 'GR',
  'ecuador': 'EC',
  'azerbaijan': 'AZ',
  'georgia': 'GE',
  'global': 'GLOBAL',
}

function normalizeCountry(country) {
  if (!country) return 'UNKNOWN'
  const lower = country.toLowerCase().trim()
  return COUNTRY_NORMALIZE[lower] || country
}

function normalizeStatus(status) {
  if (!status) return 'operational'
  const s = status.toLowerCase().trim()

  if (s === 'decommissioned') return 'decommissioned'

  // In-development: active construction, expansion, development work
  if (
    s.includes('under_construction') || s.includes('under construction') ||
    s.includes('expanding') || s.includes('under_development') ||
    s.includes('under development') || s.includes('pre-construction') ||
    s.includes('pre_construction') || s === 'development' ||
    s.includes('converting') || s.includes('deploying') ||
    s.includes('upgrading')
  ) return 'in_development'

  // Planned: not yet started
  if (
    s === 'planned' || s === 'announced' || s === 'proposed' ||
    s === 'approved' || s === 'permitted' ||
    s === 'investment / partnership'
  ) return 'planned'

  // Operational
  if (s.includes('operational') || s.includes('deployed') || s.includes('pilot') ||
      s.includes('product available') || s.includes('product launch') ||
      s.includes('testing') || s.includes('validation')
  ) return 'operational'

  return 'operational'
}

export function useFacilities() {
  const facilities = useMemo(() => {
    const raw = [...usFacilities, ...canadaFacilities, ...euFacilities]
    return raw
      .map((f) => {
        const status = normalizeStatus(f.status)
        const country = normalizeCountry(f.country)
        const cooling_fit_score = calculateCoolingFit({ ...f, status })
        const market_tier = classifyMarketTier(f)
        const resolved_regulatory_zone = resolveRegulatoryZone(f)
        return { ...f, status, country, raw_status: f.status, raw_country: f.country, cooling_fit_score, market_tier, resolved_regulatory_zone }
      })
      .filter((f) => f.status !== 'decommissioned')
  }, [])

  return facilities
}
