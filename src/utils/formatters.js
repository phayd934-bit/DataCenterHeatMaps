export function formatNumber(n) {
  if (n === null || n === undefined) return '—'
  return n.toLocaleString()
}

export function formatPue(pue) {
  if (pue === null || pue === undefined) return 'N/A'
  return pue.toFixed(2)
}

export function formatCapacity(mw) {
  if (mw === null || mw === undefined) return 'N/A'
  return `${mw} MW`
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

export function tierColor(tier) {
  if (tier === 'som') return '#34a853'
  if (tier === 'sam') return '#fbbc04'
  return '#ea4335'
}

export function getFacilityColor(status, tier) {
  if (status === 'in_development') return '#4285f4' // Blue
  if (status === 'planned') return '#ff9800'         // Orange
  return tierColor(tier)
}

export function tierLabel(tier) {
  return (tier || '').toUpperCase()
}

export function statusLabel(status) {
  const labels = {
    operational: 'Operational',
    in_development: 'In Development',
    planned: 'Planned',
    decommissioned: 'Decommissioned',
  }
  return labels[status] || status
}

export function coolingLabel(method) {
  const labels = {
    air_cooled: 'Air Cooled',
    liquid_cooled: 'Liquid Cooled',
    immersion: 'Immersion',
    hybrid: 'Hybrid',
    evaporative: 'Evaporative',
    unknown: 'Unknown',
  }
  return labels[method] || method
}

export function typeLabel(type) {
  const labels = {
    colocation: 'Colocation',
    enterprise: 'Enterprise',
    hyperscale: 'Hyperscale',
    edge: 'Edge',
    government: 'Government',
    ai_factory: 'AI Factory',
  }
  return labels[type] || type
}
