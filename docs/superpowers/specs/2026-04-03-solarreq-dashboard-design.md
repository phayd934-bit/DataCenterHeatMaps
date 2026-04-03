# SolarReq — Data Center Cooling Market Intelligence Dashboard

**Date:** 2026-04-03
**Client:** Solar Steam (CEO Apostol Radev)
**Deadline:** April 7, 2026
**Audience:** CEO / investors — strategic pitch tool

---

## 1. Product Overview

An interactive, geographical market intelligence dashboard for Solar Steam — a company specializing in liquid cooling and emerging immersion cooling for data centers.

The dashboard maps data center facilities across North America and Europe, scores them for liquid/immersion cooling fit, classifies market tiers (TAM/SAM/SOM), and provides regulatory drill-downs with hyperlinked source legislation. It is designed as a CEO/investor pitch tool — visual storytelling, credibility, and polish take priority over CRM-style operations.

**Delivery:** Full integrated dashboard — map + research panels + market sizing — deployed as a static SPA by April 7, 2026.

---

## 2. Strategic Context

### Target Market
Solar Steam's liquid/immersion cooling products are designed for facilities up to 10MW. This is both a product-fit constraint and a strategic market entry point.

### PUE Strategy
- **Primary focus: PUE 1.04–1.20** — Facilities operating at high efficiency, indicating investment in advanced cooling technology. These are Solar Steam's core prospects (operators who invest in cooling) and competitive intelligence targets (who's already using liquid/immersion).
- **PUE >1.20: Visible but secondary** — Present on the map as context, not actively targeted or scored preferentially.

### Market Segmentation (Facility Counts)
- **TAM (Total Addressable Market):** All data center facilities in target regions (US, Canada, EU)
- **SAM (Serviceable Available Market):** TAM filtered to ≤10MW capacity + facility types compatible with liquid/immersion cooling
- **SOM (Serviceable Obtainable Market):** SAM filtered to cooling_fit_score ≥ 70

Market sizing uses facility counts only — no speculative revenue projections.

---

## 3. Technical Architecture

### Stack
- **Framework:** React 18 + Vite
- **Map:** Mapbox GL JS (via react-map-gl)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Data:** Static JSON files, scored client-side at load time

### Architecture: Monolith SPA
No backend, no API layer, no database at runtime. All facility and regulatory data ships as static JSON in the build. Scoring and filtering happen client-side. The app deploys as a `dist/` folder — hostable on Vercel, Netlify, S3, or opened locally.

This is appropriate because:
- Dataset is bounded (~1,000–2,000 facilities across 3 regions)
- No multi-user collaboration or auth required
- Data updates are infrequent (research-driven, not real-time)
- Deployment simplicity matters for a hackathon deadline

### Project Structure

