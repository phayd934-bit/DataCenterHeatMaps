---
name: High-Quality Source Patterns for US Data Center Research
description: Reliable source types, publishers, and URL patterns for verifying US data center facility and regulatory data
type: reference
---

## Tier 1 — Primary Sources (highest confidence)
- **Operator facility pages**: digitalrealty.com/data-centers/*, equinix.com/data-centers/*, flexential.com/data-centers/*, edged.us/chicago, aligneddc.com/phoenix-data-centers/
- **IR press releases**: ir.applieddigital.com, investors.coreweave.com — precise MW, PUE, cooling specs
- **Official sustainability PDFs**: Equinix 2023/2024 Sustainability Report (sustainability.equinix.com), CyrusOne 2024 Sustainability Report (cyrusone.com/hubfs/...), Iron Mountain IMDC Sustainability Performance Overview (s204.q4cdn.com)
- **State legislation**: law.lis.virginia.gov, ilga.gov, leginfo.legislature.ca.gov, olis.oregonlegislature.gov
- **State agency pages**: vedp.org, dceo.illinois.gov, energy.ca.gov, puc.texas.gov, tceq.texas.gov

## Tier 2 — Reliable Industry Sources
- **DatacenterDynamics** (datacenterdynamics.com): Best trade publication for announcements, facility launches, operator news. Often 403 on fetch — use search snippets instead.
- **Data Center Frontier** (datacenterfrontier.com): Good technical tours and in-depth facility profiles. Often publicly accessible for fetch.
- **Baxtel** (baxtel.com): Facility directory with specs, addresses, power capacity. Good starting point; verify against primary.
- **DatacenterMap** (datacentermap.com): MW capacity, address, basic specs. Reliable for operational facilities.
- **DatacenterKnowledge**: Historical coverage good; recent articles can be gated.
- **PeeringDB** (peeringdb.com): Networking-focused; useful for address/operator confirmation.

## Tier 3 — Aggregators (use for discovery, verify against primary)
- datacenters.com, baxtel.com, ocolo.io, inflect.com, datacenterHawk, upstack.com/marketplace
- Good for finding addresses and capacity; PUE values often unverified or outdated

## Anti-patterns to avoid
- Aggregator PUE without citing primary source
- Claiming Equinix portfolio PUE (1.39 global avg 2024) as a specific facility PUE
- Using DatacenterMap MW values without cross-referencing operator page
- Citing Wikipedia for operational specs

## Useful search patterns
- `"[operator] [city] data center" site:baxtel.com` — gets clean specs
- `"[operator] [facility code]" filetype:pdf` — finds spec sheets
- `[operator name] 2024 sustainability report PUE` — gets ESG reports
- `"[facility name]" site:datacentermap.com` — gets MW and address
