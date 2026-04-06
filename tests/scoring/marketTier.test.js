import { classifyMarketTier } from '../../src/scoring/marketTier.js';

describe('classifyMarketTier', () => {
  test('SOM: ≤10MW AND PUE 1.04-1.20', () => {
    expect(classifyMarketTier({ capacity_mw: 5, pue: 1.10 })).toBe('som');
    expect(classifyMarketTier({ capacity_mw: 10, pue: 1.04 })).toBe('som');
    expect(classifyMarketTier({ capacity_mw: 10, pue: 1.20 })).toBe('som');
  });

  test('SAM: ≤10MW but PUE outside range or unknown', () => {
    expect(classifyMarketTier({ capacity_mw: 5, pue: 1.50 })).toBe('sam');
    expect(classifyMarketTier({ capacity_mw: 8, pue: null })).toBe('sam');
  });

  test('SAM: PUE 1.04-1.20 but capacity >10MW or unknown', () => {
    expect(classifyMarketTier({ capacity_mw: 50, pue: 1.15 })).toBe('sam');
    expect(classifyMarketTier({ capacity_mw: null, pue: 1.10 })).toBe('sam');
  });

  test('TAM: neither ≤10MW nor PUE 1.04-1.20', () => {
    expect(classifyMarketTier({ capacity_mw: 50, pue: 1.50 })).toBe('tam');
    expect(classifyMarketTier({ capacity_mw: 25, pue: null })).toBe('tam');
    expect(classifyMarketTier({ capacity_mw: null, pue: null })).toBe('tam');
    expect(classifyMarketTier({ capacity_mw: null, pue: 1.50 })).toBe('tam');
  });

  test('boundary: PUE exactly 1.04 and 1.20 are in range', () => {
    expect(classifyMarketTier({ capacity_mw: 5, pue: 1.04 })).toBe('som');
    expect(classifyMarketTier({ capacity_mw: 5, pue: 1.20 })).toBe('som');
  });

  test('boundary: PUE 1.03 and 1.21 are out of range', () => {
    expect(classifyMarketTier({ capacity_mw: 5, pue: 1.03 })).toBe('sam');
    expect(classifyMarketTier({ capacity_mw: 5, pue: 1.21 })).toBe('sam');
  });
});
