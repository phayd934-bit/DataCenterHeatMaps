import { classifyMarketTier } from '../../src/scoring/marketTier.js';

// marketTier depends on coolingFit score internally.
// We provide facilities whose coolingFit scores are predictable from the spec.

describe('classifyMarketTier', () => {
  test('1. SOM: ≤10MW + compatible type + score ≥ 70', () => {
    // PUE 1.10, 5MW, air_cooled, ai_factory, planned → score 100 ≥ 70 → SOM
    const facility = {
      pue: 1.10,
      capacity_mw: 5,
      cooling_method: 'air_cooled',
      facility_type: 'ai_factory',
      status: 'planned',
    };
    expect(classifyMarketTier(facility)).toBe('som');
  });

  test('2. SAM: ≤10MW + compatible type + score < 70', () => {
    // PUE 1.50, 8MW, liquid_cooled, colocation, operational
    // PUE:30*0.3=9, Cap:100*0.25=25, Cool:10*0.2=2, Type:80*0.15=12, Status:60*0.1=6 = 54 < 70 → SAM
    const facility = {
      pue: 1.50,
      capacity_mw: 8,
      cooling_method: 'liquid_cooled',
      facility_type: 'colocation',
      status: 'operational',
    };
    expect(classifyMarketTier(facility)).toBe('sam');
  });

  test('3. TAM: >10MW regardless of score', () => {
    const facility = {
      pue: 1.10,
      capacity_mw: 25,
      cooling_method: 'air_cooled',
      facility_type: 'ai_factory',
      status: 'planned',
    };
    expect(classifyMarketTier(facility)).toBe('tam');
  });

  test('4. TAM: ≤10MW but edge type', () => {
    const facility = {
      pue: 1.10,
      capacity_mw: 5,
      cooling_method: 'air_cooled',
      facility_type: 'edge',
      status: 'planned',
    };
    expect(classifyMarketTier(facility)).toBe('tam');
  });

  test('5. SAM: null capacity + compatible type + score < 70', () => {
    // PUE 1.50, null capacity, liquid_cooled, colocation, operational
    // Cap null → 50*0.25=12.5; PUE:9, Cool:2, Type:12, Status:6 → 9+12.5+2+12+6 = 41.5 → 42 < 70 → SAM
    const facility = {
      pue: 1.50,
      capacity_mw: null,
      cooling_method: 'liquid_cooled',
      facility_type: 'colocation',
      status: 'operational',
    };
    expect(classifyMarketTier(facility)).toBe('sam');
  });

  test('6. TAM: null capacity + edge type', () => {
    const facility = {
      pue: 1.10,
      capacity_mw: null,
      cooling_method: 'air_cooled',
      facility_type: 'edge',
      status: 'planned',
    };
    expect(classifyMarketTier(facility)).toBe('tam');
  });
});
