const fs = require('fs');
const path = require('path');

// Load existing research data
const ca = require('../src/data/research/canada-facilities.json');
const us = require('../src/data/research/us-facilities.json');
const eu = require('../src/data/research/eu-facilities.json');

// Existing facility names for dedup
const existingNames = new Set([...ca, ...us, ...eu].map(f => f.facility_name.toLowerCase()));
const existingOps = new Set([...ca, ...us, ...eu].map(f => (f.operator_company + '|' + f.city).toLowerCase()));

function isDuplicate(f) {
  const name = (f.facility_name || '').toLowerCase();
  const opCity = ((f.operator_company || '') + '|' + (f.city || '')).toLowerCase();
  return existingNames.has(name) || existingOps.has(opCity);
}

// Normalize agent output to our research schema
function normalize(f) {
  return {
    facility_name: f.facility_name || 'Unknown',
    operator_company: f.operator_company || f.operator || 'Unknown',
    country: f.country || 'Unknown',
    state_province_region: f.state_province_region || f.region || f.province || '',
    city: f.city || '',
    latitude: f.latitude || f.lat || null,
    longitude: f.longitude || f.lng || null,
    region_priority_bucket: getBucket(f.country),
    facility_status: f.facility_status || f.status || 'existing',
    facility_type: f.facility_type || f.type || 'colocation',
    pue_value: f.pue_value || f.pue || null,
    pue_verified: f.pue_verified || (f.pue_value != null),
    pue_evidence_type: f.pue_value ? 'direct' : null,
    cooling_type: f.cooling_type || f.cooling || 'unknown',
    liquid_cooling_verified: f.liquid_cooling_verified || ['liquid', 'immersion', 'hybrid', 'direct-to-chip'].includes(f.cooling_type || f.cooling),
    immersion_cooling_verified: f.immersion_cooling_verified || (f.cooling_type || '').includes('immersion'),
    cooling_evidence_type: f.liquid_cooling_verified || ['liquid', 'immersion', 'hybrid'].includes(f.cooling_type) ? 'direct' : null,
    facility_mw: f.facility_mw || f.mw || null,
    mw_verified: f.mw_verified || (f.facility_mw != null || f.mw != null),
    matched_on_pue: isPueMatch(f),
    matched_on_cooling: isCoolingMatch(f),
    matched_on_mw: isMwMatch(f),
    matched_metric_count: (isPueMatch(f)?1:0) + (isCoolingMatch(f)?1:0) + (isMwMatch(f)?1:0),
    qualifies_for_dataset: (isPueMatch(f) || isCoolingMatch(f) || isMwMatch(f)),
    liquid_cooling_fit_score: f.liquid_cooling_fit_score || 60,
    confidence_score: f.confidence_score || f.confidence || 60,
    verification_tier: f.verification_tier || 'moderate',
    last_verified_date: '2026-04-04',
    source_1_url: f.source_1_url || f.source_url || f.source || null,
    source_1_publisher: f.source_1_publisher || f.publisher || null,
    opportunity_summary: f.opportunity_summary || f.summary || f.notes || '',
    gpu_architecture: f.gpu_architecture || null,
    gpu_model: f.gpu_model || null,
    gpu_count: f.gpu_count || null,
    gpu_verified: f.gpu_verified || false,
    gpu_evidence_type: null,
    compute_vendor: f.compute_vendor || null,
    rack_density_kw: f.rack_density_kw || null,
    notes: f.notes || ''
  };
}

function getBucket(country) {
  if (country === 'CA') return 'Canada';
  if (country === 'US') return 'USA';
  if (['DE','FR','NL','BE','CH','PL','ES','IT','GR','AT','IE','PT','CZ','RO','HU','NO','SE','FI','DK','IS','GB'].includes(country)) return 'EU';
  if (['JP','KR','SG','AU','TW','MY','ID','TH','VN','PH','IN','HK','NZ','CN'].includes(country)) return 'Tier5_APAC';
  if (['SA','AE','QA','OM','BH','IL','TR'].includes(country)) return 'Tier6_Emerging';
  return 'Tier7_Global';
}

function isPueMatch(f) {
  const pue = f.pue_value || f.pue;
  return pue != null && pue >= 1.04 && pue <= 1.20;
}

function isCoolingMatch(f) {
  const ct = (f.cooling_type || f.cooling || '').toLowerCase();
  return ['liquid', 'immersion', 'hybrid', 'direct-to-chip', 'dlc'].some(t => ct.includes(t)) || f.liquid_cooling_verified;
}

function isMwMatch(f) {
  const mw = f.facility_mw || f.mw;
  return mw != null && mw <= 10;
}

// Load agent output files
const files = ['new-canada', 'new-us-small', 'new-nordics-uk', 'new-eu-continental', 'new-apac', 'new-mea-latam'];
let added = 0;
let skipped = 0;
let errors = 0;

for (const file of files) {
  const fpath = path.join(__dirname, `../src/data/research/${file}.json`);
  if (!fs.existsSync(fpath)) {
    console.log(`${file}: not found, skipping`);
    continue;
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(fpath, 'utf8'));
  } catch (e) {
    console.log(`${file}: JSON parse error — ${e.message}`);
    errors++;
    continue;
  }

  if (!Array.isArray(data)) {
    console.log(`${file}: not an array, skipping`);
    continue;
  }

  let fileAdded = 0;
  for (const raw of data) {
    if (isDuplicate(raw)) {
      skipped++;
      continue;
    }

    const norm = normalize(raw);
    if (!norm.latitude || !norm.longitude) {
      // Skip entries without coordinates — can't put on map
      skipped++;
      continue;
    }

    const country = norm.country;
    if (country === 'CA') {
      ca.push(norm);
    } else if (country === 'US') {
      us.push(norm);
    } else {
      eu.push(norm);
    }

    existingNames.add(norm.facility_name.toLowerCase());
    existingOps.add((norm.operator_company + '|' + norm.city).toLowerCase());
    added++;
    fileAdded++;
  }
  console.log(`${file}: ${fileAdded} added, ${data.length - fileAdded} skipped (dups/no coords)`);
}

// Write updated files
fs.writeFileSync(path.join(__dirname, '../src/data/research/canada-facilities.json'), JSON.stringify(ca, null, 2));
fs.writeFileSync(path.join(__dirname, '../src/data/research/us-facilities.json'), JSON.stringify(us, null, 2));
fs.writeFileSync(path.join(__dirname, '../src/data/research/eu-facilities.json'), JSON.stringify(eu, null, 2));

console.log(`\n=== INTEGRATION COMPLETE ===`);
console.log(`Added: ${added} | Skipped: ${skipped} | Errors: ${errors}`);
console.log(`New totals — CA: ${ca.length} | US: ${us.length} | EU/Global: ${eu.length}`);
console.log(`Grand total: ${ca.length + us.length + eu.length}`);
