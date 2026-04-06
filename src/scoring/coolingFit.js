/**
 * Deterministic cooling-fit scorer.
 * Pure function: facility object in, integer 0-100 out.
 */

function scorePUE(pue) {
  if (pue == null) return 40;
  if (pue <= 1.20) return 100;
  if (pue > 1.20 && pue <= 1.40) return 60;
  return 30; // > 1.40
}

function scoreCapacity(mw) {
  if (mw == null) return 50;
  if (mw <= 10) return 100;
  if (mw <= 20) return 50;
  return 10; // > 20
}

function scoreCoolingMethod(method) {
  switch (method) {
    case 'air_cooled':   return 100;
    case 'evaporative':  return 70;
    case 'hybrid':       return 40;
    case 'liquid_cooled':
    case 'immersion':    return 10;
    default:             return 60; // unknown / null
  }
}

function scoreFacilityType(type) {
  switch (type) {
    case 'ai_factory':  return 100;
    case 'colocation':  return 80;
    case 'enterprise':  return 70;
    case 'government':  return 50;
    case 'hyperscale':  return 40;
    case 'edge':        return 30;
    default:            return 50;
  }
}

function scoreStatus(status) {
  switch (status) {
    case 'planned':            return 100;
    case 'in_development':     return 80;
    case 'operational':        return 60;
    default:                   return 60;
  }
}

/**
 * @param {object} facility
 * @returns {number} integer 0-100
 */
export function calculateCoolingFit(facility) {
  const raw =
    scorePUE(facility.pue)                  * 0.30 +
    scoreCapacity(facility.capacity_mw)      * 0.25 +
    scoreCoolingMethod(facility.cooling_method) * 0.20 +
    scoreFacilityType(facility.facility_type)  * 0.15 +
    scoreStatus(facility.status)             * 0.10;

  return Math.round(raw);
}
