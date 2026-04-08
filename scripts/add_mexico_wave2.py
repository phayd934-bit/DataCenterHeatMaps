import json

with open('src/data/facilities/eu.json', encoding='utf-8') as f:
    eu = json.load(f)

existing = {fac['facility_name'].lower() for fac in eu}
max_id = max(int(fac['id'].split('-')[1]) for fac in eu)

new_facilities = [
    # KIO Networks - additional facilities from agent
    {"facility_name": "KIO Networks QRO1 Queretaro", "company": "KIO Networks", "lat": 20.59, "lng": -100.39, "country": "MX", "region": "Queretaro", "city": "Queretaro", "status": "operational", "facility_type": "colocation", "capacity_mw": 2.5, "pue": 1.7, "cooling_method": "air_cooled", "gpu": None, "source": "Baxtel", "source_url": "https://baxtel.com/data-center/kio-queretaro-qro1", "notes": "2.5MW. KIO Green indirect free cooling. Design PUE 1.7. Since 2007."},
    {"facility_name": "KIO Networks MEX4 Interlomas", "company": "KIO Networks", "lat": 19.39, "lng": -99.29, "country": "MX", "region": "Mexico City", "city": "Mexico City", "status": "operational", "facility_type": "colocation", "capacity_mw": 0.86, "pue": None, "cooling_method": "air_cooled", "gpu": None, "source": "datacenters.com", "source_url": "https://www.datacenters.com/kio-networks-kio-interlomas-mex-4", "notes": "861kW. Tier III. Since 2014."},
    {"facility_name": "KIO Networks MEX5 Tultitlan", "company": "KIO Networks", "lat": 19.64, "lng": -99.17, "country": "MX", "region": "Estado de Mexico", "city": "Tultitlan", "status": "operational", "facility_type": "colocation", "capacity_mw": 2.2, "pue": None, "cooling_method": "air_cooled", "gpu": None, "source": "datacenters.com", "source_url": "https://www.datacenters.com/kio-networks-kio-tultitlan-mex-5", "notes": "2.2MW. Tier III."},
    {"facility_name": "KIO Networks MEX6 Toluca", "company": "KIO Networks", "lat": 19.29, "lng": -99.65, "country": "MX", "region": "Estado de Mexico", "city": "Toluca", "status": "operational", "facility_type": "colocation", "capacity_mw": 2.2, "pue": None, "cooling_method": "air_cooled", "gpu": None, "source": "Baxtel", "source_url": "https://baxtel.com/data-center/kio-mex6", "notes": "2.2MW. Tier III. Since 2008."},
    {"facility_name": "KIO Networks MTY1 Monterrey", "company": "KIO Networks", "lat": 25.67, "lng": -100.31, "country": "MX", "region": "Nuevo Leon", "city": "Monterrey", "status": "operational", "facility_type": "colocation", "capacity_mw": None, "pue": None, "cooling_method": "air_cooled", "gpu": None, "source": "datacenters.com", "source_url": "https://www.datacenters.com/kio-networks-kio-monterrey-mty1", "notes": "Four 600sqm halls. Tier III."},
    # Equinix expansion with liquid cooling
    {"facility_name": "Equinix MX3x Queretaro -- Under Construction", "company": "Equinix", "lat": 20.59, "lng": -100.39, "country": "MX", "region": "Queretaro", "city": "Queretaro", "status": "under_construction", "facility_type": "colocation", "capacity_mw": 14, "pue": None, "cooling_method": "liquid_cooled", "gpu": "NVIDIA DGX-Ready", "source": "datacenterHawk", "source_url": "https://datacenterhawk.com/marketplace/providers/equinix/vesta-park/mx3x", "notes": "7.5MW Phase 1 scaling to 14MW. $140M investment. $400M liquid-cooled expansion announced Mar 2025."},
    # ODATA QR01, QR02, QR04
    {"facility_name": "ODATA QR01 Queretaro", "company": "ODATA / Aligned Data Centers", "lat": 20.59, "lng": -100.39, "country": "MX", "region": "Queretaro", "city": "Queretaro", "status": "operational", "facility_type": "hyperscale", "capacity_mw": 32, "pue": None, "cooling_method": "air_cooled", "gpu": None, "source": "datacentermap.com", "source_url": "https://www.datacentermap.com/mexico/queretaro/aligned-qr-01/", "notes": "32MW total (8.4MW Phase 1). VYNMSA Industrial Park. Since 2022."},
    {"facility_name": "ODATA QR02 Queretaro", "company": "ODATA / Aligned Data Centers", "lat": 20.59, "lng": -100.39, "country": "MX", "region": "Queretaro", "city": "Queretaro", "status": "operational", "facility_type": "hyperscale", "capacity_mw": 30, "pue": None, "cooling_method": "air_cooled", "gpu": None, "source": "datacentermap.com", "source_url": "https://www.datacentermap.com/mexico/queretaro/aligned-qr-02/", "notes": "30MW. Amexhe Industrial Park. Q2 2024."},
    {"facility_name": "ODATA QR04 Guanajuato", "company": "ODATA / Aligned Data Centers", "lat": 20.92, "lng": -101.39, "country": "MX", "region": "Guanajuato", "city": "Guanajuato", "status": "operational", "facility_type": "hyperscale", "capacity_mw": 24, "pue": None, "cooling_method": "hybrid", "gpu": None, "source": "ODATA", "source_url": "https://odatacolocation.com/en/blog/imprensa/odata-expands-digital-infrastructure-with-fourth-hyperscale-data-center-in-mexico/", "notes": "24MW (12MW Phase 1). Delta Cube air + closed-loop water. Liquid-ready. 50kW/rack."},
    # CloudHQ mega campus
    {"facility_name": "CloudHQ QRO Campus Queretaro -- 900MW", "company": "CloudHQ", "lat": 20.59, "lng": -100.39, "country": "MX", "region": "Queretaro", "city": "Queretaro", "status": "under_construction", "facility_type": "hyperscale", "capacity_mw": 900, "pue": None, "cooling_method": "air_cooled", "gpu": None, "source": "Mexico News Daily", "source_url": "https://mexiconewsdaily.com/business/cloudhq-4b-queretaro-data-centers/", "notes": "900MW planned. 52 hectares. $4.8B. 200MW power secured. Waterless cooling. LEED Gold. Operations ~2027."},
    # Scala
    {"facility_name": "Scala SMEXTP01 Tepotzotlan", "company": "Scala Data Centers", "lat": 19.72, "lng": -99.22, "country": "MX", "region": "Estado de Mexico", "city": "Tepotzotlan", "status": "operational", "facility_type": "hyperscale", "capacity_mw": 7.9, "pue": 1.4, "cooling_method": "air_cooled", "gpu": None, "source": "Scala", "source_url": "https://scaladatacenters.com/en/scala-data-centers-invests-us-80-million-in-the-first-hyperscale-data-center-in-tepotzotlan-mexico/", "notes": "7.9MW. PUE <1.4. WUE zero (no water for cooling). $80M. Since Q4 2023."},
    # HostDime
    {"facility_name": "HostDime Mexico 2 Guadalajara", "company": "HostDime", "lat": 20.67, "lng": -103.35, "country": "MX", "region": "Jalisco", "city": "Guadalajara", "status": "operational", "facility_type": "colocation", "capacity_mw": 6, "pue": 1.3, "cooling_method": "air_cooled", "gpu": None, "source": "HostDime", "source_url": "https://www.hostdime.com/mexico-data-center-tier-iv", "notes": "6MW (3MW IT). PUE 1.3 target. Tier IV design. 3N Trane chillers. 20kW/rack."},
    # Fermaca
    {"facility_name": "Fermaca Digital City Durango -- 250MW", "company": "Fermaca Networks", "lat": 24.02, "lng": -104.67, "country": "MX", "region": "Durango", "city": "Durango", "status": "planned", "facility_type": "hyperscale", "capacity_mw": 250, "pue": None, "cooling_method": "unknown", "gpu": None, "source": "DCD", "source_url": "https://www.datacenterdynamics.com/en/news/250mw-natural-gas-powered-data-center-campus-announced-in-durango-mexico/", "notes": "250MW. 350MW nat gas plant. 160km pipeline. $2.7-3.7B. Fully operational 2028."},
    # Layer 9
    {"facility_name": "Layer 9 Project Falcon Celaya", "company": "Layer 9 Data Centers", "lat": 20.52, "lng": -100.81, "country": "MX", "region": "Guanajuato", "city": "Celaya", "status": "operational", "facility_type": "hyperscale", "capacity_mw": 96, "pue": None, "cooling_method": "air_cooled", "gpu": None, "source": "Layer 9", "source_url": "https://layer9dc.com/", "notes": "96MW. 3 Tier III buildings. Non-water consuming cooling. CFD-optimized."},
    # Triara Monterrey
    {"facility_name": "Triara Monterrey (Telmex)", "company": "Telmex / America Movil", "lat": 25.78, "lng": -100.19, "country": "MX", "region": "Nuevo Leon", "city": "Apodaca", "status": "operational", "facility_type": "enterprise", "capacity_mw": None, "pue": None, "cooling_method": "air_cooled", "gpu": None, "source": "datacentermap.com", "source_url": "https://www.datacentermap.com/mexico/monterrey/triara-monterrey/", "notes": "Chilled-water + free-cooling. Oracle Cloud Monterrey Region host."},
    # Cirion
    {"facility_name": "Cirion MEX1 Mexico City", "company": "Cirion Technologies", "lat": 19.43, "lng": -99.2, "country": "MX", "region": "Mexico City", "city": "Mexico City", "status": "operational", "facility_type": "colocation", "capacity_mw": 1.6, "pue": None, "cooling_method": "air_cooled", "gpu": None, "source": "datacenters.com", "source_url": "https://www.datacenters.com/cirion-technologies-mex1", "notes": "1.6MW. Lago Zurich 96. N+1 cooling."},
    # MTP
    {"facility_name": "MTP Santa Fe Mexico City", "company": "Mexico Telecom Partners", "lat": 19.36, "lng": -99.27, "country": "MX", "region": "Mexico City", "city": "Mexico City", "status": "operational", "facility_type": "colocation", "capacity_mw": 2.7, "pue": 1.5, "cooling_method": "air_cooled", "gpu": None, "source": "Vertiv", "source_url": "https://www.vertiv.com/en-latam/about/news-and-insights/articles/case-studies/mtp-desarrolla-data-center-de-2.7-mw-en-un-espacio-exclusivo-en-mexico-con-soluciones-vertiv/", "notes": "2.7MW. PUE 1.5. Precision cooling + indirect free cooling."},
    # MetroCarrier
    {"facility_name": "MetroCarrier Guadalajara (Megacable)", "company": "MetroCarrier / Megacable", "lat": 20.63, "lng": -103.29, "country": "MX", "region": "Jalisco", "city": "Guadalajara", "status": "operational", "facility_type": "colocation", "capacity_mw": 9, "pue": None, "cooling_method": "air_cooled", "gpu": None, "source": "datacentermap.com", "source_url": "https://www.datacentermap.com/mexico/guadalajara/mega-data-center/", "notes": "9MW. Tier III. ICREA IV. 1600 racks. 2300sqm white space."},
    # Nabiax
    {"facility_name": "Nabiax Ixtlahuaca", "company": "Nabiax", "lat": 19.57, "lng": -99.77, "country": "MX", "region": "Estado de Mexico", "city": "Ixtlahuaca", "status": "operational", "facility_type": "colocation", "capacity_mw": 2.2, "pue": None, "cooling_method": "air_cooled", "gpu": None, "source": "Nabiax", "source_url": "https://nabiax.com/en/our-data-centers/mexico/ixtlahuaca/", "notes": "2.2MW scalable to 6.2MW. Tier III. Carrier-neutral. Green energy."},
    # MDC
    {"facility_name": "MDC QRO Queretaro", "company": "MDC Data Centers", "lat": 20.59, "lng": -100.39, "country": "MX", "region": "Queretaro", "city": "Queretaro", "status": "under_construction", "facility_type": "colocation", "capacity_mw": 2, "pue": None, "cooling_method": "unknown", "gpu": None, "source": "MDC", "source_url": "https://www.mdcdatacenters.com/company/blog/mdc-data-centers-enters-mexico-with-new-queretaro-cross-border/", "notes": "2MW initial. 10000 sqft. Cross-border interconnection. Operations early 2026."},
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
    print(f"ADDED: {fac['id']} | {fac['facility_name']} | {fac.get('capacity_mw')}MW | PUE={fac.get('pue')} | {fac['cooling_method']}")

with open('src/data/facilities/eu.json', 'w', encoding='utf-8') as f:
    json.dump(eu, f, indent=2, ensure_ascii=False)

print(f"\nAdded: {added} | Total EU/Global: {len(eu)}")
