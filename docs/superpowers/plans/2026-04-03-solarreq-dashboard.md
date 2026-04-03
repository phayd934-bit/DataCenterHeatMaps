# SolarReq Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive data center cooling market intelligence dashboard for Solar Steam — map + filters + TAM/SAM/SOM analytics + regulatory drill-downs.

**Architecture:** React 18 + Vite SPA with Mapbox GL map, Tailwind styling, Recharts charts. All data is static JSON scored client-side. No backend. Ships as a `dist/` folder.

**Tech Stack:** React 18, Vite, Mapbox GL JS (react-map-gl), Tailwind CSS, Recharts, Vitest

---

## File Map

```
SolarReq/
├── public/
│   └── favicon.svg
├── src/
│   ├── data/
│   │   ├── facilities/
│   │   │   ├── us.json              # US facility records
│   │   │   ├── canada.json          # Canada facility records
│   │   │   └── eu.json              # EU facility records
│   │   ├── regulatory/
│   │   │   ├── us.json              # US regulatory records by zone
│   │   │   ├── canada.json          # Canada regulatory records by zone
│   │   │   └── eu.json              # EU regulatory records by zone
│   │   └── meta/
│   │       └── sources.json         # Data provenance log
│   ├── scoring/
│   │   ├── coolingFit.js            # Deterministic cooling-fit score (0-100)
│   │   └── marketTier.js            # TAM/SAM/SOM classifier
│   ├── components/
│   │   ├── Map/
│   │   │   ├── MapContainer.jsx     # Mapbox GL wrapper + layers
│   │   │   ├── FacilityMarkers.jsx  # Clustered markers, color by tier
│   │   │   ├── ChoroplethLayer.jsx  # Region fill by opportunity density
│   │   │   └── MapLegend.jsx        # Marker/choropleth legend
│   │   ├── Panels/
│   │   │   ├── FacilityPanel.jsx    # Single DC detail (compact card)
│   │   │   ├── RegionPanel.jsx      # Region regulatory drill-down
│   │   │   └── RegulatoryCard.jsx   # Single regulation entry with link
│   │   ├── Filters/
│   │   │   ├── FilterSidebar.jsx    # All filter controls + presets
│   │   │   └── FilterChips.jsx      # Active filter pill display
│   │   └── Dashboard/
│   │       ├── TamSamSom.jsx        # Funnel/donut chart
│   │       ├── RegionBreakdown.jsx  # Horizontal bar chart by country
│   │       └── CoolingFitDistribution.jsx  # Bar chart by cooling method
│   ├── hooks/
│   │   ├── useFilters.js            # Filter state + filtered list
│   │   └── useFacilities.js         # Load + score + classify all facilities
│   ├── context/
│   │   └── FilterContext.jsx        # React context provider for filter state
│   ├── utils/
│   │   └── formatters.js            # Number/date formatting helpers
│   ├── App.jsx                      # Root layout: sidebar + map + panel
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Tailwind directives + custom styles
├── scripts/
│   └── validate-data.js             # Pre-build data integrity checker
├── tests/
│   ├── scoring/
│   │   ├── coolingFit.test.js       # Scoring formula tests
│   │   └── marketTier.test.js       # TAM/SAM/SOM classification tests
│   ├── hooks/
│   │   └── useFilters.test.js       # Filter logic tests
│   └── scripts/
│       └── validate-data.test.js    # Data validation tests
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`

- [ ] **Step 1: Initialize Vite project**

Run:
```bash
cd C:/Users/ph205/Desktop/SolarReq
npm create vite@latest . -- --template react
```
Expected: Scaffolds into current directory. Select React + JavaScript when prompted.

- [ ] **Step 2: Install dependencies**

Run:
```bash
npm install react-map-gl mapbox-gl recharts
npm install -D tailwindcss @tailwindcss/vite vitest @testing-library/react @testing-library/jest-dom jsdom
```
Expected: All packages install without errors.

- [ ] **Step 3: Configure Tailwind**

Replace `src/index.css` with:
```css
@import "tailwindcss";
```

Update `vite.config.js`:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
  },
})
```

Create `tests/setup.js`:
```js
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Create shell App component**

Replace `src/App.jsx` with:
```jsx
export default function App() {
  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans text-[#3c4043]">
      {/* Left sidebar */}
      <aside className="w-[280px] flex-shrink-0 border-r border-[#dadce0] bg-white overflow-y-auto p-4">
        <h1 className="text-lg font-semibold text-[#1a73e8]">Solar Steam</h1>
        <p className="text-xs text-[#5f6368] mt-1">Data Center Cooling Market Intelligence</p>
      </aside>

      {/* Map area */}
      <main className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center text-[#9aa0a6]">
          Map loads here
        </div>
      </main>
    </div>
  )
}
```

- [ ] **Step 5: Verify dev server starts**

Run:
```bash
npm run dev
```
Expected: Vite dev server starts. Browser shows the sidebar with "Solar Steam" heading and grey "Map loads here" placeholder.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vite.config.js index.html src/ tests/setup.js
git commit -m "feat: scaffold Vite + React + Tailwind project"
```

---

### Task 2: Scoring Functions (TDD)

**Files:**
- Create: `src/scoring/coolingFit.js`, `src/scoring/marketTier.js`
- Test: `tests/scoring/coolingFit.test.js`, `tests/scoring/marketTier.test.js`

- [ ] **Step 1: Write cooling-fit score tests**

Create `tests/scoring/coolingFit.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { calculateCoolingFit } from '../../src/scoring/coolingFit.js'

