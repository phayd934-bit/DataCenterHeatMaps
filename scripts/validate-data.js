const REQUIRED_FACILITY_FIELDS = ['id', 'company', 'lat', 'lng', 'country', 'source', 'source_date'];

const VALID_STATUS = ['operational', 'under_construction', 'planned', 'announced'];
const VALID_FACILITY_TYPE = ['colocation', 'enterprise', 'hyperscale', 'edge', 'government', 'ai_factory'];
const VALID_COOLING_METHOD = ['air_cooled', 'liquid_cooled', 'immersion', 'hybrid', 'evaporative', 'unknown'];
const VALID_CONFIDENCE_TIER = ['verified', 'reported', 'unconfirmed'];

const VALID_REG_CATEGORY = ['energy_efficiency', 'water_use', 'environmental', 'safety', 'building_code', 'tax_incentive'];
const VALID_REG_LEVEL = ['federal', 'state_provincial', 'local', 'agency'];

export function validateFacility(f) {
  const errors = [];

  // Required fields
  for (const field of REQUIRED_FACILITY_FIELDS) {
    if (f[field] === undefined || f[field] === null || f[field] === '') {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // lat range
  if (f.lat !== undefined && f.lat !== null) {
    if (typeof f.lat !== 'number' || f.lat < -90 || f.lat > 90) {
      errors.push('lat must be between -90 and 90');
    }
  }

  // lng range
  if (f.lng !== undefined && f.lng !== null) {
    if (typeof f.lng !== 'number' || f.lng < -180 || f.lng > 180) {
      errors.push('lng must be between -180 and 180');
    }
  }

  // status enum
  if (f.status !== undefined && f.status !== null) {
    if (!VALID_STATUS.includes(f.status)) {
      errors.push(`Invalid status: "${f.status}". Must be one of: ${VALID_STATUS.join(', ')}`);
    }
  }

  // facility_type enum
  if (f.facility_type !== undefined && f.facility_type !== null) {
    if (!VALID_FACILITY_TYPE.includes(f.facility_type)) {
      errors.push(`Invalid facility_type: "${f.facility_type}". Must be one of: ${VALID_FACILITY_TYPE.join(', ')}`);
    }
  }

  // cooling_method enum
  if (f.cooling_method !== undefined && f.cooling_method !== null) {
    if (!VALID_COOLING_METHOD.includes(f.cooling_method)) {
      errors.push(`Invalid cooling_method: "${f.cooling_method}". Must be one of: ${VALID_COOLING_METHOD.join(', ')}`);
    }
  }

  // confidence_tier enum
  if (f.confidence_tier !== undefined && f.confidence_tier !== null) {
    if (!VALID_CONFIDENCE_TIER.includes(f.confidence_tier)) {
      errors.push(`Invalid confidence_tier: "${f.confidence_tier}". Must be one of: ${VALID_CONFIDENCE_TIER.join(', ')}`);
    }
  }

  // verified tier requires non-empty source_url
  if (f.confidence_tier === 'verified') {
    if (!f.source_url) {
      errors.push('source_url required for confidence_tier "verified"');
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateRegulatory(r) {
  const errors = [];

  // Required fields
  for (const field of ['zone_id', 'country', 'region']) {
    if (r[field] === undefined || r[field] === null || r[field] === '') {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate each regulation
  if (Array.isArray(r.regulations)) {
    r.regulations.forEach((reg, i) => {
      // url must be non-empty
      if (!reg.url) {
        errors.push(`Regulation[${i}]: url required`);
      }

      // category enum
      if (reg.category !== undefined && !VALID_REG_CATEGORY.includes(reg.category)) {
        errors.push(`Regulation[${i}]: Invalid category: "${reg.category}". Must be one of: ${VALID_REG_CATEGORY.join(', ')}`);
      }

      // level enum
      if (reg.level !== undefined && !VALID_REG_LEVEL.includes(reg.level)) {
        errors.push(`Regulation[${i}]: Invalid level: "${reg.level}". Must be one of: ${VALID_REG_LEVEL.join(', ')}`);
      }
    });
  }

  return { valid: errors.length === 0, errors };
}
