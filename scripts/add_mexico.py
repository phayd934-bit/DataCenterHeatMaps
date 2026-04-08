import json

with open('src/data/facilities/eu.json', encoding='utf-8') as f:
    eu = json.load(f)

existing = {fac['facility_name'].lower() for fac in eu}
max_id = max(int(fac['id'].split('-')[1]) for fac in eu)

new_facilities = [
    # KIO Networks - Mexico's largest DC operator
    {"facility_name": "KIO Networks MEX1 Santa Fe", "company": "KIO Networks", "lat": 19.36, "lng": -99.27, "country": "MX", "region": "Mexico City", "city": "Mexico City", "status": "operational", "facility_type": "colocation", "capacity_mw": 3.2, "pue": 1.7, "cooling_method": "air_cooled", "gpu": None, "source": "KIO Networks", "source_url": "https://kiodatacenters.com/en/", "notes": "Santa Fe campus. PUE 1.7 design (cold aisle containment)."},
    {"facility_name": "KIO Networks MEX2 Santa Fe", "company": "KIO Networks", "lat": 19.36, "lng": -99.27, "country": "MX", "region": "Mexico City", "city": "Mexico City", "status": "operational", "facility_type": "colocation", "capacity_mw": 5, "pue": None, "cooling_method": "air_cooled", "gpu": None, "source": "datacentermap.com", "source_url": "https://www.datacentermap.com/c/castle-access/", "notes": "5MW. N+2 cooling. Two 600sqm computer rooms."},
    {"facility_name": "KIO Networks QRO2 Queretaro", "company": "KIO Networks", "lat": 20.59, "lng": -100.39, "country": "MX", "region": "Queretaro", "city": "Queretaro", "status": "operational", "facility_type": "colocation", "capacity_mw": 19, "pue": None, "cooling_method": "air_cooled", "gpu": None, "source": "KIO Networks", "source_url": "https://kiodatacenters.com/en/", "notes": "~19MW total Queretaro capacity."},
    {"facility_name": "KIO Networks MEX8 Mexico City", "company": "KIO Networks", "lat": 19.36, "lng": -99.27, "country": "MX", "region": "Mexico City", "city": "Mexico City", "status": "under_construction", "facility_type": "colocation", "capacity_mw": 4, "pue": None, "cooling_method": "air_cooled", "gpu": None, "source": "KIO Networks", "source_url": "https://kiodatacenters.com/en/", "notes": "4MW new build. Under construction."},
    # Equinix Mexico
    {"facility_name": "Equinix MX1 Queretaro", "company": "Equinix", "lat": 20.59, "lng": -100.39, "country": "MX", "region": "Queretaro", "city": "Queretaro", "status": "operational", "facility_type": "colocation", "capacity_mw": None, "pue": None, "cooling_method": "liquid_cooled", "gpu": "NVIDIA DGX-Ready", "source": "Equinix", "source_url": "https://www.equinix.com/data-centers/americas-colocation/mexico-colocation/mexico-city-data-centers/mx1", "notes": "Water-cooled chiller plant + DX CRAC. 2N redundancy."},
    {"facility_name": "Equinix MX2 Queretaro", "company": "Equinix", "lat": 20.59, "lng": -100.39, "country": "MX", "region": "Queretaro", "city": "Queretaro", "status": "operational", "facility_type": "colocation", "capacity_mw": None, "pue": None, "cooling_method": "air_cooled", "gpu": "NVIDIA DGX-Ready", "source": "Equinix", "source_url": "https://www.equinix.com/data-centers/americas-colocation/mexico-colocation", "notes": "Air-cooled chillers + CRAC/CRAH. 5.5kVA/cabinet. N+1 cooling."},
    # Ascenty (Digital Realty) - Mexico
    {"facility_name": "Ascenty MEX1 Queretaro", "company": "Ascenty (Digital Realty)", "lat": 20.59, "lng": -100.39, "country": "MX", "region": "Queretaro", "city": "Queretaro", "status": "operational", "facility_type": "hyperscale", "capacity_mw": 21, "pue": None, "cooling_method": "air_cooled", "gpu": None, "source": "Ascenty", "source_url": "https://ascenty.com/en/data-centers-en/location/mexico/queretaro-3/", "notes": "21MW. Tier III. Tri-bus distribution."},
    {"facility_name": "Ascenty MEX2 Queretaro", "company": "Ascenty (Digital Realty)", "lat": 20.59, "lng": -100.39, "country": "MX", "region": "Queretaro", "city": "Queretaro", "status": "operational", "facility_type": "hyperscale", "capacity_mw": 31, "pue": None, "cooling_method": "air_cooled", "gpu": None, "source": "Ascenty", "source_url": "https://ascenty.com/en/data-centers-en/location/mexico/mexico-2/", "notes": "31MW. Tier III."},
    {"facility_name": "Ascenty MEX3 Queretaro", "company": "Ascenty (Digital Realty)", "lat": 20.59, "lng": -100.39, "country": "MX", "region": "Queretaro", "city": "Queretaro", "status": "operational", "facility_type": "hyperscale", "capacity_mw": 25, "pue": None, "cooling_method": "air_cooled", "gpu": None, "source": "datacentermap.com", "source_url": "https://www.datacentermap.com/mexico/queretaro/ascenty-queretaro-qro3/", "notes": "25MW. Tier III."},
    # ODATA (Aligned Data Centers) - Mexico's largest campus
    {"facility_name": "ODATA QR03 Queretaro -- 300MW Campus", "company": "ODATA / Aligned Data Centers", "lat": 20.59, "lng": -100.39, "country": "MX", "region": "Queretaro", "city": "Queretaro", "status": "operational", "facility_type": "hyperscale", "capacity_mw": 300, "pue": None, "cooling_method": "hybrid", "gpu": None, "source": "DCD", "source_url": "https://www.datacenterdynamics.com/en/news/odata-launches-first-phase-of-300mw-mexican-data-center/", "notes": "300MW total (72MW Phase 1). Delta Cube air cooling + liquid cooling ready. $3B investment. 5 buildings, 275k sqm."},
    # Triara / Telmex / America Movil
    {"facility_name": "Triara Queretaro (Telmex)", "company": "Telmex / America Movil", "lat": 20.59, "lng": -100.39, "country": "MX", "region": "Queretaro", "city": "Queretaro", "status": "operational", "facility_type": "enterprise", "capacity_mw": 37.5, "pue": None, "cooling_method": "air_cooled", "gpu": None, "source": "Global EI", "source_url": "https://www.globalei.com/triara-data-center-mexico-the-largest-in-latin-america/", "notes": "37.5MW. 90416 sqft. $160M USD. ICREA Level 5 HSHA certified."},
    # EdgeConneX Monterrey
    {"facility_name": "EdgeConneX Monterrey Campus", "company": "EdgeConneX", "lat": 25.67, "lng": -100.31, "country": "MX", "region": "Nuevo Leon", "city": "Monterrey", "status": "planned", "facility_type": "colocation", "capacity_mw": 50, "pue": None, "cooling_method": "hybrid", "gpu": None, "source": "EdgeConneX", "source_url": "https://www.edgeconnex.com/", "notes": "50MW edge+core campus. 5MW edge sheds for OTT caching. Land secured."},
    # Vertiv Manufacturing (liquid cooling supply chain)
    {"facility_name": "Vertiv Mexico Manufacturing -- AI Liquid Cooling CDUs", "company": "Vertiv", "lat": 25.42, "lng": -100.99, "country": "MX", "region": "Nuevo Leon", "city": "Monterrey", "status": "operational", "facility_type": "enterprise", "capacity_mw": None, "pue": None, "cooling_method": "liquid_cooled", "gpu": None, "source": "Vertiv", "source_url": "https://portersfiveforce.com/blogs/growth-strategy/vertiv", "notes": "Manufacturing facility for AI liquid cooling CDUs and rear-door heat exchangers. Supply chain node, not colocation."},
]

added = 0
for fac in new_facilities:
    if fac['facility_name'].lower() in existing:
        print(f"SKIP: {fac['facility_name']}")
        continue
    max_id += 1
    fac['id'] = f'eu-{max_id:03d}'
    fac['regulatory_zone'] = None
    fac['address'] = f"{fac['city']}, {fac['region']}, Mexico"
    fac['confidence_tier'] = 'verified'
    fac['source_date'] = '2026-04'
    fac['last_verified'] = '2026-04-06'
    fac['data_gaps'] = [k for k in ['pue', 'capacity_mw', 'gpu'] if fac.get(k) is None]
    eu.append(fac)
    existing.add(fac['facility_name'].lower())
    added += 1
    print(f"ADDED: {fac['id']} | {fac['facility_name']} | {fac.get('capacity_mw')}MW | {fac['status']}")

with open('src/data/facilities/eu.json', 'w', encoding='utf-8') as f:
    json.dump(eu, f, indent=2, ensure_ascii=False)

print(f"\nAdded: {added} | Total EU/Global: {len(eu)}")
