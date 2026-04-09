/**
 * Classifies a facility into TAM / SAM / SOM.
 *
 * TAM = every data center that exists
 * SAM = has ≤10MW capacity OR PUE ≤ 1.20 (one or the other)
 * SOM = has BOTH ≤10MW capacity AND PUE ≤ 1.20
 */

export function classifyMarketTier(facility) {
  const { capacity_mw, pue } = facility

  const smallEnough = capacity_mw != null && capacity_mw <= 10
  const efficientPue = pue != null && pue <= 1.20

  if (smallEnough && efficientPue) return 'som'
  if (smallEnough || efficientPue) return 'sam'
  return 'tam'
}