describe('calculateCoolingFit', () => {
  it('scores a perfect target: low PUE, small, air-cooled, AI factory, planned', () => {
    const facility = {
      pue: 1.10,
      capacity_mw: 5,
      cooling_method: 'air_cooled',
      facility_type: 'ai_factory',
      status: 'planned',
    }
    expect(calculateCoolingFit(facility)).toBe(100)
  })

  it('scores a moderate target: mid PUE, mid capacity, evaporative, colocation, operational', () => {
    const facility = {
      pue: 1.30,
      capacity_mw: 8,
      cooling_method: 'evaporative',
      facility_type: 'colocation',
      status: 'operational',
    }
    // PUE: 60*0.3=18, Cap: 100*0.25=25, Cool: 70*0.2=14, Type: 80*0.15=12, Status: 60*0.1=6
    expect(calculateCoolingFit(facility)).toBe(75)
  })

  it('scores a low-fit target: high PUE, large, already liquid, hyperscale, operational', () => {
    const facility = {
      pue: 1.50,
      capacity_mw: 30,
      cooling_method: 'liquid_cooled',
      facility_type: 'hyperscale',
      status: 'operational',
    }
    // PUE: 30*0.3=9, Cap: 10*0.25=2.5, Cool: 10*0.2=2, Type: 40*0.15=6, Status: 60*0.1=6
    expect(calculateCoolingFit(facility)).toBe(26)
  })

  it('handles null/unknown fields with fallback scores', () => {
    const facility = {
      pue: null,
      capacity_mw: 5,
      cooling_method: 'unknown',
      facility_type: 'colocation',
      status: 'operational',
    }
    // PUE: 40*0.3=12, Cap: 100*0.25=25, Cool: 60*0.2=12, Type: 80*0.15=12, Status: 60*0.1=6
    expect(calculateCoolingFit(facility)).toBe(67)
  })

  it('treats immersion same as liquid_cooled', () => {
    const a = { pue: 1.10, capacity_mw: 5, cooling_method: 'liquid_cooled', facility_type: 'colocation', status: 'operational' }
    const b = { pue: 1.10, capacity_mw: 5, cooling_method: 'immersion', facility_type: 'colocation', status: 'operational' }
    expect(calculateCoolingFit(a)).toBe(calculateCoolingFit(b))
  })

  it('returns an integer between 0 and 100', () => {
    const facility = { pue: 1.25, capacity_mw: 15, cooling_method: 'hybrid', facility_type: 'edge', status: 'under_construction' }
    const score = calculateCoolingFit(facility)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
    expect(Number.isInteger(score)).toBe(true)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run:
```bash
npx vitest run tests/scoring/coolingFit.test.js
```
Expected: FAIL — `cannot find module '../../src/scoring/coolingFit.js'`

- [ ] **Step 3: Implement coolingFit.js**

Create `src/scoring/coolingFit.js`:
```js
const PUE_WEIGHT = 0.3
const CAPACITY_WEIGHT = 0.25
const COOLING_WEIGHT = 0.2
const TYPE_WEIGHT = 0.15
const STATUS_WEIGHT = 0.1

function scorePue(pue) {
  if (pue === null || pue === undefined) return 40
  if (pue >= 1.04 && pue <= 1.20) return 100
  if (pue > 1.20 && pue <= 1.40) return 60
  return 30
}

function scoreCapacity(mw) {
  if (mw === null || mw === undefined) return 50
  if (mw <= 10) return 100
  if (mw <= 20) return 50
  return 10
}

const COOLING_SCORES = {
  air_cooled: 100,
  evaporative: 70,
  hybrid: 40,
  liquid_cooled: 10,
  immersion: 10,
  unknown: 60,
}

function scoreCooling(method) {
  return COOLING_SCORES[method] ?? 60
}

const TYPE_SCORES = {
  ai_factory: 100,
  colocation: 80,
  enterprise: 70,
  hyperscale: 40,
  edge: 30,
  government: 50,
}

function scoreType(type) {
  return TYPE_SCORES[type] ?? 50
}

const STATUS_SCORES = {
  planned: 100,
  announced: 100,
  under_construction: 80,
  operational: 60,
}

function scoreStatus(status) {
  return STATUS_SCORES[status] ?? 50
}

export function calculateCoolingFit(facility) {
  const raw =
    scorePue(facility.pue) * PUE_WEIGHT +
    scoreCapacity(facility.capacity_mw) * CAPACITY_WEIGHT +
    scoreCooling(facility.cooling_method) * COOLING_WEIGHT +
    scoreType(facility.facility_type) * TYPE_WEIGHT +
    scoreStatus(facility.status) * STATUS_WEIGHT

  return Math.round(raw)
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run:
```bash
npx vitest run tests/scoring/coolingFit.test.js
```
Expected: All 6 tests PASS.

- [ ] **Step 5: Write market tier tests**

Create `tests/scoring/marketTier.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { classifyMarketTier } from '../../src/scoring/marketTier.js'

describe('classifyMarketTier', () => {
  it('classifies SOM: ≤10MW + compatible type + cooling_fit ≥ 70', () => {
    expect(classifyMarketTier({ capacity_mw: 5, facility_type: 'colocation', cooling_fit_score: 82 })).toBe('som')
  })

  it('classifies SAM: ≤10MW + compatible type + cooling_fit < 70', () => {
    expect(classifyMarketTier({ capacity_mw: 8, facility_type: 'enterprise', cooling_fit_score: 55 })).toBe('sam')
  })

  it('classifies TAM: >10MW regardless of score', () => {
    expect(classifyMarketTier({ capacity_mw: 25, facility_type: 'hyperscale', cooling_fit_score: 90 })).toBe('tam')
  })

  it('classifies TAM: ≤10MW but incompatible type (edge)', () => {
    expect(classifyMarketTier({ capacity_mw: 3, facility_type: 'edge', cooling_fit_score: 85 })).toBe('tam')
  })

  it('classifies SAM when capacity is null (unknown) but type is compatible', () => {
    expect(classifyMarketTier({ capacity_mw: null, facility_type: 'colocation', cooling_fit_score: 50 })).toBe('sam')
  })

  it('classifies TAM when capacity is null and type is incompatible', () => {
    expect(classifyMarketTier({ capacity_mw: null, facility_type: 'edge', cooling_fit_score: 80 })).toBe('tam')
  })
})
```

- [ ] **Step 6: Run tests to verify they fail**

Run:
```bash
npx vitest run tests/scoring/marketTier.test.js
```
Expected: FAIL — `cannot find module '../../src/scoring/marketTier.js'`

- [ ] **Step 7: Implement marketTier.js**

Create `src/scoring/marketTier.js`:
```js
const SAM_COMPATIBLE_TYPES = new Set([
  'colocation',
  'enterprise',
  'hyperscale',
  'ai_factory',
  'government',
])

export function classifyMarketTier(facility) {
  const capacity = facility.capacity_mw
  const type = facility.facility_type
  const score = facility.cooling_fit_score

  const capacityOk = capacity === null || capacity === undefined || capacity <= 10
  const typeOk = SAM_COMPATIBLE_TYPES.has(type)

  if (!capacityOk || !typeOk) return 'tam'
  if (score >= 70) return 'som'
  return 'sam'
}
```

- [ ] **Step 8: Run tests to verify they pass**

Run:
```bash
npx vitest run tests/scoring/marketTier.test.js
```
Expected: All 6 tests PASS.

- [ ] **Step 9: Commit**

```bash
git add src/scoring/ tests/scoring/
git commit -m "feat: add deterministic cooling-fit scoring and market tier classification"
```

---

### Task 3: Sample Data & Validation Script

**Files:**
- Create: `src/data/facilities/us.json`, `src/data/facilities/canada.json`, `src/data/facilities/eu.json`, `src/data/regulatory/us.json`, `src/data/regulatory/canada.json`, `src/data/regulatory/eu.json`, `src/data/meta/sources.json`, `scripts/validate-data.js`
- Test: `tests/scripts/validate-data.test.js`

- [ ] **Step 1: Create sample facility data (US — 3 records)**

Create `src/data/facilities/us.json`:
```json
[
  {
    "id": "us-va-001",
    "company": "QTS Realty",
    "facility_name": "Ashburn Campus A",
    "lat": 39.0438,
    "lng": -77.4874,
    "address": "21727 Filigree Ct, Ashburn, VA 20147",
    "country": "US",
    "region": "Virginia",
    "status": "operational",
    "facility_type": "colocation",
    "capacity_mw": 8.5,
    "pue": 1.15,
    "pue_source": "QTS 2024 Sustainability Report",
    "pue_source_url": "https://www.qtsdatacenters.com/resources/sustainability",
    "cooling_method": "air_cooled",
    "regulatory_zone": "us-va",
    "source": "PeeringDB",
    "source_url": "https://www.peeringdb.com/fac/1",
    "source_date": "2025-11-15",
    "last_verified": "2026-04-03",
    "confidence_tier": "verified",
    "notes": "",
    "data_gaps": []
  },
  {
    "id": "us-tx-001",
    "company": "Skybox Datacenters",
    "facility_name": "Houston Facility",
    "lat": 29.7604,
    "lng": -95.3698,
    "address": "Houston, TX",
    "country": "US",
    "region": "Texas",
    "status": "planned",
    "facility_type": "ai_factory",
    "capacity_mw": 6.0,
    "pue": null,
    "pue_source": null,
    "pue_source_url": null,
    "cooling_method": "unknown",
    "regulatory_zone": "us-tx",
    "source": "State permit filing",
    "source_url": "https://example.com",
    "source_date": "2026-01-10",
    "last_verified": "2026-04-03",
    "confidence_tier": "reported",
    "notes": "Planned AI training facility",
    "data_gaps": ["pue", "cooling_method"]
  },
  {
    "id": "us-ca-001",
    "company": "Vantage Data Centers",
    "facility_name": "Santa Clara V1",
    "lat": 37.3541,
    "lng": -121.9552,
    "address": "Santa Clara, CA",
    "country": "US",
    "region": "California",
    "status": "operational",
    "facility_type": "hyperscale",
    "capacity_mw": 32.0,
    "pue": 1.28,
    "pue_source": "Vantage 2024 ESG Report",
    "pue_source_url": "https://vantage-dc.com/esg",
    "cooling_method": "evaporative",
    "regulatory_zone": "us-ca",
    "source": "Baxtel",
    "source_url": "https://baxtel.com/data-center/vantage",
    "source_date": "2025-08-20",
    "last_verified": "2026-04-03",
    "confidence_tier": "verified",
    "notes": "",
    "data_gaps": []
  }
]
```

- [ ] **Step 2: Create sample facility data (Canada — 2 records)**

Create `src/data/facilities/canada.json`:
```json
[
  {
    "id": "ca-on-001",
    "company": "eStruxture Data Centers",
    "facility_name": "Toronto MTL-1",
    "lat": 43.6532,
    "lng": -79.3832,
    "address": "Toronto, ON",
    "country": "CA",
    "region": "Ontario",
    "status": "operational",
    "facility_type": "colocation",
    "capacity_mw": 4.5,
    "pue": 1.18,
    "pue_source": "eStruxture sustainability page",
    "pue_source_url": "https://www.estruxture.com/sustainability",
    "cooling_method": "air_cooled",
    "regulatory_zone": "ca-on",
    "source": "datacentermap.com",
    "source_url": "https://www.datacentermap.com",
    "source_date": "2025-09-01",
    "last_verified": "2026-04-03",
    "confidence_tier": "reported",
    "notes": "",
    "data_gaps": []
  },
  {
    "id": "ca-qc-001",
    "company": "QScale",
    "facility_name": "Levis Campus",
    "lat": 46.8032,
    "lng": -71.1793,
    "address": "Levis, QC",
    "country": "CA",
    "region": "Quebec",
    "status": "under_construction",
    "facility_type": "ai_factory",
    "capacity_mw": 7.0,
    "pue": 1.08,
    "pue_source": "QScale press release",
    "pue_source_url": "https://qscale.com",
    "cooling_method": "liquid_cooled",
    "regulatory_zone": "ca-qc",
    "source": "Government of Quebec",
    "source_url": "https://example.com",
    "source_date": "2026-02-15",
    "last_verified": "2026-04-03",
    "confidence_tier": "verified",
    "notes": "Hydro-powered, liquid cooled from design",
    "data_gaps": []
  }
]
```

- [ ] **Step 3: Create sample facility data (EU — 2 records)**

Create `src/data/facilities/eu.json`:
```json
[
  {
    "id": "eu-de-001",
    "company": "Equinix",
    "facility_name": "Frankfurt FR7",
    "lat": 50.1109,
    "lng": 8.6821,
    "address": "Frankfurt, Germany",
    "country": "DE",
    "region": "Hessen",
    "status": "operational",
    "facility_type": "colocation",
    "capacity_mw": 9.0,
    "pue": 1.20,
    "pue_source": "Equinix 2024 Sustainability Report",
    "pue_source_url": "https://sustainability.equinix.com",
    "cooling_method": "hybrid",
    "regulatory_zone": "eu-de",
    "source": "Equinix website",
    "source_url": "https://www.equinix.com/data-centers/europe/germany/frankfurt",
    "source_date": "2025-10-01",
    "last_verified": "2026-04-03",
    "confidence_tier": "verified",
    "notes": "",
    "data_gaps": []
  },
  {
    "id": "eu-nl-001",
    "company": "NorthC",
    "facility_name": "Amsterdam AMS-1",
    "lat": 52.3676,
    "lng": 4.9041,
    "address": "Amsterdam, Netherlands",
    "country": "NL",
    "region": "North Holland",
    "status": "announced",
    "facility_type": "enterprise",
    "capacity_mw": 3.0,
    "pue": null,
    "pue_source": null,
    "pue_source_url": null,
    "cooling_method": "unknown",
    "regulatory_zone": "eu-nl",
    "source": "datacentermap.com",
    "source_url": "https://www.datacentermap.com",
    "source_date": "2026-03-01",
    "last_verified": "2026-04-03",
    "confidence_tier": "unconfirmed",
    "notes": "Announced, no detailed specs yet",
    "data_gaps": ["pue", "cooling_method", "capacity_mw"]
  }
]
```

- [ ] **Step 4: Create sample regulatory data (US — 1 zone)**

Create `src/data/regulatory/us.json`:
```json
[
  {
    "zone_id": "us-va",
    "country": "US",
    "region": "Virginia",
    "regulatory_complexity_score": 62,
    "regulations": [
      {
        "category": "energy_efficiency",
        "name": "Virginia Clean Economy Act (VCEA)",
        "level": "state_provincial",
        "summary": "Requires Virginia utilities to achieve 100% carbon-free electricity by 2045. Data centers may need to demonstrate renewable energy sourcing.",
        "url": "https://law.lis.virginia.gov/vacodefull/title56/chapter23.3/",
        "effective_date": "2020-04-12",
        "relevance": "Affects energy sourcing for cooling system power consumption"
      },
      {
        "category": "environmental",
        "name": "Clean Air Act (Federal)",
        "level": "federal",
        "summary": "Regulates air emissions from stationary sources. Data center backup generators require air quality permits.",
        "url": "https://www.epa.gov/clean-air-act-overview",
        "effective_date": "1970-12-31",
        "relevance": "Backup cooling systems with diesel generators require EPA permits"
      }
    ]
  }
]
```

- [ ] **Step 5: Create sample regulatory data (Canada — 1 zone)**

Create `src/data/regulatory/canada.json`:
```json
[
  {
    "zone_id": "ca-on",
    "country": "CA",
    "region": "Ontario",
    "regulatory_complexity_score": 55,
    "regulations": [
      {
        "category": "energy_efficiency",
        "name": "Ontario Energy Board Act",
        "level": "state_provincial",
        "summary": "Regulates electricity pricing and distribution. Large consumers may qualify for industrial rates.",
        "url": "https://www.ontario.ca/laws/statute/98o15",
        "effective_date": "1998-01-01",
        "relevance": "Cooling energy costs governed by OEB rate structures"
      }
    ]
  }
]
```

- [ ] **Step 6: Create sample regulatory data (EU — 1 zone)**

Create `src/data/regulatory/eu.json`:
```json
[
  {
    "zone_id": "eu-de",
    "country": "DE",
    "region": "Hessen",
    "regulatory_complexity_score": 78,
    "regulations": [
      {
        "category": "energy_efficiency",
        "name": "Energy Efficiency Act (EnEfG)",
        "level": "federal",
        "summary": "Requires data centers >500kW to report PUE annually. New DCs must achieve PUE ≤1.3 by 2030. Reuse of waste heat mandatory where feasible.",
        "url": "https://www.gesetze-im-internet.de/enefg/",
        "effective_date": "2023-11-18",
        "relevance": "Directly regulates cooling efficiency targets and waste heat reuse from cooling systems"
      },
      {
        "category": "water_use",
        "name": "Federal Water Act (WHG)",
        "level": "federal",
        "summary": "Regulates water extraction and discharge. Evaporative cooling systems require water usage permits.",
        "url": "https://www.gesetze-im-internet.de/whg_2009/",
        "effective_date": "2009-08-01",
        "relevance": "Liquid cooling with water circuits requires permits under WHG"
      }
    ]
  }
]
```

- [ ] **Step 7: Create sources metadata**

Create `src/data/meta/sources.json`:
```json
{
  "sources": [
    { "name": "PeeringDB", "url": "https://www.peeringdb.com", "type": "api", "coverage": "global" },
    { "name": "datacentermap.com", "url": "https://www.datacentermap.com", "type": "directory", "coverage": "global" },
    { "name": "Baxtel", "url": "https://baxtel.com", "type": "directory", "coverage": "global" }
  ],
  "last_updated": "2026-04-03"
}
```

- [ ] **Step 8: Write validation script tests**

Create `tests/scripts/validate-data.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { validateFacility, validateRegulatory } from '../../scripts/validate-data.js'

describe('validateFacility', () => {
  const valid = {
    id: 'us-va-001', company: 'Test', lat: 39.0, lng: -77.0,
    country: 'US', source: 'PeeringDB', source_date: '2025-01-01',
    status: 'operational', facility_type: 'colocation', cooling_method: 'air_cooled',
    confidence_tier: 'verified', source_url: 'https://example.com', data_gaps: [],
  }

  it('accepts a valid facility', () => {
    expect(validateFacility(valid)).toEqual({ valid: true, errors: [] })
  })

  it('rejects missing required fields', () => {
    const { id, ...noId } = valid
    const result = validateFacility(noId)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Missing required field: id')
  })

  it('rejects invalid latitude', () => {
    const result = validateFacility({ ...valid, lat: 200 })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('lat must be between -90 and 90')
  })

  it('rejects invalid status enum', () => {
    const result = validateFacility({ ...valid, status: 'active' })
    expect(result.valid).toBe(false)
    expect(result.errors[0]).toContain('Invalid status')
  })

  it('rejects verified tier without source_url', () => {
    const result = validateFacility({ ...valid, confidence_tier: 'verified', source_url: null })
    expect(result.valid).toBe(false)
    expect(result.errors[0]).toContain('source_url required')
  })
})

describe('validateRegulatory', () => {
  const valid = {
    zone_id: 'us-va', country: 'US', region: 'Virginia',
    regulatory_complexity_score: 62,
    regulations: [{
      category: 'energy_efficiency', name: 'Test Act', level: 'federal',
      summary: 'Test summary', url: 'https://example.com',
      effective_date: '2020-01-01', relevance: 'Test relevance',
    }],
  }

  it('accepts a valid regulatory record', () => {
    expect(validateRegulatory(valid)).toEqual({ valid: true, errors: [] })
  })

  it('rejects regulation without url', () => {
    const bad = { ...valid, regulations: [{ ...valid.regulations[0], url: '' }] }
    const result = validateRegulatory(bad)
    expect(result.valid).toBe(false)
    expect(result.errors[0]).toContain('url required')
  })
})
```

- [ ] **Step 9: Run tests to verify they fail**

Run:
```bash
npx vitest run tests/scripts/validate-data.test.js
```
Expected: FAIL — `cannot find module '../../scripts/validate-data.js'`

- [ ] **Step 10: Implement validation script**

Create `scripts/validate-data.js`:
```js
const REQUIRED_FIELDS = ['id', 'company', 'lat', 'lng', 'country', 'source', 'source_date']
const VALID_STATUS = ['operational', 'under_construction', 'planned', 'announced']
const VALID_TYPES = ['colocation', 'enterprise', 'hyperscale', 'edge', 'government', 'ai_factory']
const VALID_COOLING = ['air_cooled', 'liquid_cooled', 'immersion', 'hybrid', 'evaporative', 'unknown']
const VALID_CONFIDENCE = ['verified', 'reported', 'unconfirmed']
const VALID_CATEGORIES = ['energy_efficiency', 'water_use', 'environmental', 'safety', 'building_code', 'tax_incentive']
const VALID_LEVELS = ['federal', 'state_provincial', 'local', 'agency']

export function validateFacility(f) {
  const errors = []

  for (const field of REQUIRED_FIELDS) {
    if (f[field] === undefined || f[field] === null || f[field] === '') {
      errors.push(`Missing required field: ${field}`)
    }
  }

  if (f.lat !== null && f.lat !== undefined && (f.lat < -90 || f.lat > 90)) {
    errors.push('lat must be between -90 and 90')
  }
  if (f.lng !== null && f.lng !== undefined && (f.lng < -180 || f.lng > 180)) {
    errors.push('lng must be between -180 and 180')
  }

  if (f.status && !VALID_STATUS.includes(f.status)) {
    errors.push(`Invalid status: ${f.status}. Must be one of: ${VALID_STATUS.join(', ')}`)
  }
  if (f.facility_type && !VALID_TYPES.includes(f.facility_type)) {
    errors.push(`Invalid facility_type: ${f.facility_type}. Must be one of: ${VALID_TYPES.join(', ')}`)
  }
  if (f.cooling_method && !VALID_COOLING.includes(f.cooling_method)) {
    errors.push(`Invalid cooling_method: ${f.cooling_method}. Must be one of: ${VALID_COOLING.join(', ')}`)
  }
  if (f.confidence_tier && !VALID_CONFIDENCE.includes(f.confidence_tier)) {
    errors.push(`Invalid confidence_tier: ${f.confidence_tier}. Must be one of: ${VALID_CONFIDENCE.join(', ')}`)
  }

  if (f.confidence_tier === 'verified' && (!f.source_url || f.source_url === '')) {
    errors.push('source_url required for verified confidence_tier')
  }

  return { valid: errors.length === 0, errors }
}

export function validateRegulatory(r) {
  const errors = []

  if (!r.zone_id) errors.push('Missing required field: zone_id')
  if (!r.country) errors.push('Missing required field: country')
  if (!r.region) errors.push('Missing required field: region')
  if (r.regulatory_complexity_score === undefined) errors.push('Missing required field: regulatory_complexity_score')

  if (r.regulations) {
    r.regulations.forEach((reg, i) => {
      if (!reg.url || reg.url === '') {
        errors.push(`Regulation [${i}] "${reg.name || 'unnamed'}": url required for all regulations`)
      }
      if (reg.category && !VALID_CATEGORIES.includes(reg.category)) {
        errors.push(`Regulation [${i}]: invalid category "${reg.category}"`)
      }
      if (reg.level && !VALID_LEVELS.includes(reg.level)) {
        errors.push(`Regulation [${i}]: invalid level "${reg.level}"`)
      }
    })
  }

  return { valid: errors.length === 0, errors }
}
```

- [ ] **Step 11: Run tests to verify they pass**

Run:
```bash
npx vitest run tests/scripts/validate-data.test.js
```
Expected: All 7 tests PASS.

- [ ] **Step 12: Commit**

```bash
git add src/data/ scripts/ tests/scripts/
git commit -m "feat: add sample data files and validation script with tests"
```

---

### Task 4: Data Loading Hook (useFacilities)

**Files:**
- Create: `src/hooks/useFacilities.js`
- Depends on: `src/scoring/coolingFit.js`, `src/scoring/marketTier.js`, `src/data/facilities/*.json`

- [ ] **Step 1: Implement useFacilities hook**

Create `src/hooks/useFacilities.js`:
```js
import { useMemo } from 'react'
import usFacilities from '../data/facilities/us.json'
import canadaFacilities from '../data/facilities/canada.json'
import euFacilities from '../data/facilities/eu.json'
import { calculateCoolingFit } from '../scoring/coolingFit.js'
import { classifyMarketTier } from '../scoring/marketTier.js'

export function useFacilities() {
  const facilities = useMemo(() => {
    const raw = [...usFacilities, ...canadaFacilities, ...euFacilities]
    return raw.map((f) => {
      const cooling_fit_score = calculateCoolingFit(f)
      const market_tier = classifyMarketTier({ ...f, cooling_fit_score })
      return { ...f, cooling_fit_score, market_tier }
    })
  }, [])

  return facilities
}
```

- [ ] **Step 2: Verify it compiles by importing in App**

Add a temporary import to `src/App.jsx` — add at the top:
```js
import { useFacilities } from './hooks/useFacilities.js'
```

And inside the component, before the return:
```js
const facilities = useFacilities()
console.log('Loaded facilities:', facilities.length)
```

Run:
```bash
npm run dev
```
Expected: Console shows `Loaded facilities: 7` with no errors.

- [ ] **Step 3: Remove temporary console.log, keep the import for later use**

Revert the console.log line but keep the import and `useFacilities()` call. We'll use it in App.jsx when wiring up context.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useFacilities.js
git commit -m "feat: add useFacilities hook — loads, scores, and classifies all facilities"
```

---

### Task 5: Filter Context & Hook

**Files:**
- Create: `src/context/FilterContext.jsx`, `src/hooks/useFilters.js`
- Test: `tests/hooks/useFilters.test.js`

- [ ] **Step 1: Write filter logic tests**

Create `tests/hooks/useFilters.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { applyFilters, PRESETS } from '../../src/hooks/useFilters.js'

const facilities = [
  { id: '1', country: 'US', region: 'Virginia', status: 'operational', facility_type: 'colocation', capacity_mw: 5, pue: 1.10, cooling_method: 'air_cooled', cooling_fit_score: 90, market_tier: 'som' },
  { id: '2', country: 'CA', region: 'Ontario', status: 'planned', facility_type: 'ai_factory', capacity_mw: 8, pue: null, cooling_method: 'unknown', cooling_fit_score: 72, market_tier: 'som' },
  { id: '3', country: 'US', region: 'California', status: 'operational', facility_type: 'hyperscale', capacity_mw: 32, pue: 1.50, cooling_method: 'evaporative', cooling_fit_score: 26, market_tier: 'tam' },
]

describe('applyFilters', () => {
  it('returns all facilities with empty filters', () => {
    expect(applyFilters(facilities, {})).toHaveLength(3)
  })

  it('filters by country', () => {
    expect(applyFilters(facilities, { countries: ['CA'] })).toHaveLength(1)
    expect(applyFilters(facilities, { countries: ['US'] })).toHaveLength(2)
    expect(applyFilters(facilities, { countries: ['US', 'CA'] })).toHaveLength(3)
  })

  it('filters by status', () => {
    expect(applyFilters(facilities, { statuses: ['planned'] })).toHaveLength(1)
  })

  it('filters by facility type', () => {
    expect(applyFilters(facilities, { facilityTypes: ['colocation', 'ai_factory'] })).toHaveLength(2)
  })

  it('filters by capacity range', () => {
    expect(applyFilters(facilities, { capacityRange: [0, 10] })).toHaveLength(2)
  })

  it('filters by PUE range — nulls are included', () => {
    expect(applyFilters(facilities, { pueRange: [1.0, 1.20] })).toHaveLength(2)
  })

  it('filters by cooling method', () => {
    expect(applyFilters(facilities, { coolingMethods: ['air_cooled'] })).toHaveLength(1)
  })

  it('filters by market tier', () => {
    expect(applyFilters(facilities, { marketTiers: ['som'] })).toHaveLength(2)
  })

  it('filters by cooling fit score range', () => {
    expect(applyFilters(facilities, { coolingFitRange: [70, 100] })).toHaveLength(2)
  })

  it('combines filters with AND logic', () => {
    expect(applyFilters(facilities, { countries: ['US'], statuses: ['operational'] })).toHaveLength(2)
    expect(applyFilters(facilities, { countries: ['US'], capacityRange: [0, 10] })).toHaveLength(1)
  })
})

describe('PRESETS', () => {
  it('has Solar Steam Targets preset', () => {
    expect(PRESETS['Solar Steam Targets']).toBeDefined()
    expect(PRESETS['Solar Steam Targets'].capacityRange).toEqual([0, 10])
    expect(PRESETS['Solar Steam Targets'].pueRange).toEqual([1.04, 1.20])
  })

  it('has Competitive Landscape preset', () => {
    expect(PRESETS['Competitive Landscape']).toBeDefined()
    expect(PRESETS['Competitive Landscape'].pueRange).toEqual([1.04, 1.20])
  })

  it('has Greenfield Opportunities preset', () => {
    expect(PRESETS['Greenfield Opportunities']).toBeDefined()
    expect(PRESETS['Greenfield Opportunities'].statuses).toContain('planned')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run:
```bash
npx vitest run tests/hooks/useFilters.test.js
```
Expected: FAIL — `cannot find module '../../src/hooks/useFilters.js'`

- [ ] **Step 3: Implement useFilters with applyFilters and presets**

Create `src/hooks/useFilters.js`:
```js
import { useState, useMemo, useCallback } from 'react'

export const PRESETS = {
  'Solar Steam Targets': {
    capacityRange: [0, 10],
    pueRange: [1.04, 1.20],
    statuses: ['operational'],
  },
  'Competitive Landscape': {
    pueRange: [1.04, 1.20],
    coolingMethods: ['liquid_cooled', 'immersion', 'hybrid'],
  },
  'Greenfield Opportunities': {
    statuses: ['planned', 'announced', 'under_construction'],
    capacityRange: [0, 10],
  },
}

export function applyFilters(facilities, filters) {
  return facilities.filter((f) => {
    if (filters.countries?.length && !filters.countries.includes(f.country)) return false
    if (filters.regions?.length && !filters.regions.includes(f.region)) return false
    if (filters.statuses?.length && !filters.statuses.includes(f.status)) return false
    if (filters.facilityTypes?.length && !filters.facilityTypes.includes(f.facility_type)) return false
    if (filters.coolingMethods?.length && !filters.coolingMethods.includes(f.cooling_method)) return false
    if (filters.marketTiers?.length && !filters.marketTiers.includes(f.market_tier)) return false

    if (filters.capacityRange) {
      const [min, max] = filters.capacityRange
      if (f.capacity_mw !== null && f.capacity_mw !== undefined) {
        if (f.capacity_mw < min || f.capacity_mw > max) return false
      }
    }

    if (filters.pueRange) {
      const [min, max] = filters.pueRange
      // Include facilities with null PUE (unknown) — don't filter them out
      if (f.pue !== null && f.pue !== undefined) {
        if (f.pue < min || f.pue > max) return false
      }
    }

    if (filters.coolingFitRange) {
      const [min, max] = filters.coolingFitRange
      if (f.cooling_fit_score < min || f.cooling_fit_score > max) return false
    }

    return true
  })
}

export function useFilters(facilities) {
  const [filters, setFilters] = useState({})

  const filtered = useMemo(() => applyFilters(facilities, filters), [facilities, filters])

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => {
      if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
        const { [key]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [key]: value }
    })
  }, [])

  const applyPreset = useCallback((presetName) => {
    const preset = PRESETS[presetName]
    if (preset) setFilters(preset)
  }, [])

  const resetFilters = useCallback(() => setFilters({}), [])

  return { filters, filtered, setFilter, applyPreset, resetFilters }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run:
```bash
npx vitest run tests/hooks/useFilters.test.js
```
Expected: All 12 tests PASS.

- [ ] **Step 5: Create FilterContext provider**

Create `src/context/FilterContext.jsx`:
```jsx
import { createContext, useContext } from 'react'
import { useFacilities } from '../hooks/useFacilities.js'
import { useFilters } from '../hooks/useFilters.js'

const FilterContext = createContext(null)

export function FilterProvider({ children }) {
  const facilities = useFacilities()
  const filterState = useFilters(facilities)

  return (
    <FilterContext.Provider value={{ facilities, ...filterState }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilterContext() {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error('useFilterContext must be used within FilterProvider')
  return ctx
}
```

- [ ] **Step 6: Wrap App in FilterProvider**

Update `src/main.jsx`:
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FilterProvider } from './context/FilterContext.jsx'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FilterProvider>
      <App />
    </FilterProvider>
  </StrictMode>,
)
```

- [ ] **Step 7: Verify app still loads**

Run:
```bash
npm run dev
```
Expected: No errors. App renders with sidebar and map placeholder.

- [ ] **Step 8: Commit**

```bash
git add src/hooks/useFilters.js src/context/FilterContext.jsx src/main.jsx tests/hooks/
git commit -m "feat: add filter system with context provider, presets, and AND-combined filtering"
```

---

### Task 6: Utility Formatters

**Files:**
- Create: `src/utils/formatters.js`

- [ ] **Step 1: Create formatters**

Create `src/utils/formatters.js`:
```js
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

export function tierLabel(tier) {
  return (tier || '').toUpperCase()
}

export function statusLabel(status) {
  const labels = {
    operational: 'Operational',
    under_construction: 'Under Construction',
    planned: 'Planned',
    announced: 'Announced',
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
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/formatters.js
git commit -m "feat: add display formatting utilities"
```

---

### Task 7: Map Component

**Files:**
- Create: `src/components/Map/MapContainer.jsx`, `src/components/Map/FacilityMarkers.jsx`, `src/components/Map/MapLegend.jsx`

- [ ] **Step 1: Create MapContainer**

Create `src/components/Map/MapContainer.jsx`:
```jsx
import { useState, useCallback } from 'react'
import Map, { NavigationControl } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useFilterContext } from '../../context/FilterContext.jsx'
import FacilityMarkers from './FacilityMarkers.jsx'
import MapLegend from './MapLegend.jsx'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || ''

const INITIAL_VIEW = {
  longitude: -40,
  latitude: 45,
  zoom: 2.5,
}

export default function MapContainer({ onSelectFacility, onSelectRegion }) {
  const { filtered } = useFilterContext()
  const [viewState, setViewState] = useState(INITIAL_VIEW)

  const handleMarkerClick = useCallback((facility) => {
    onSelectFacility?.(facility)
  }, [onSelectFacility])

  return (
    <Map
      {...viewState}
      onMove={(e) => setViewState(e.viewState)}
      mapboxAccessToken={MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/light-v11"
      style={{ width: '100%', height: '100%' }}
    >
      <NavigationControl position="top-right" />
      <FacilityMarkers facilities={filtered} onClick={handleMarkerClick} />
      <MapLegend />
    </Map>
  )
}
```

- [ ] **Step 2: Create FacilityMarkers**

Create `src/components/Map/FacilityMarkers.jsx`:
```jsx
import { Marker } from 'react-map-gl/mapbox'
import { tierColor } from '../../utils/formatters.js'

export default function FacilityMarkers({ facilities, onClick }) {
  return (
    <>
      {facilities.map((f) => (
        <Marker
          key={f.id}
          longitude={f.lng}
          latitude={f.lat}
          anchor="center"
          onClick={(e) => {
            e.originalEvent.stopPropagation()
            onClick?.(f)
          }}
        >
          <div
            className="rounded-full cursor-pointer border-2 border-white"
            style={{
              width: 12,
              height: 12,
              backgroundColor: tierColor(f.market_tier),
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }}
            title={f.facility_name}
          />
        </Marker>
      ))}
    </>
  )
}
```

- [ ] **Step 3: Create MapLegend**

Create `src/components/Map/MapLegend.jsx`:
```jsx
export default function MapLegend() {
  const items = [
    { color: '#34a853', label: 'SOM — High Fit' },
    { color: '#fbbc04', label: 'SAM — Moderate Fit' },
    { color: '#ea4335', label: 'TAM — All Facilities' },
  ]

  return (
    <div className="absolute bottom-4 left-4 bg-white/95 border border-[#dadce0] rounded-lg px-3 py-2 shadow-sm">
      <div className="text-[9px] font-semibold text-[#5f6368] uppercase tracking-wide mb-1">Market Tier</div>
      {items.map(({ color, label }) => (
        <div key={label} className="flex items-center gap-2 text-xs text-[#3c4043]">
          <div className="w-2.5 h-2.5 rounded-full border border-white" style={{ backgroundColor: color, boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }} />
          {label}
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Create `.env` with Mapbox token placeholder**

Create `.env`:
```
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

Add `.env` to `.gitignore`:
```bash
echo ".env" >> .gitignore
```

- [ ] **Step 5: Wire MapContainer into App**

Update `src/App.jsx`:
```jsx
import { useState } from 'react'
import MapContainer from './components/Map/MapContainer.jsx'

export default function App() {
  const [selectedFacility, setSelectedFacility] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState(null)

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans text-[#3c4043]">
      {/* Left sidebar */}
      <aside className="w-[280px] flex-shrink-0 border-r border-[#dadce0] bg-white overflow-y-auto p-4">
        <h1 className="text-lg font-semibold text-[#1a73e8]">Solar Steam</h1>
        <p className="text-xs text-[#5f6368] mt-1">Data Center Cooling Market Intelligence</p>
      </aside>

      {/* Map area */}
      <main className="flex-1 relative">
        <MapContainer
          onSelectFacility={setSelectedFacility}
          onSelectRegion={setSelectedRegion}
        />
      </main>
    </div>
  )
}
```

- [ ] **Step 6: Test in browser**

Run:
```bash
npm run dev
```
Expected: Map renders with light style. Sample markers appear color-coded (green/amber/red). Navigation controls visible. Clicking a marker logs the facility to console (we'll wire up the panel next).

- [ ] **Step 7: Commit**

```bash
git add src/components/Map/ src/App.jsx .gitignore
git commit -m "feat: add Mapbox GL map with facility markers and tier legend"
```

---

### Task 8: Facility Detail Panel

**Files:**
- Create: `src/components/Panels/FacilityPanel.jsx`

- [ ] **Step 1: Create FacilityPanel (compact card)**

Create `src/components/Panels/FacilityPanel.jsx`:
```jsx
import { formatPue, formatCapacity, tierColor, tierLabel, statusLabel, coolingLabel, typeLabel, formatDate } from '../../utils/formatters.js'

export default function FacilityPanel({ facility, onClose }) {
  if (!facility) return null

  const f = facility

  return (
    <aside className="w-[300px] flex-shrink-0 border-l border-[#dadce0] bg-white overflow-y-auto p-4">
      <div className="flex justify-between items-center mb-3">
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${tierColor(f.market_tier)}20`, color: tierColor(f.market_tier) }}
        >
          {tierLabel(f.market_tier)}
        </span>
        <button onClick={onClose} className="text-[#9aa0a6] hover:text-[#3c4043] text-lg leading-none">&times;</button>
      </div>

      <h2 className="text-[15px] font-semibold text-[#202124] mb-0.5">{f.facility_name}</h2>
      <p className="text-[11px] text-[#5f6368] mb-3">
        {f.company} &middot; {typeLabel(f.facility_type)}
      </p>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <MetricCard label="Capacity" value={formatCapacity(f.capacity_mw)} />
        <MetricCard label="PUE" value={formatPue(f.pue)} color={f.pue && f.pue <= 1.20 ? '#34a853' : f.pue && f.pue <= 1.40 ? '#fbbc04' : '#ea4335'} />
        <MetricCard label="Cooling Fit" value={f.cooling_fit_score} color={f.cooling_fit_score >= 70 ? '#34a853' : f.cooling_fit_score >= 40 ? '#fbbc04' : '#ea4335'} />
        <MetricCard label="Cooling" value={coolingLabel(f.cooling_method)} small />
      </div>

      <p className="text-[10px] text-[#5f6368] mb-1">
        📍 {f.address || 'Address not available'}
      </p>
      <p className="text-[10px] text-[#5f6368] mb-2">
        {statusIcon(f.status)} {statusLabel(f.status)}
      </p>

      {f.data_gaps?.length > 0 && (
        <p className="text-[9px] text-[#fbbc04] mb-2">
          ⚠ Data gaps: {f.data_gaps.join(', ')}
        </p>
      )}

      <div className="border-t border-[#e8eaed] pt-2 text-[9px] text-[#9aa0a6]">
        Source: {f.source} &middot; Verified: {formatDate(f.last_verified)}
        {f.confidence_tier && ` · ${f.confidence_tier}`}
      </div>
    </aside>
  )
}

function MetricCard({ label, value, color, small }) {
  return (
    <div className="bg-[#f8f9fa] rounded-md p-2 text-center">
      <div className="text-[9px] text-[#5f6368] uppercase tracking-wide">{label}</div>
      <div
        className={`font-bold ${small ? 'text-[11px] mt-0.5' : 'text-base'}`}
        style={color ? { color } : { color: '#202124' }}
      >
        {value}
      </div>
    </div>
  )
}

function statusIcon(status) {
  if (status === 'operational') return '🟢'
  if (status === 'under_construction') return '🟡'
  if (status === 'planned' || status === 'announced') return '🔵'
  return '⚪'
}
```

- [ ] **Step 2: Wire FacilityPanel into App**

Update `src/App.jsx`:
```jsx
import { useState } from 'react'
import MapContainer from './components/Map/MapContainer.jsx'
import FacilityPanel from './components/Panels/FacilityPanel.jsx'

export default function App() {
  const [selectedFacility, setSelectedFacility] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState(null)

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans text-[#3c4043]">
      {/* Left sidebar */}
      <aside className="w-[280px] flex-shrink-0 border-r border-[#dadce0] bg-white overflow-y-auto p-4">
        <h1 className="text-lg font-semibold text-[#1a73e8]">Solar Steam</h1>
        <p className="text-xs text-[#5f6368] mt-1">Data Center Cooling Market Intelligence</p>
      </aside>

      {/* Map area */}
      <main className="flex-1 relative">
        <MapContainer
          onSelectFacility={(f) => { setSelectedFacility(f); setSelectedRegion(null) }}
          onSelectRegion={(r) => { setSelectedRegion(r); setSelectedFacility(null) }}
        />
      </main>

      {/* Right panel */}
      {selectedFacility && (
        <FacilityPanel facility={selectedFacility} onClose={() => setSelectedFacility(null)} />
      )}
    </div>
  )
}
```

- [ ] **Step 3: Test in browser**

Run:
```bash
npm run dev
```
Expected: Click a marker → right panel slides in showing facility name, company, 2×2 metrics, address, status, and source. Close button dismisses it.

- [ ] **Step 4: Commit**

```bash
git add src/components/Panels/FacilityPanel.jsx src/App.jsx
git commit -m "feat: add compact facility detail panel with metrics grid"
```

---

### Task 9: Filter Sidebar

**Files:**
- Create: `src/components/Filters/FilterSidebar.jsx`, `src/components/Filters/FilterChips.jsx`

- [ ] **Step 1: Create FilterSidebar**

Create `src/components/Filters/FilterSidebar.jsx`:
```jsx
import { useFilterContext } from '../../context/FilterContext.jsx'
import { PRESETS } from '../../hooks/useFilters.js'
import FilterChips from './FilterChips.jsx'

const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'DE', label: 'Germany' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'IE', label: 'Ireland' },
  { value: 'FR', label: 'France' },
  { value: 'SE', label: 'Sweden' },
  { value: 'FI', label: 'Finland' },
  { value: 'GB', label: 'United Kingdom' },
]

const STATUSES = ['operational', 'under_construction', 'planned', 'announced']
const FACILITY_TYPES = ['colocation', 'enterprise', 'hyperscale', 'edge', 'government', 'ai_factory']
const COOLING_METHODS = ['air_cooled', 'liquid_cooled', 'immersion', 'hybrid', 'evaporative', 'unknown']
const MARKET_TIERS = ['tam', 'sam', 'som']

export default function FilterSidebar() {
  const { facilities, filters, filtered, setFilter, applyPreset, resetFilters } = useFilterContext()

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-[#1a73e8]">Solar Steam</h1>
        <p className="text-[10px] text-[#5f6368] mt-0.5">Data Center Cooling Market Intelligence</p>
      </div>

      {/* Facility count */}
      <div className="text-xs text-[#5f6368]">
        Showing <span className="font-semibold text-[#1a73e8]">{filtered.length}</span> of {facilities.length} facilities
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-1.5">
        {Object.keys(PRESETS).map((name) => (
          <button
            key={name}
            onClick={() => applyPreset(name)}
            className="text-[10px] bg-[#e8f0fe] text-[#1967d2] px-2.5 py-1 rounded-full hover:bg-[#d2e3fc] transition-colors"
          >
            {name}
          </button>
        ))}
        <button
          onClick={resetFilters}
          className="text-[10px] bg-[#f1f3f4] text-[#5f6368] px-2.5 py-1 rounded-full hover:bg-[#dadce0] transition-colors"
        >
          Reset All
        </button>
      </div>

      {/* Active chips */}
      <FilterChips />

      {/* Country */}
      <FilterSection title="Country">
        <MultiCheck
          options={COUNTRIES}
          selected={filters.countries || []}
          onChange={(v) => setFilter('countries', v)}
        />
      </FilterSection>

      {/* Status */}
      <FilterSection title="Status">
        <ChipSelect
          options={STATUSES}
          selected={filters.statuses || []}
          onChange={(v) => setFilter('statuses', v)}
          labelFn={statusChipLabel}
        />
      </FilterSection>

      {/* Facility Type */}
      <FilterSection title="Facility Type">
        <MultiCheck
          options={FACILITY_TYPES.map((t) => ({ value: t, label: typeCheckLabel(t) }))}
          selected={filters.facilityTypes || []}
          onChange={(v) => setFilter('facilityTypes', v)}
        />
      </FilterSection>

      {/* Capacity */}
      <FilterSection title="Capacity (MW)">
        <RangeSlider
          min={0} max={50} step={1}
          value={filters.capacityRange || [0, 50]}
          onChange={(v) => setFilter('capacityRange', v[0] === 0 && v[1] === 50 ? null : v)}
          highlight={[0, 10]}
          highlightLabel="Solar Steam range"
        />
      </FilterSection>

      {/* PUE */}
      <FilterSection title="PUE">
        <RangeSlider
          min={1.0} max={2.0} step={0.01}
          value={filters.pueRange || [1.0, 2.0]}
          onChange={(v) => setFilter('pueRange', v[0] === 1.0 && v[1] === 2.0 ? null : v)}
          highlight={[1.04, 1.20]}
          highlightLabel="Primary focus"
        />
      </FilterSection>

      {/* Cooling Method */}
      <FilterSection title="Cooling Method">
        <ChipSelect
          options={COOLING_METHODS}
          selected={filters.coolingMethods || []}
          onChange={(v) => setFilter('coolingMethods', v)}
          labelFn={coolingChipLabel}
        />
      </FilterSection>

      {/* Cooling Fit Score */}
      <FilterSection title="Cooling Fit Score">
        <RangeSlider
          min={0} max={100} step={1}
          value={filters.coolingFitRange || [0, 100]}
          onChange={(v) => setFilter('coolingFitRange', v[0] === 0 && v[1] === 100 ? null : v)}
          highlight={[70, 100]}
          highlightLabel="SOM threshold"
        />
      </FilterSection>

      {/* Market Tier */}
      <FilterSection title="Market Tier">
        <ChipSelect
          options={MARKET_TIERS}
          selected={filters.marketTiers || []}
          onChange={(v) => setFilter('marketTiers', v)}
          labelFn={(t) => t.toUpperCase()}
        />
      </FilterSection>
    </div>
  )
}

function FilterSection({ title, children }) {
  return (
    <div className="border border-[#dadce0] rounded-lg p-2.5 bg-white">
      <div className="text-[9px] font-semibold text-[#5f6368] uppercase tracking-wide mb-1.5">{title}</div>
      {children}
    </div>
  )
}

function MultiCheck({ options, selected, onChange }) {
  const toggle = (val) => {
    const next = selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]
    onChange(next)
  }
  return (
    <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
      {options.map((opt) => {
        const value = typeof opt === 'string' ? opt : opt.value
        const label = typeof opt === 'string' ? opt : opt.label
        return (
          <label key={value} className="flex items-center gap-1.5 text-[11px] text-[#3c4043] cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(value)}
              onChange={() => toggle(value)}
              className="rounded border-[#dadce0]"
            />
            {label}
          </label>
        )
      })}
    </div>
  )
}

function ChipSelect({ options, selected, onChange, labelFn }) {
  const toggle = (val) => {
    const next = selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]
    onChange(next)
  }
  return (
    <div className="flex flex-wrap gap-1">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => toggle(opt)}
          className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
            selected.includes(opt)
              ? 'bg-[#1a73e8] text-white border-[#1a73e8]'
              : 'bg-[#f1f3f4] text-[#5f6368] border-[#dadce0] hover:bg-[#e8eaed]'
          }`}
        >
          {labelFn ? labelFn(opt) : opt}
        </button>
      ))}
    </div>
  )
}

