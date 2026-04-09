---
name: PUE data sources
description: Best sources for per-site verified PUE data from major DC operators -- Google publishes per-campus quarterly, others publish fleet averages only
type: reference
---

## Operators That Publish Per-Site PUE

- **Google**: Per-campus quarterly + TTM PUE at https://datacenters.google/efficiency/ -- BEST SOURCE, 30+ sites with individual PUE values (Q4 2025 data available). Range: 1.04 (Lancaster OH) to 1.14 (Singapore).
- **NREL ESIF**: Single facility, PUE 1.036 (annualized). Source: DOE Better Buildings Initiative.
- **EcoDataCenter**: Publishes immersion zone PUE 1.03, facility-level <1.15. Falun, Sweden.
- **Lefdal Mine**: PUE 1.08-1.15 depending on config. Source: lefdalmine.com/data-center/cooling
- **DigiPlex/STACK**: PUE 1.1 at Fetsund. Source: datacenter catalog.

## Operators That Publish Fleet Averages Only (No Per-Site)

- **Meta**: Fleet PUE 1.08 (2024). Does NOT publish per-site. Source: sustainability.atmeta.com
- **Microsoft**: Regional averages (Americas 1.16, EMEA 1.16, APAC 1.25). Best site: Wyoming 1.11. Source: datacenters.microsoft.com/sustainability/efficiency/
- **AWS**: Global 1.15. Best by region: Europe 1.04, Americas 1.05, APAC 1.07. Does NOT name specific sites. Source: sustainability.aboutamazon.com
- **Equinix**: Fleet average 1.39 (poor). AM11 Amsterdam = 1.1 (exception). Source: Equinix sustainability data summary PDF.

## China Operators

- **Alibaba Cloud**: Hangzhou Qianhu PUE 1.09 (immersion cooled, self-reported)
- **Baidu**: Yangquan PUE 1.09 (self-reported via IDCNova)
- **Chindata**: Lingqiu campus PUE 1.13 (hybrid liquid), Solution 2.0 PUE 1.10 (full immersion)
- **GDS**: Shanghai complex PUE 1.12 (industry reports, not prominently self-published)

## Japan/Asia

- **KDDI**: Container immersion DC PUE 1.05-1.07 (Gigabyte partnership)
- **Nebius (Finland)**: PUE 1.1 at high loads, 1.13 at full capacity (Mantsala)

## EU EED Database (Mandatory Reporting)

- EU-wide average PUE: 1.36 (first report July 2025). Country range: 1.15-1.66.
- Only 36% participation so far. No individual facility data published yet.
- Future source: energy.ec.europa.eu/topics/energy-efficiency/.../energy-performance-data-centres

## Operators That Do NOT Publish Meaningful PUE

- Apple, Oracle, QTS, DataBank, Iron Mountain, CyrusOne, Compass, TierPoint, Flexential -- either no disclosure or only vague targets