```
SolarReq/
├── public/
│   └── favicon.svg
├── src/
│   ├── data/
│   │   ├── facilities/
│   │   │   ├── us.json
│   │   │   ├── canada.json
│   │   │   └── eu.json
│   │   ├── regulatory/
│   │   │   ├── us.json
│   │   │   ├── canada.json
│   │   │   └── eu.json
│   │   └── meta/
│   │       └── sources.json
│   ├── scoring/
│   │   ├── coolingFit.js
│   │   └── marketTier.js
│   ├── components/
│   │   ├── Map/
│   │   │   ├── MapContainer.jsx
│   │   │   ├── FacilityMarkers.jsx
│   │   │   ├── ChoroplethLayer.jsx
│   │   │   └── MapLegend.jsx
│   │   ├── Panels/
│   │   │   ├── FacilityPanel.jsx
│   │   │   ├── RegionPanel.jsx
│   │   │   ├── RegulatoryCard.jsx
│   │   │   └── MarketSummary.jsx
│   │   ├── Filters/
│   │   │   ├── FilterSidebar.jsx
│   │   │   └── FilterChips.jsx
│   │   └── Dashboard/
│   │       ├── TamSamSom.jsx
│   │       ├── RegionBreakdown.jsx
│   │       └── CoolingFitDistribution.jsx
│   ├── hooks/
│   │   ├── useFilters.js
│   │   └── useFacilities.js
│   ├── utils/
│   │   └── formatters.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── scripts/
│   └── validate-data.js
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

### State Management
React context + hooks only. No Redux, no Zustand. `useFilters` manages all filter dimensions and returns the filtered facility list. Every component reads from this single source.

---

## 4. Data Model

### Facility Record

```json
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
  "pue": 1.45,
  "pue_source": "2024 Sustainability Report",
  "pue_source_url": "https://...",
  "cooling_method": "air_cooled",
  "cooling_fit_score": 82,
  "market_tier": "sam",
  "regulatory_zone": "us-va",
  "source": "PeeringDB",
  "source_url": "https://...",
  "source_date": "2025-11-15",
  "last_verified": "2026-04-03",
  "confidence_tier": "verified",
  "notes": "",
  "data_gaps": ["pue"]
}
```

**Field constraints:**
- `status`: `operational` | `under_construction` | `planned` | `announced`
- `facility_type`: `colocation` | `enterprise` | `hyperscale` | `edge` | `government` | `ai_factory`
- `cooling_method`: `air_cooled` | `liquid_cooled` | `immersion` | `hybrid` | `evaporative` | `unknown`
- `market_tier`: `tam` | `sam` | `som` (computed at load time by `marketTier.js`)
- `cooling_fit_score`: 0–100 (computed at load time by `coolingFit.js`)
- `confidence_tier`: `verified` (primary source with URL) | `reported` (secondary source) | `unconfirmed` (single unverifiable source)
- Required fields: `id`, `company`, `lat`, `lng`, `country`, `source`, `source_date`
- Unknown/unavailable fields are `null` and listed in `data_gaps[]`

### Regulatory Record

```json
{
  "zone_id": "us-va",
  "country": "US",
  "region": "Virginia",
  "regulatory_complexity_score": 67,
  "regulations": [
    {
      "category": "energy_efficiency",
      "name": "Virginia Clean Economy Act (VCEA)",
      "level": "state",
      "summary": "Requires 100% carbon-free electricity by 2045. Data centers >25MW must source renewable energy.",
      "url": "https://law.lis.virginia.gov/vacode/title56/...",
      "effective_date": "2020-04-12",
      "relevance": "Affects energy sourcing for cooling systems"
    }
  ]
}
```

**Field constraints:**
- `category`: `energy_efficiency` | `water_use` | `environmental` | `safety` | `building_code` | `tax_incentive`
- `level`: `federal` | `state_provincial` | `local` | `agency`
- `url`: Required — every regulation must link to source legislation
- `regulatory_complexity_score`: 0–100, higher = more complex regulatory environment

---

## 5. Cooling-Fit Scoring

Deterministic formula — no LLM, no estimation. Pure function: facility object in, score out.

| Factor | Weight | Scoring Logic |
|--------|--------|---------------|
| PUE | 30% | 1.04–1.20 = 100, 1.20–1.40 = 60, >1.40 = 30, unknown = 40 |
| Capacity | 25% | ≤10MW = 100, 10–20MW = 50, >20MW = 10 |
| Cooling method | 20% | air_cooled = 100, evaporative = 70, hybrid = 40, liquid/immersion = 10, unknown = 60 |
| Facility type | 15% | ai_factory = 100, colocation = 80, enterprise = 70, hyperscale = 40, edge = 30 |
| Status | 10% | planned/announced = 100, under_construction = 80, operational = 60 |

**Score interpretation:**
- 70–100: High fit (SOM candidates)
- 40–69: Moderate fit (SAM, worth monitoring)
- 0–39: Low fit (TAM only)

Higher score = better fit for Solar Steam's products. The formula rewards: efficient but air-cooled facilities, sub-10MW capacity, future-facing facility types, and greenfield opportunities.

---

## 6. UI Design

### Visual Language
Google Maps-inspired: light canvas (`#f8f9fa`), white cards with `#dadce0` borders, pill-shaped filter controls, soft blues (`#1a73e8`) and greens (`#34a853`) for data, system font stack. Clean, professional, presentation-ready.

### Layout: Sidebar + Full Map
- **Left sidebar** (fixed, ~280px): Branding, filter controls, preset buttons, TAM/SAM/SOM funnel chart, region breakdown chart, cooling method distribution chart
- **Map area** (remaining viewport): Mapbox GL with clustered markers color-coded by market tier, choropleth layer for opportunity density, legend
- **Right slide-in panel** (~300px, contextual): Opens on marker click (FacilityPanel) or region click (RegionPanel). Closes with ✕.

### Facility Panel (Compact Card)
- Market tier badge (TAM/SAM/SOM)
- Facility name, company, type
- 2×2 metric grid: Capacity (MW), PUE, Cooling Fit Score, Cooling Method
- Address, operational status
- Source and verification date

### Regulatory Panel
- Country/region name + regulatory complexity score
- Category filter tabs: Energy Efficiency, Water Use, Environmental, Safety, Building Code, Tax Incentive
- Regulation cards: name, level badge, summary, **hyperlinked URL to source legislation**, effective date, relevance to cooling deployment

### Filter System

