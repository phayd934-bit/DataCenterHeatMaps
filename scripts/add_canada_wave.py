import json

with open('src/data/facilities/canada.json', encoding='utf-8') as f:
    canada = json.load(f)

existing_names = {fac['facility_name'].lower() for fac in canada}
max_id = max(int(fac['id'].split('-')[1]) for fac in canada)

new_facilities = [
    {"facility_name": "Beacon AI Heartland Hub -- Strathcona County", "company": "Beacon AI Centers", "lat": 53.47, "lng": -113.22, "country": "CA", "region": "Alberta", "city": "Strathcona County", "status": "announced", "facility_type": "hyperscale", "capacity_mw": 400, "pue": None, "cooling_method": "unknown", "gpu": None, "source": "Alberta Major Projects", "source_url": "https://majorprojects.alberta.ca/details/Beacon-Heartland-Artificial-Intelligence-Hub/11493", "notes": "400MW 920MW power gen on-site. Q4 2028 target."},
    {"facility_name": "Gryphon Digital AI/HPC Campus -- Pincher Creek", "company": "Gryphon Digital Mining", "lat": 49.49, "lng": -114.0, "country": "CA", "region": "Alberta", "city": "Pincher Creek", "status": "planned", "facility_type": "ai_factory", "capacity_mw": 130, "pue": None, "cooling_method": "unknown", "gpu": None, "source": "Alberta Major Projects", "source_url": "https://majorprojects.alberta.ca/details/Gryphon-Digital-Alberta-AI-and-Data-Center/11518", "notes": "850 acres 130MW by end 2026. Plans for 4GW long-term."},
    {"facility_name": "Capital Power Polaris @ Genesee", "company": "Capital Power", "lat": 53.31, "lng": -114.24, "country": "CA", "region": "Alberta", "city": "Genesee", "status": "planned", "facility_type": "hyperscale", "capacity_mw": 1500, "pue": None, "cooling_method": "unknown", "gpu": None, "source": "Capital Power", "source_url": "https://www.capitalpower.com/pgec/", "notes": "1.0-1.5GW campus at Genesee Generating Station. 250MW binding MOU. 2028 target."},
    {"facility_name": "Cologix Calgary CGY1", "company": "Cologix", "lat": 51.05, "lng": -114.07, "country": "CA", "region": "Alberta", "city": "Calgary", "status": "operational", "facility_type": "colocation", "capacity_mw": 1, "pue": None, "cooling_method": "air_cooled", "gpu": None, "source": "Cologix", "source_url": "https://cologix.com/data-centers/calgary/cgy1/", "notes": "5000 sqft. Acquired from DataHive 2025."},
    {"facility_name": "Equinix Calgary CL1", "company": "Equinix", "lat": 51.05, "lng": -114.07, "country": "CA", "region": "Alberta", "city": "Calgary", "status": "operational", "facility_type": "colocation", "capacity_mw": 0.8, "pue": None, "cooling_method": "air_cooled", "gpu": "NVIDIA DGX-Ready", "source": "Equinix", "source_url": "https://www.equinix.com/data-centers/americas-colocation/canada-colocation/calgary-data-centers/cl1", "notes": "315 8th Ave SW. 800kVA. 12000 sqft."},
    {"facility_name": "Equinix Calgary CL3", "company": "Equinix", "lat": 50.99, "lng": -114.01, "country": "CA", "region": "Alberta", "city": "Calgary", "status": "operational", "facility_type": "colocation", "capacity_mw": 1.5, "pue": None, "cooling_method": "air_cooled", "gpu": "NVIDIA DGX-Ready", "source": "Equinix", "source_url": "https://www.equinix.com/data-centers/americas-colocation/canada-colocation/calgary-data-centers/cl3", "notes": "5300 86th Ave. 1.5MW + 2.4MW expansion. 42882 sqft."},
    {"facility_name": "Wolfpaw EDM1 Edmonton", "company": "Wolfpaw Data Centres", "lat": 53.54, "lng": -113.49, "country": "CA", "region": "Alberta", "city": "Edmonton", "status": "operational", "facility_type": "colocation", "capacity_mw": None, "pue": None, "cooling_method": "unknown", "gpu": None, "source": "Wolfpaw", "source_url": "https://www.wolfpaw.com/edmonton-ab-data-center/", "notes": "10060 Jasper Ave. Edmonton carrier-neutral colo."},
    {"facility_name": "Bell AI Fabric Kamloops -- Groq Inference 7MW", "company": "Bell Canada / Groq", "lat": 50.67, "lng": -120.33, "country": "CA", "region": "British Columbia", "city": "Kamloops", "status": "operational", "facility_type": "ai_factory", "capacity_mw": 7, "pue": None, "cooling_method": "liquid_cooled", "gpu": "Groq LPU", "source": "DCD", "source_url": "https://www.datacenterdynamics.com/en/news/bell-ai-fabric-bell-canada-plans-ai-data-center-supercluster-with-500mw-in-british-columbia/", "notes": "First Bell AI Fabric facility. 7MW Groq inference. Operational June 2025."},
    {"facility_name": "Bell AI Fabric Kamloops -- TRU 26MW", "company": "Bell Canada / Thompson Rivers University", "lat": 50.67, "lng": -120.33, "country": "CA", "region": "British Columbia", "city": "Kamloops", "status": "under_construction", "facility_type": "ai_factory", "capacity_mw": 26, "pue": None, "cooling_method": "unknown", "gpu": None, "source": "CBC", "source_url": "https://www.cbc.ca/news/canada/british-columbia/bell-ai-new-data-centres-bc-1.7546516", "notes": "26MW AI DC partnership with TRU. Completion 2026."},
    {"facility_name": "IREN Canal Flats BC", "company": "IREN", "lat": 50.15, "lng": -115.84, "country": "CA", "region": "British Columbia", "city": "Canal Flats", "status": "operational", "facility_type": "ai_factory", "capacity_mw": 30, "pue": 1.1, "cooling_method": "air_cooled", "gpu": "NVIDIA Blackwell", "source": "IREN", "source_url": "https://iren.com/data-centers/canal-flats", "notes": "30MW 10-acre site. PUE 1.1. 70kW max rack. BC Hydro."},
    {"facility_name": "IREN Mackenzie BC -- 80MW AI Hub", "company": "IREN", "lat": 55.34, "lng": -122.97, "country": "CA", "region": "British Columbia", "city": "Mackenzie", "status": "operational", "facility_type": "ai_factory", "capacity_mw": 80, "pue": 1.1, "cooling_method": "air_cooled", "gpu": "NVIDIA Blackwell", "source": "IREN", "source_url": "https://iren.com/data-centers/mackenzie", "notes": "80MW 11-acre site. PUE 1.1. 100MW substation. BC Hydro."},
    {"facility_name": "Yondr TOR1 Toronto -- 27MW Closed-Loop", "company": "Yondr Group", "lat": 43.8, "lng": -79.35, "country": "CA", "region": "Ontario", "city": "Toronto", "status": "under_construction", "facility_type": "colocation", "capacity_mw": 27, "pue": None, "cooling_method": "liquid_cooled", "gpu": None, "source": "Yondr", "source_url": "https://www.yondrgroup.com/newsroom/press-release/yondr-group-celebrates-groundbreaking-for-27mw-toronto-data-center/", "notes": "27MW 3-storey. Closed-loop cooling zero water. RFS mid-2026."},
    {"facility_name": "QScale QO1 Toronto -- Hyperscale AI", "company": "QScale", "lat": 43.7, "lng": -79.4, "country": "CA", "region": "Ontario", "city": "Toronto", "status": "planned", "facility_type": "hyperscale", "capacity_mw": 142, "pue": None, "cooling_method": "unknown", "gpu": None, "source": "DCD", "source_url": "https://www.datacenterdynamics.com/en/news/canadas-qscale-plans-to-build-multi-billion-dollar-data-center-in-toronto/", "notes": "142MW C2.5-4B investment. Two 5-story buildings. 100% renewable. HPE customer."},
    {"facility_name": "55H Brampton -- High Density Colo", "company": "55H (Grain Management / StratCap)", "lat": 43.73, "lng": -79.76, "country": "CA", "region": "Ontario", "city": "Brampton", "status": "under_construction", "facility_type": "colocation", "capacity_mw": 20, "pue": None, "cooling_method": "liquid_cooled", "gpu": None, "source": "55H", "source_url": "https://55hdc.com/ontario-based-55h-announces-data-center-capacity-expansion/", "notes": "215100 sqft Tier III. 20MW total. 130kW+/rack liquid cooling."},
    {"facility_name": "Related Digital / Ascent Cambridge -- 54MW", "company": "Related Digital / TowerBrook / Ascent", "lat": 43.36, "lng": -80.31, "country": "CA", "region": "Ontario", "city": "Cambridge", "status": "under_construction", "facility_type": "hyperscale", "capacity_mw": 54, "pue": None, "cooling_method": "unknown", "gpu": None, "source": "CPP Investments", "source_url": "https://www.cppinvestments.com/newsroom/cpp-investments-commits-to-225-million-in-construction-financing-for-ontario-data-centre/", "notes": "54MW hyperscale. C225M CPP Investments. Pre-leased to GPU AI cloud provider."},
    {"facility_name": "Bell AI Fabric Regina -- 300MW Campus", "company": "Bell Canada / Cerebras / CoreWeave", "lat": 50.45, "lng": -104.62, "country": "CA", "region": "Saskatchewan", "city": "Regina", "status": "planned", "facility_type": "ai_factory", "capacity_mw": 300, "pue": None, "cooling_method": "unknown", "gpu": None, "source": "CBC", "source_url": "https://www.cbc.ca/news/canada/saskatchewan/ai-data-rm-of-sherwood-9.7130417", "notes": "300MW 1.7B. Multiple 50MW buildings. Cerebras + CoreWeave tenants. Construction spring 2026."},
    {"facility_name": "Prairie2Cloud Sovereign AI Campus", "company": "Prairie2Cloud", "lat": 50.5, "lng": -104.6, "country": "CA", "region": "Saskatchewan", "city": "Saskatchewan", "status": "planned", "facility_type": "ai_factory", "capacity_mw": 300, "pue": None, "cooling_method": "liquid_cooled", "gpu": None, "source": "Prairie2Cloud", "source_url": "https://prairie2cloud.com/", "notes": "300MW+ sovereign AI campus. Off-grid power closed-loop cooling. 100% Canadian-owned."},
    {"facility_name": "Beacon AI / VoltaGrid Lorneville -- Saint John NB", "company": "Beacon AI Centers / VoltaGrid", "lat": 45.22, "lng": -66.15, "country": "CA", "region": "New Brunswick", "city": "Saint John", "status": "planned", "facility_type": "hyperscale", "capacity_mw": None, "pue": None, "cooling_method": "unknown", "gpu": None, "source": "CTV News", "source_url": "https://www.ctvnews.ca/atlantic/new-brunswick/article/a-lot-of-tough-questions-companies-behind-saint-john-data-centre-hear-residents-concerns/", "notes": "Proposed AI DC in Lorneville NB. Beacon AI + VoltaGrid partnership."},
]

