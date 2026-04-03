import { calculateCoolingFit } from '../../src/scoring/coolingFit.js';

describe('calculateCoolingFit', () => {
  test('1. perfect target scores 100', () => {
    const facility = {
      pue: 1.10,
      capacity_mw: 5,
      cooling_method: 'air_cooled',
      facility_type: 'ai_factory',
      status: 'planned',
    };
    expect(calculateCoolingFit(facility)).toBe(100);
  });

  test('2. moderate target scores 75', () => {
    // PUE: 60*0.3=18, Cap: 100*0.25=25, Cool: 70*0.2=14, Type: 80*0.15=12, Status: 60*0.1=6 = 75
    const facility = {
      pue: 1.30,
      capacity_mw: 8,
      cooling_method: 'evaporative',
      facility_type: 'colocation',
      status: 'operational',
    };
    expect(calculateCoolingFit(facility)).toBe(75);
  });

  test('3. low-fit target scores 26', () => {
    // PUE: 30*0.3=9, Cap: 10*0.25=2.5, Cool: 10*0.2=2, Type: 40*0.15=6, Status: 60*0.1=6 = 25.5 → 26
    const facility = {
      pue: 1.50,
      capacity_mw: 30,
      cooling_method: 'liquid_cooled',
      facility_type: 'hyperscale',
      status: 'operational',
    };
    expect(calculateCoolingFit(facility)).toBe(26);
  });

  test('4. null/unknown fields score 67', () => {
    // PUE: 40*0.3=12, Cap: 100*0.25=25, Cool: 60*0.2=12, Type: 80*0.15=12, Status: 60*0.1=6 = 67
    const facility = {
      pue: null,
      capacity_mw: 5,
      cooling_method: 'unknown',
      facility_type: 'colocation',
      status: 'operational',
    };
    expect(calculateCoolingFit(facility)).toBe(67);
  });

  test('5. immersion scores same as liquid_cooled', () => {
    const liquid = {
      pue: 1.10,
      capacity_mw: 5,
      cooling_method: 'liquid_cooled',
      facility_type: 'ai_factory',
      status: 'planned',
    };
    const immersion = {
      pue: 1.10,
      capacity_mw: 5,
      cooling_method: 'immersion',
      facility_type: 'ai_factory',
      status: 'planned',
    };
    expect(calculateCoolingFit(immersion)).toBe(calculateCoolingFit(liquid));
  });

  test('6. always returns integer between 0 and 100', () => {
    const facilities = [
      { pue: 1.05, capacity_mw: 3, cooling_method: 'air_cooled', facility_type: 'ai_factory', status: 'planned' },
      { pue: 1.80, capacity_mw: 50, cooling_method: 'liquid_cooled', facility_type: 'edge', status: 'operational' },
      { pue: null, capacity_mw: null, cooling_method: null, facility_type: null, status: null },
    ];
    for (const f of facilities) {
      const score = calculateCoolingFit(f);
      expect(Number.isInteger(score)).toBe(true);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    }
  });
});