| Filter | Control | Values |
|--------|---------|--------|
| Country | Multi-select checkboxes | US, Canada, EU (expandable) |
| Region/State | Searchable dropdown | Dynamic based on country |
| Status | Toggle chips | Operational, Under Construction, Planned, Announced |
| Facility Type | Multi-select checkboxes | Colocation, Enterprise, Hyperscale, Edge, Government, AI Factory |
| Capacity (MW) | Range slider | 0–50+ (≤10MW highlighted) |
| PUE | Range slider | 1.0–2.0+ (1.04–1.20 primary zone) |
| Cooling Method | Multi-select checkboxes | Air Cooled, Liquid, Immersion, Hybrid, Evaporative, Unknown |
| Cooling Fit Score | Range slider | 0–100 |
| Market Tier | Toggle chips | TAM, SAM, SOM |

**Behavior:** Filters are AND-combined. Active filters show as removable chips. Facility count updates live. Map markers and all charts update reactively. "Reset All" button clears everything.

**Preset quick-views:**
- **"Solar Steam Targets"** — ≤10MW, PUE 1.04–1.20, operational
- **"Competitive Landscape"** — PUE 1.04–1.20, liquid/immersion/hybrid cooling
- **"Greenfield Opportunities"** — planned/announced/under_construction, ≤10MW

### Dashboard Charts (Sidebar)
1. **TAM/SAM/SOM Funnel** — Nested bar or donut, facility counts per tier, updates with filters
2. **Region Breakdown** — Horizontal bars per country, clickable to zoom map + open RegionPanel
3. **Cooling Method Distribution** — Bar chart of cooling methods across filtered set

All charts built with Recharts.

---

## 7. Data Sourcing & Research Plan

### Facility Data Sources

| Source | Coverage | Provides |
|--------|----------|----------|
| PeeringDB API | Global | Facility name, company, location, type |
| Government energy/infrastructure databases | US, CA, EU | Capacity, permits, planned facilities |
| Operator sustainability reports | Major operators | PUE, cooling method, efficiency targets |
| datacentermap.com | Global | Locations, basic specs |
| Baxtel | Global | Facility details, capacity |
| State/provincial permit filings | US, CA | Planned/announced facilities, capacity |
| EU Energy Efficiency Directive reports | EU | PUE reporting (mandatory for EU DCs >500kW since 2024) |

### Regulatory Data Sources

| Level | US | Canada | EU |
|-------|-----|--------|-----|
| Federal/National | DOE, EPA, FERC | NRCan, ECCC, CSA | EU EED, EPBD, Taxonomy Regulation |
| State/Provincial | State energy commissions, DEQs | Provincial energy boards, MOE | Member state transpositions |
| Local/Agency | County permits, utility requirements | Municipal bylaws | Regional authorities |

Every regulatory entry must include a direct hyperlink to the source legislation or regulation document.

### Data Quality Rules
- Every facility must have: `company`, `lat`, `lng`, `country`, `source`, `source_date`
- PUE: only from published reports or mandatory disclosures — never estimated
- Capacity: from permits, operator disclosures, or infrastructure databases — never estimated
- Unknown fields are explicitly `null` and listed in `data_gaps[]`
- `confidence_tier` tracks source reliability: `verified` | `reported` | `unconfirmed`

### Research Execution
Data collection happens in `scripts/` — one script per source, outputting to the facility/regulatory JSON schema. A `validate-data.js` script checks data integrity before each build:
- Required fields present
- Coordinates within valid ranges
- Enum values match allowed sets
- No duplicate IDs
- Source URLs are non-empty for `verified` tier entries

---

## 8. Geographic Priority

1. **Primary:** Canada, European Union, United States
2. **Expansion:** Additional global markets after primary regions are exhausted

Within primary regions, prioritize by data center density: Virginia (US), Texas (US), Ontario (CA), Quebec (CA), Frankfurt region (DE), Amsterdam (NL), Dublin (IE), London (UK), Nordics.

---

## 9. Map Layers

- **Marker layer:** Clustered facility markers, color-coded by market tier (green = SOM, amber = SAM, red = TAM). Cluster bubbles show count. Zoom to expand.
- **Choropleth layer:** Country/state/province fill colored by opportunity density (facility count × average cooling-fit score in that zone). Clickable to open RegionPanel.
- **Legend:** Persistent bottom-left corner showing marker colors, choropleth scale, and active layer toggles.

---

## 10. Assumptions & Constraints

- **Mapbox GL free tier** covers this use case (50,000 map loads/month)
- Dataset size will be ~1,000–2,000 facilities — client-side filtering is performant at this scale
- PUE data availability varies significantly by operator — many facilities will have `null` PUE with `"pue"` in `data_gaps[]`
- EU regulatory landscape is complex (27 member states × multiple levels) — April 7 delivery will prioritize top DC markets (Germany, Netherlands, Ireland, Nordics, France) with remaining countries added post-hackathon
- Regulatory research is manual — no API for legislation. URLs must be verified by hand.
- The app ships as a static build. Data updates require re-running collection scripts and rebuilding.
