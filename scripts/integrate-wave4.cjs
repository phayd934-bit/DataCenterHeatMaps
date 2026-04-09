const fs = require('fs');
const path = require('path');

const ca = require('../src/data/research/canada-facilities.json');
const us = require('../src/data/research/us-facilities.json');
const eu = require('../src/data/research/eu-facilities.json');

const existingNames = new Set([...ca, ...us, ...eu].map(f => f.facility_name.toLowerCase()));
const existingOps = new Set([...ca, ...us, ...eu].map(f => (f.operator_company + '|' + f.city).toLowerCase()));

function isDuplicate(f) {
  const name = (f.facility_name || '').toLowerCase();
  const opCity = ((f.operator_company || '') + '|' + (f.city || '')).toLowerCase();
  return existingNames.has(name) || existingOps.has(opCity);
}

function getBucket(c) {
  if (c === 'CA') return 'Canada'; if (c === 'US') return 'USA';
  if (['DE','FR','NL','BE','CH','PL','ES','IT','GR','AT','IE','PT','CZ','RO','HU','NO','SE','FI','DK','IS','GB','EE','LT','LV','HR','RS','BG','LU','SK','SI','BA','ME','MK','AL','MD'].includes(c)) return 'EU';
  if (['JP','KR','SG','AU','TW','MY','ID','TH','VN','PH','IN','HK','NZ','CN','BD','LK'].includes(c)) return 'Tier5_APAC';
  return 'Tier6_Emerging';
}

function isPueMatch(f) { const p = f.pue_value || f.pue; return p != null && p >= 1.04 && p <= 1.20; }
function isCoolingMatch(f) { const c = (f.cooling_type||'').toLowerCase(); return ['liquid','immersion','hybrid','direct-to-chip','dlc'].some(t=>c.includes(t))||f.liquid_cooling_verified; }
function isMwMatch(f) { const m = f.facility_mw || f.mw; return m != null && m <= 10; }

function normalize(f) {
  return {
    facility_name: f.facility_name||'Unknown', operator_company: f.operator_company||f.operator||'Unknown',
    country: f.country||'Unknown', state_province_region: f.state_province_region||f.region||'',
    city: f.city||'', latitude: f.latitude||f.lat||null, longitude: f.longitude||f.lng||null,
    region_priority_bucket: getBucket(f.country), facility_status: f.facility_status||'existing',
    facility_type: f.facility_type||'colocation',
    pue_value: f.pue_value||f.pue||null, pue_verified: f.pue_verified||(f.pue_value!=null),
    pue_evidence_type: f.pue_value?'direct':null,
    cooling_type: f.cooling_type||'unknown',
    liquid_cooling_verified: f.liquid_cooling_verified||['liquid','immersion','hybrid','direct-to-chip'].includes((f.cooling_type||'').toLowerCase()),
    immersion_cooling_verified: f.immersion_cooling_verified||(f.cooling_type||'').toLowerCase().includes('immersion'),
    cooling_evidence_type: ['liquid','immersion','hybrid'].includes((f.cooling_type||'').toLowerCase())?'direct':null,
    facility_mw: f.facility_mw||f.mw||null, mw_verified: f.mw_verified||(f.facility_mw!=null),
    matched_on_pue: isPueMatch(f), matched_on_cooling: isCoolingMatch(f), matched_on_mw: isMwMatch(f),
    matched_metric_count: (isPueMatch(f)?1:0)+(isCoolingMatch(f)?1:0)+(isMwMatch(f)?1:0),
    qualifies_for_dataset: isPueMatch(f)||isCoolingMatch(f)||isMwMatch(f),
    liquid_cooling_fit_score: f.liquid_cooling_fit_score||60, confidence_score: f.confidence_score||60,
    verification_tier: f.verification_tier||'moderate', last_verified_date: '2026-04-04',
    source_1_url: f.source_1_url||f.source_url||null, source_1_publisher: f.source_1_publisher||null,
    opportunity_summary: f.opportunity_summary||f.notes||'',
    gpu_architecture: f.gpu_architecture||null, gpu_model: f.gpu_model||null,
    gpu_count: f.gpu_count||null, gpu_verified: f.gpu_verified||false,
    gpu_evidence_type: null, compute_vendor: f.compute_vendor||null,
    rack_density_kw: f.rack_density_kw||null, notes: f.notes||''
  };
}

const w4files = ['new-vendor-sites-w4', 'new-hpc-w4', 'new-pipeline-w4'];
let added = 0, skipped = 0;

for (const file of w4files) {
  const fpath = path.join(__dirname, `../src/data/research/${file}.json`);
  if (!fs.existsSync(fpath)) { console.log(`${file}: not found`); continue; }
  let data;
  try { data = JSON.parse(fs.readFileSync(fpath, 'utf8')); } catch(e) { console.log(`${file}: parse error`); continue; }
  if (!Array.isArray(data)) { console.log(`${file}: not array`); continue; }

  let fileAdded = 0;
  for (const raw of data) {
    if (isDuplicate(raw)) { skipped++; continue; }
    const norm = normalize(raw);
    if (!norm.latitude || !norm.longitude) { skipped++; continue; }
    if (norm.country === 'CA') ca.push(norm);
    else if (norm.country === 'US') us.push(norm);
    else eu.push(norm);
    existingNames.add(norm.facility_name.toLowerCase());
    existingOps.add((norm.operator_company+'|'+norm.city).toLowerCase());
    added++; fileAdded++;
  }
  console.log(`${file}: ${fileAdded} added, ${data.length-fileAdded} skipped`);
}

fs.writeFileSync(path.join(__dirname, '../src/data/research/canada-facilities.json'), JSON.stringify(ca, null, 2));
fs.writeFileSync(path.join(__dirname, '../src/data/research/us-facilities.json'), JSON.stringify(us, null, 2));
fs.writeFileSync(path.join(__dirname, '../src/data/research/eu-facilities.json'), JSON.stringify(eu, null, 2));

const countries = [...new Set([...ca,...us,...eu].map(f=>f.country))].sort();
console.log(`\nWAVE 4: Added ${added} | Skipped ${skipped}`);
console.log(`CA: ${ca.length} | US: ${us.length} | EU/Global: ${eu.length}`);
console.log(`GRAND TOTAL: ${ca.length+us.length+eu.length} | Countries: ${countries.length}`);
