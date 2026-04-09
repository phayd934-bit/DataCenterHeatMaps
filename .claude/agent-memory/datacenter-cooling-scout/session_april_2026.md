---
name: Facility Research Session — April 2026 (US)
description: Summary of 25-record US facility dataset written during April 3 2026 session
type: project
---

## Session Output
- **File**: `src/data/facilities/us.json` — 25 real US facility records
- **File**: `src/data/regulatory/us.json` — 5 regulatory zones (us-va, us-tx, us-ca, us-or, us-il), 26 total regulations

## Key Findings

**PUE-verified facilities (8 total):**
- us-or-001 (Digital Realty PDX10): PUE 1.3 — primary source Baxtel/DR facility page
- us-or-002 (Flexential Hillsboro 3): design PUE 1.3 — primary source flexential.com
- us-or-003 (Opus Interactive Hillsboro): PUE ~1.2 — reported, Uptime Institute Efficient IT certified
- us-il-001 (Edged Energy Aurora ORD01-1): PUE 1.15 portfolio, mPUE 1.086 Chicago — primary source edged.us/chicago
- us-nj-001 (Iron Mountain NJE-1): PUE as low as 1.2 — reported DatacenterMap
- us-az-001 (Aligned Data Centers PHX-01): PUE ≤1.35 — primary source Data Center Frontier tour
- us-nv-001 (Switch SUPERNAP 7): PUE 1.18 full-year — reported Switch press materials (2014 source, may need reverification)
- us-nd-001 (Applied Digital Polaris Forge 1): projected PUE 1.18 — primary source Applied Digital IR press release June 2025

**Liquid cooling verified (7 facilities):**
- us-tx-001: Flexential Plano — liquid-cooled >80 kW/rack for CoreWeave (primary: Flexential PR April 2025)
- us-or-002: Flexential Hillsboro 3 — built-in liquid cooling (primary: facility page)
- us-il-001: Edged Energy Aurora — ThermalWorks up to 400 kW/rack (primary: edged.us/chicago)
- us-ga-001: Flexential Douglasville 1 — liquid cooling (primary: DatacenterMap)
- us-ga-002: Flexential Douglasville 2 — liquid cooling (primary: DatacenterMap)
- us-nj-001: Iron Mountain NJE-1 — liquid cooling confirmed Q4 2025 DCD report
- us-nd-001: Applied Digital Polaris Forge 1 — direct-to-chip closed-loop (primary: Applied Digital IR)
- us-az-001: Aligned PHX-01 — DeltaFlow liquid cooling up to 300 kW/rack (primary: DCF tour)

**Small facilities (≤10 MW):**
- us-va-001: Equinix DC21 — 11.9 MW
- us-tx-004: DataBank DFW4 — 4 MW (expandable to 8 MW)
- us-or-001: Digital Realty PDX10 — 10 MW exactly

## Data Gaps Frequently Encountered
- PUE: Most operators do not publish per-facility PUE; portfolio averages or design targets are available
- Exact street addresses: Some TX and ND facilities use city-only addresses
- CyrusOne PHX1-8: PUE not published per-facility; campus-level metrics only
- CoreSite LA2: No PUE found in public sources

## Why (relevance for future sessions)
Applied Digital and Edged Energy are the strongest US cooling opportunity signals: new-build AI factories with verified liquid cooling, direct-to-chip, PUE 1.15-1.18, waterless systems. These are ideal prospect profiles for a cooling technology vendor. Flexential is the leading colocation partner for CoreWeave liquid cooling deployments.