function RangeSlider({ min, max, step, value, onChange, highlight, highlightLabel }) {
  const [lo, hi] = value
  return (
    <div>
      <div className="flex justify-between text-[10px] text-[#5f6368] mb-1">
        <span>{step < 1 ? lo.toFixed(2) : lo}</span>
        <span>{step < 1 ? hi.toFixed(2) : hi}</span>
      </div>
      <div className="flex gap-2">
        <input type="range" min={min} max={max} step={step} value={lo}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi), hi])}
          className="w-full accent-[#1a73e8]" />
        <input type="range" min={min} max={max} step={step} value={hi}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo)])}
          className="w-full accent-[#1a73e8]" />
      </div>
      {highlight && highlightLabel && (
        <div className="text-[9px] text-[#34a853] mt-0.5">
          ★ {highlightLabel}: {step < 1 ? highlight[0].toFixed(2) : highlight[0]}–{step < 1 ? highlight[1].toFixed(2) : highlight[1]}
        </div>
      )}
    </div>
  )
}

function statusChipLabel(s) {
  const map = { operational: 'Operational', under_construction: 'Under Construction', planned: 'Planned', announced: 'Announced' }
  return map[s] || s
}

function typeCheckLabel(t) {
  const map = { colocation: 'Colocation', enterprise: 'Enterprise', hyperscale: 'Hyperscale', edge: 'Edge', government: 'Government', ai_factory: 'AI Factory' }
  return map[t] || t
}

