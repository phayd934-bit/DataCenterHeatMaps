/**
 * Classifies a facility into TAM / SAM / SOM.
 */
import { calculateCoolingFit } from './coolingFit.js';

const SAM_COMPATIBLE_TYPES = new Set([
  'colocation',
  'enterprise',
  'hyperscale',
  'ai_factory',
  'government',
]);

/**
 * @param {object} facility
 * @returns {'tam' | 'sam' | 'som'}
 */
export function classifyMarketTier(facility) {
  const { capacity_mw, facility_type } = facility;
  const compatible = SAM_COMPATIBLE_TYPES.has(facility_type);

  // Incompatible type → always TAM
  if (!compatible) return 'tam';

  // Capacity > 10MW → TAM
  if (capacity_mw != null && capacity_mw > 10) return 'tam';

  // capacity ≤ 10MW (or null, treated as potentially ≤10MW) + compatible type
  const score = calculateCoolingFit(facility);
  return score >= 70 ? 'som' : 'sam';
}
