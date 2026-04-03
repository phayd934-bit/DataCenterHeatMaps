import { validateFacility, validateRegulatory } from '../../scripts/validate-data.js';

const validFacility = {
  id: 'us-va-001',
  company: 'QTS Realty',
  facility_name: 'Ashburn Campus A',
  lat: 39.0438,
  lng: -77.4874,
  address: '21727 Filigree Ct, Ashburn, VA 20147',
  country: 'US',
  region: 'Virginia',
  status: 'operational',
  facility_type: 'colocation',
  capacity_mw: 8.5,
  pue: 1.15,
  pue_source: 'QTS 2024 Sustainability Report',
  pue_source_url: 'https://www.qtsdatacenters.com/resources/sustainability',
  cooling_method: 'air_cooled',
  regulatory_zone: 'us-va',
  source: 'PeeringDB',
  source_url: 'https://www.peeringdb.com/fac/1',
  source_date: '2025-11-15',
  last_verified: '2026-04-03',
  confidence_tier: 'verified',
  notes: '',
  data_gaps: [],
};

const validRegulatory = {
  zone_id: 'us-va',
  country: 'US',
  region: 'Virginia',
  regulatory_complexity_score: 62,
  regulations: [
    {
      category: 'energy_efficiency',
      name: 'Virginia Clean Economy Act (VCEA)',
      level: 'state_provincial',
      summary: 'Requires Virginia utilities to achieve 100% carbon-free electricity by 2045.',
      url: 'https://law.lis.virginia.gov/vacodefull/title56/chapter23.3/',
      effective_date: '2020-04-12',
      relevance: 'Affects energy sourcing for cooling system power consumption',
    },
  ],
};

// Test 1: Accepts valid facility
test('accepts valid facility', () => {
  const result = validateFacility(validFacility);
  expect(result.valid).toBe(true);
  expect(result.errors).toEqual([]);
});

// Test 2: Rejects missing required field (id)
test('rejects facility missing required field id', () => {
  const f = { ...validFacility };
  delete f.id;
  const result = validateFacility(f);
  expect(result.valid).toBe(false);
  expect(result.errors.some(e => e.includes('Missing required field: id'))).toBe(true);
});

// Test 3: Rejects invalid latitude (200)
test('rejects facility with invalid latitude', () => {
  const f = { ...validFacility, lat: 200 };
  const result = validateFacility(f);
  expect(result.valid).toBe(false);
  expect(result.errors.some(e => e.includes('lat must be between -90 and 90'))).toBe(true);
});

// Test 4: Rejects invalid status enum ('active')
test('rejects facility with invalid status enum', () => {
  const f = { ...validFacility, status: 'active' };
  const result = validateFacility(f);
  expect(result.valid).toBe(false);
  expect(result.errors.some(e => e.includes('Invalid status'))).toBe(true);
});

// Test 5: Rejects verified tier without source_url
test('rejects verified facility without source_url', () => {
  const f = { ...validFacility, source_url: null };
  const result = validateFacility(f);
  expect(result.valid).toBe(false);
  expect(result.errors.some(e => e.includes('source_url required'))).toBe(true);
});

// Test 6: Accepts valid regulatory
test('accepts valid regulatory zone', () => {
  const result = validateRegulatory(validRegulatory);
  expect(result.valid).toBe(true);
  expect(result.errors).toEqual([]);
});

// Test 7: Rejects regulation without url
test('rejects regulatory zone with regulation missing url', () => {
  const r = {
    ...validRegulatory,
    regulations: [{ ...validRegulatory.regulations[0], url: '' }],
  };
  const result = validateRegulatory(r);
  expect(result.valid).toBe(false);
  expect(result.errors.some(e => e.includes('url required'))).toBe(true);
});