added = 0
for fac in new_facilities:
    if fac['facility_name'].lower() in existing_names:
        print(f"SKIP: {fac['facility_name']}")
        continue
    max_id += 1
    fac['id'] = f'ca-{max_id:03d}'
    region = fac['region']
    if region == 'Alberta':
        fac['regulatory_zone'] = 'ca-ab'
    elif region == 'British Columbia':
        fac['regulatory_zone'] = 'ca-bc'
    elif region == 'Ontario':
        fac['regulatory_zone'] = 'ca-on'
    elif region == 'Quebec':
        fac['regulatory_zone'] = 'ca-qc'
    else:
        fac['regulatory_zone'] = 'ca-federal'
    fac['address'] = f"{fac['city']}, {fac['region']}, Canada"
    fac['confidence_tier'] = 'verified'
    fac['source_date'] = '2026-04'
    fac['last_verified'] = '2026-04-06'
    fac['data_gaps'] = [k for k in ['pue', 'capacity_mw', 'gpu'] if fac.get(k) is None]
    canada.append(fac)
    existing_names.add(fac['facility_name'].lower())
    added += 1
    print(f"ADDED: {fac['id']} | {fac['facility_name']} | {fac['region']} | {fac.get('capacity_mw')}MW | {fac['status']}")

with open('src/data/facilities/canada.json', 'w', encoding='utf-8') as f:
    json.dump(canada, f, indent=2, ensure_ascii=False)

print(f"\nTotal added: {added} | Canada facilities: {len(canada)}")