function coolingChipLabel(c) {
  const map = { air_cooled: 'Air', liquid_cooled: 'Liquid', immersion: 'Immersion', hybrid: 'Hybrid', evaporative: 'Evaporative', unknown: 'Unknown' }
  return map[c] || c
}
```

- [ ] **Step 2: Create FilterChips**

Create `src/components/Filters/FilterChips.jsx`:
```jsx
import { useFilterContext } from '../../context/FilterContext.jsx'

export default function FilterChips() {
  const { filters, setFilter } = useFilterContext()

  const chips = []

  if (filters.countries?.length) {
    filters.countries.forEach((c) => chips.push({ key: 'countries', value: c, label: c }))
  }
  if (filters.statuses?.length) {
    filters.statuses.forEach((s) => chips.push({ key: 'statuses', value: s, label: s }))
  }
  if (filters.facilityTypes?.length) {
    filters.facilityTypes.forEach((t) => chips.push({ key: 'facilityTypes', value: t, label: t }))
  }
  if (filters.coolingMethods?.length) {
    filters.coolingMethods.forEach((m) => chips.push({ key: 'coolingMethods', value: m, label: m }))
  }
  if (filters.marketTiers?.length) {
    filters.marketTiers.forEach((t) => chips.push({ key: 'marketTiers', value: t, label: t.toUpperCase() }))
  }
  if (filters.capacityRange) {
    chips.push({ key: 'capacityRange', value: null, label: `${filters.capacityRange[0]}–${filters.capacityRange[1]} MW` })
  }
  if (filters.pueRange) {
    chips.push({ key: 'pueRange', value: null, label: `PUE ${filters.pueRange[0].toFixed(2)}–${filters.pueRange[1].toFixed(2)}` })
  }
  if (filters.coolingFitRange) {
    chips.push({ key: 'coolingFitRange', value: null, label: `Fit ${filters.coolingFitRange[0]}–${filters.coolingFitRange[1]}` })
  }

  if (chips.length === 0) return null

  const remove = (chip) => {
    const current = filters[chip.key]
    if (Array.isArray(current)) {
      const next = current.filter((v) => v !== chip.value)
      setFilter(chip.key, next)
    } else {
      setFilter(chip.key, null)
    }
  }

  return (
    <div className="flex flex-wrap gap-1">
      {chips.map((chip, i) => (
        <span
          key={`${chip.key}-${chip.value || i}`}
          className="text-[10px] bg-white border border-[#dadce0] text-[#3c4043] px-2 py-0.5 rounded-full flex items-center gap-1"
        >
          {chip.label}
          <button onClick={() => remove(chip)} className="text-[#9aa0a6] hover:text-[#3c4043]">&times;</button>
        </span>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Wire FilterSidebar into App**

Update `src/App.jsx`:
```jsx
import { useState } from 'react'
import MapContainer from './components/Map/MapContainer.jsx'
import FacilityPanel from './components/Panels/FacilityPanel.jsx'
import FilterSidebar from './components/Filters/FilterSidebar.jsx'

export default function App() {
  const [selectedFacility, setSelectedFacility] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState(null)

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans text-[#3c4043]">
      {/* Left sidebar */}
      <aside className="w-[280px] flex-shrink-0 border-r border-[#dadce0] bg-white overflow-y-auto p-4">
        <FilterSidebar />
      </aside>

      {/* Map area */}
      <main className="flex-1 relative">
        <MapContainer
          onSelectFacility={(f) => { setSelectedFacility(f); setSelectedRegion(null) }}
          onSelectRegion={(r) => { setSelectedRegion(r); setSelectedFacility(null) }}
        />
      </main>

      {/* Right panel */}
      {selectedFacility && (
        <FacilityPanel facility={selectedFacility} onClose={() => setSelectedFacility(null)} />
      )}
    </div>
  )
}
```

- [ ] **Step 4: Test in browser**

Run:
```bash
npm run dev
```
Expected: Sidebar shows branding, facility count, preset buttons, filter chips, and all 9 filter sections. Clicking presets updates filters and map markers. Toggling filters updates the count live.

- [ ] **Step 5: Commit**

```bash
git add src/components/Filters/ src/App.jsx
git commit -m "feat: add filter sidebar with presets, chips, and 9 filter dimensions"
```

---

### Task 10: Dashboard Charts

**Files:**
- Create: `src/components/Dashboard/TamSamSom.jsx`, `src/components/Dashboard/RegionBreakdown.jsx`, `src/components/Dashboard/CoolingFitDistribution.jsx`

- [ ] **Step 1: Create TamSamSom chart**

Create `src/components/Dashboard/TamSamSom.jsx`:
```jsx
import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useFilterContext } from '../../context/FilterContext.jsx'
import { tierColor } from '../../utils/formatters.js'

export default function TamSamSom() {
  const { filtered } = useFilterContext()

  const data = useMemo(() => {
    const counts = { tam: 0, sam: 0, som: 0 }
    filtered.forEach((f) => counts[f.market_tier]++)
    return [
      { name: 'TAM', value: counts.tam, color: tierColor('tam') },
      { name: 'SAM', value: counts.sam, color: tierColor('sam') },
      { name: 'SOM', value: counts.som, color: tierColor('som') },
    ]
  }, [filtered])

  return (
    <div className="border border-[#dadce0] rounded-lg p-2.5 bg-white">
      <div className="text-[9px] font-semibold text-[#5f6368] uppercase tracking-wide mb-1">TAM / SAM / SOM</div>
      <ResponsiveContainer width="100%" height={100}>
        <PieChart>
          <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={20} outerRadius={40}>
            {data.map((d) => <Cell key={d.name} fill={d.color} />)}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} facilities`, name]} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-between text-[10px] text-[#3c4043] mt-1">
        {data.map((d) => (
          <span key={d.name}>
            <span style={{ color: d.color }} className="font-semibold">{d.value}</span> {d.name}
          </span>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create RegionBreakdown chart**

Create `src/components/Dashboard/RegionBreakdown.jsx`:
```jsx
import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useFilterContext } from '../../context/FilterContext.jsx'

const COUNTRY_LABELS = { US: 'US', CA: 'Canada', DE: 'Germany', NL: 'Netherlands', IE: 'Ireland', FR: 'France', SE: 'Sweden', FI: 'Finland', GB: 'UK' }

export default function RegionBreakdown() {
  const { filtered } = useFilterContext()

  const data = useMemo(() => {
    const counts = {}
    filtered.forEach((f) => {
      counts[f.country] = (counts[f.country] || 0) + 1
    })
    return Object.entries(counts)
      .map(([country, count]) => ({ country: COUNTRY_LABELS[country] || country, count }))
      .sort((a, b) => b.count - a.count)
  }, [filtered])

  return (
    <div className="border border-[#dadce0] rounded-lg p-2.5 bg-white">
      <div className="text-[9px] font-semibold text-[#5f6368] uppercase tracking-wide mb-1">By Region</div>
      <ResponsiveContainer width="100%" height={Math.max(60, data.length * 24)}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="country" width={50} tick={{ fontSize: 10, fill: '#5f6368' }} />
          <Tooltip formatter={(value) => [`${value} facilities`]} />
          <Bar dataKey="count" fill="#1a73e8" radius={[0, 3, 3, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
```

- [ ] **Step 3: Create CoolingFitDistribution chart**

Create `src/components/Dashboard/CoolingFitDistribution.jsx`:
```jsx
import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useFilterContext } from '../../context/FilterContext.jsx'
import { coolingLabel } from '../../utils/formatters.js'

const METHOD_COLORS = {
  air_cooled: '#ea4335',
  evaporative: '#fbbc04',
  hybrid: '#a142f4',
  liquid_cooled: '#1a73e8',
  immersion: '#1a73e8',
  unknown: '#9aa0a6',
}

export default function CoolingFitDistribution() {
  const { filtered } = useFilterContext()

  const data = useMemo(() => {
    const counts = {}
    filtered.forEach((f) => {
      const m = f.cooling_method || 'unknown'
      counts[m] = (counts[m] || 0) + 1
    })
    return Object.entries(counts)
      .map(([method, count]) => ({ method, label: coolingLabel(method), count, color: METHOD_COLORS[method] || '#9aa0a6' }))
      .sort((a, b) => b.count - a.count)
  }, [filtered])

  return (
    <div className="border border-[#dadce0] rounded-lg p-2.5 bg-white">
      <div className="text-[9px] font-semibold text-[#5f6368] uppercase tracking-wide mb-1">Cooling Methods</div>
      <ResponsiveContainer width="100%" height={Math.max(60, data.length * 24)}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="label" width={65} tick={{ fontSize: 10, fill: '#5f6368' }} />
          <Tooltip formatter={(value) => [`${value} facilities`]} />
          <Bar dataKey="count" radius={[0, 3, 3, 0]} barSize={14}>
            {data.map((d) => <Cell key={d.method} fill={d.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
```

- [ ] **Step 4: Add charts to FilterSidebar**

Update `src/components/Filters/FilterSidebar.jsx` — add at the top of the file:
```js
import TamSamSom from '../Dashboard/TamSamSom.jsx'
import RegionBreakdown from '../Dashboard/RegionBreakdown.jsx'
import CoolingFitDistribution from '../Dashboard/CoolingFitDistribution.jsx'
```

Add after the Market Tier `FilterSection` closing tag (end of the component, before the final `</div>`):
```jsx
      {/* Dashboard charts */}
      <TamSamSom />
      <RegionBreakdown />
      <CoolingFitDistribution />
```

- [ ] **Step 5: Test in browser**

Run:
```bash
npm run dev
```
Expected: Sidebar now shows three charts below the filters — donut for TAM/SAM/SOM, horizontal bars for regions, horizontal bars for cooling methods. All charts update when filters change.

- [ ] **Step 6: Commit**

```bash
git add src/components/Dashboard/ src/components/Filters/FilterSidebar.jsx
git commit -m "feat: add TAM/SAM/SOM, region breakdown, and cooling method charts"
```

---

### Task 11: Regulatory Panel

**Files:**
- Create: `src/components/Panels/RegulatoryCard.jsx`, `src/components/Panels/RegionPanel.jsx`

- [ ] **Step 1: Create RegulatoryCard**

Create `src/components/Panels/RegulatoryCard.jsx`:
```jsx
const LEVEL_COLORS = {
  federal: { bg: '#e8f0fe', text: '#1967d2' },
  state_provincial: { bg: '#fef7e0', text: '#e37400' },
  local: { bg: '#ceead6', text: '#137333' },
  agency: { bg: '#f3e8fd', text: '#8430ce' },
}

const LEVEL_LABELS = {
  federal: 'Federal',
  state_provincial: 'State/Provincial',
  local: 'Local',
  agency: 'Agency',
}

const CATEGORY_ICONS = {
  energy_efficiency: '⚡',
  water_use: '💧',
  environmental: '🌿',
  safety: '🛡️',
  building_code: '🏗️',
  tax_incentive: '💰',
}

export default function RegulatoryCard({ regulation }) {
  const r = regulation
  const level = LEVEL_COLORS[r.level] || LEVEL_COLORS.federal

  return (
    <div className="border border-[#dadce0] rounded-lg p-3 bg-white">
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{CATEGORY_ICONS[r.category] || '📋'}</span>
          <span className="text-[9px] font-semibold text-[#5f6368] uppercase tracking-wide">
            {r.category?.replace(/_/g, ' ')}
          </span>
        </div>
        <span
          className="text-[9px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
          style={{ backgroundColor: level.bg, color: level.text }}
        >
          {LEVEL_LABELS[r.level] || r.level}
        </span>
      </div>

      <h4 className="text-[13px] font-semibold text-[#202124] mb-1">{r.name}</h4>
      <p className="text-[11px] text-[#3c4043] leading-relaxed mb-2">{r.summary}</p>

      <a
        href={r.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[11px] text-[#1a73e8] hover:underline break-all"
      >
        → View source legislation ↗
      </a>

      <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#f1f3f4] text-[9px] text-[#9aa0a6]">
        <span>Effective: {r.effective_date}</span>
      </div>

      {r.relevance && (
        <p className="text-[10px] text-[#5f6368] italic mt-1">
          Relevance: {r.relevance}
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create RegionPanel**

Create `src/components/Panels/RegionPanel.jsx`:
```jsx
import { useState, useMemo } from 'react'
import RegulatoryCard from './RegulatoryCard.jsx'
import usRegulatory from '../../data/regulatory/us.json'
import canadaRegulatory from '../../data/regulatory/canada.json'
import euRegulatory from '../../data/regulatory/eu.json'

const allRegulatory = [...usRegulatory, ...canadaRegulatory, ...euRegulatory]

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'energy_efficiency', label: 'Energy' },
  { value: 'water_use', label: 'Water' },
  { value: 'environmental', label: 'Environmental' },
  { value: 'safety', label: 'Safety' },
  { value: 'building_code', label: 'Building' },
  { value: 'tax_incentive', label: 'Tax' },
]

export default function RegionPanel({ zoneId, onClose }) {
  const [categoryFilter, setCategoryFilter] = useState('all')

  const zone = useMemo(
    () => allRegulatory.find((r) => r.zone_id === zoneId),
    [zoneId]
  )

  if (!zone) {
    return (
      <aside className="w-[300px] flex-shrink-0 border-l border-[#dadce0] bg-white overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-[#5f6368]">No regulatory data for this zone</span>
          <button onClick={onClose} className="text-[#9aa0a6] hover:text-[#3c4043] text-lg">&times;</button>
        </div>
      </aside>
    )
  }

  const filteredRegs = categoryFilter === 'all'
    ? zone.regulations
    : zone.regulations.filter((r) => r.category === categoryFilter)

  return (
    <aside className="w-[300px] flex-shrink-0 border-l border-[#dadce0] bg-white overflow-y-auto p-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-[15px] font-semibold text-[#202124]">{zone.region}</h2>
          <p className="text-[11px] text-[#5f6368]">{zone.country}</p>
        </div>
        <button onClick={onClose} className="text-[#9aa0a6] hover:text-[#3c4043] text-lg">&times;</button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-[9px] font-semibold text-[#5f6368] uppercase">Complexity</span>
        <div className="flex-1 bg-[#f1f3f4] h-2 rounded-full">
          <div
            className="h-2 rounded-full"
            style={{
              width: `${zone.regulatory_complexity_score}%`,
              backgroundColor: zone.regulatory_complexity_score > 70 ? '#ea4335' : zone.regulatory_complexity_score > 40 ? '#fbbc04' : '#34a853',
            }}
          />
        </div>
        <span className="text-[11px] font-semibold text-[#3c4043]">{zone.regulatory_complexity_score}/100</span>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1 mb-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategoryFilter(cat.value)}
            className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
              categoryFilter === cat.value
                ? 'bg-[#1a73e8] text-white border-[#1a73e8]'
                : 'bg-[#f1f3f4] text-[#5f6368] border-[#dadce0] hover:bg-[#e8eaed]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Regulations */}
      <div className="flex flex-col gap-2">
        {filteredRegs.length === 0 ? (
          <p className="text-[11px] text-[#9aa0a6] text-center py-4">No regulations in this category</p>
        ) : (
          filteredRegs.map((reg, i) => <RegulatoryCard key={i} regulation={reg} />)
        )}
      </div>
    </aside>
  )
}
```

- [ ] **Step 3: Wire RegionPanel into App**

Update `src/App.jsx`:
```jsx
import { useState } from 'react'
import MapContainer from './components/Map/MapContainer.jsx'
import FacilityPanel from './components/Panels/FacilityPanel.jsx'
import RegionPanel from './components/Panels/RegionPanel.jsx'
import FilterSidebar from './components/Filters/FilterSidebar.jsx'

export default function App() {
  const [selectedFacility, setSelectedFacility] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState(null)

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans text-[#3c4043]">
      {/* Left sidebar */}
      <aside className="w-[280px] flex-shrink-0 border-r border-[#dadce0] bg-white overflow-y-auto p-4">
        <FilterSidebar />
      </aside>

      {/* Map area */}
      <main className="flex-1 relative">
        <MapContainer
          onSelectFacility={(f) => { setSelectedFacility(f); setSelectedRegion(null) }}
          onSelectRegion={(r) => { setSelectedRegion(r); setSelectedFacility(null) }}
        />
      </main>

      {/* Right panel — facility or region */}
      {selectedFacility && (
        <FacilityPanel facility={selectedFacility} onClose={() => setSelectedFacility(null)} />
      )}
      {selectedRegion && (
        <RegionPanel zoneId={selectedRegion} onClose={() => setSelectedRegion(null)} />
      )}
    </div>
  )
}
```

- [ ] **Step 4: Test in browser**

For now, test RegionPanel by temporarily setting `selectedRegion` to `'us-va'` in App state. Expected: Right panel shows "Virginia", complexity bar at 62/100, category filter tabs, and two regulation cards with hyperlinks.

- [ ] **Step 5: Commit**

```bash
git add src/components/Panels/RegulatoryCard.jsx src/components/Panels/RegionPanel.jsx src/App.jsx
git commit -m "feat: add regulatory panel with category tabs and hyperlinked source legislation"
```

---

### Task 12: Choropleth Layer & Region Click

**Files:**
- Create: `src/components/Map/ChoroplethLayer.jsx`
- Modify: `src/components/Map/MapContainer.jsx`

- [ ] **Step 1: Create ChoroplethLayer**

Create `src/components/Map/ChoroplethLayer.jsx`:
```jsx
import { useMemo } from 'react'
import { Source, Layer } from 'react-map-gl/mapbox'
import { useFilterContext } from '../../context/FilterContext.jsx'

export default function ChoroplethLayer({ onRegionClick }) {
  const { filtered } = useFilterContext()

  const regionData = useMemo(() => {
    const byZone = {}
    filtered.forEach((f) => {
      const zone = f.regulatory_zone
      if (!zone) return
      if (!byZone[zone]) byZone[zone] = { count: 0, totalScore: 0 }
      byZone[zone].count++
      byZone[zone].totalScore += f.cooling_fit_score
    })
    return byZone
  }, [filtered])

  // For now this is a placeholder — full GeoJSON choropleth requires
  // country/state boundary data which will be added during data enrichment.
  // The regionData calculation above is ready to drive it.

  return null
}
```

Note: Full choropleth implementation requires GeoJSON boundary files for US states, Canadian provinces, and EU countries. This will be wired up during the data enrichment phase. The calculation logic is ready.

- [ ] **Step 2: Add a "View Regulatory" link in FacilityPanel**

Update `src/components/Panels/FacilityPanel.jsx` — add before the border-top source div:
```jsx
      {f.regulatory_zone && (
        <button
          onClick={() => onViewRegulatory?.(f.regulatory_zone)}
          className="text-[11px] text-[#1a73e8] hover:underline mb-2 text-left"
        >
          View regulatory info for {f.region} →
        </button>
      )}
```

Update the component signature to accept the new prop:
```jsx
export default function FacilityPanel({ facility, onClose, onViewRegulatory }) {
```

Update `src/App.jsx` to pass the prop:
```jsx
      {selectedFacility && (
        <FacilityPanel
          facility={selectedFacility}
          onClose={() => setSelectedFacility(null)}
          onViewRegulatory={(zoneId) => { setSelectedRegion(zoneId); setSelectedFacility(null) }}
        />
      )}
```

- [ ] **Step 3: Test in browser**

Run:
```bash
npm run dev
```
Expected: Click a facility marker → panel shows "View regulatory info for Virginia →" link → clicking it opens the RegionPanel.

- [ ] **Step 4: Commit**

```bash
git add src/components/Map/ChoroplethLayer.jsx src/components/Panels/FacilityPanel.jsx src/App.jsx
git commit -m "feat: add regulatory link in facility panel and choropleth layer scaffold"
```

---

### Task 13: Run All Tests & Final Verification

**Files:** None — verification only.

- [ ] **Step 1: Run full test suite**

Run:
```bash
npx vitest run
```
Expected: All tests pass — coolingFit (6), marketTier (6), useFilters (12), validate-data (7) = 31 tests.

- [ ] **Step 2: Run production build**

Run:
```bash
npm run build
```
Expected: Build succeeds with no errors. Output in `dist/`.

- [ ] **Step 3: Preview production build**

Run:
```bash
npm run preview
```
Expected: App loads from `dist/`, all features work — map, markers, filters, presets, panels, charts, regulatory drill-down.

- [ ] **Step 4: Commit any final fixes if needed**

If any issues found during verification, fix and commit:
```bash
git add -A
git commit -m "fix: resolve build/test issues found during verification"
```
