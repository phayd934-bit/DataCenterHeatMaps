const fs = require('fs');
const path = require('path');

const ca = require('../src/data/research/canada-facilities.json');
const us = require('../src/data/research/us-facilities.json');
const eu = require('../src/data/research/eu-facilities.json');

function convert(f, idx, prefix) {
  const pue = f.pue_value || (f.pue_min_if_range && f.pue_max_if_range ? (f.pue_min_if_range + f.pue_max_if_range) / 2 : f.pue_min_if_range || f.pue_max_if_range || null);
  const cooling = { liquid: 'liquid_cooled', 'direct-to-chip': 'liquid_cooled', immersion: 'immersion', hybrid: 'hybrid', air: 'air_cooled', 'rear-door': 'liquid_cooled', unknown: 'unknown' };
  const types = { HPC: 'ai_factory', AI: 'ai_factory', colocation: 'colocation', hyperscale: 'hyperscale', enterprise: 'enterprise', edge: 'edge', telecom: 'enterprise', modular: 'edge' };

  const country = f.country;
  const region = (f.state_province_region || '').toLowerCase();
  let zone = '';
  if (country === 'CA') {
    if (region.includes('ontario')) zone = 'ca-on';
    else if (region.includes('quebec')) zone = 'ca-qc';
    else if (region.includes('british')) zone = 'ca-bc';
    else if (region.includes('alberta')) zone = 'ca-ab';
    else zone = 'ca-' + region.slice(0, 2);
  } else if (country === 'US') {
    const abbr = { virginia: 'va', texas: 'tx', california: 'ca', oregon: 'or', illinois: 'il', arizona: 'az', nevada: 'nv', georgia: 'ga', 'new jersey': 'nj', 'north dakota': 'nd' };
    zone = 'us-' + (abbr[region] || region.slice(0, 2));
  } else {
    zone = 'eu-' + country.toLowerCase();
  }

  const status = f.facility_status === 'existing' ? 'operational' : f.facility_status;
  const gaps = [];
  if (!f.pue_verified) gaps.push('pue');
  if (!f.mw_verified) gaps.push('capacity_mw');
  if (f.cooling_type === 'unknown') gaps.push('cooling_method');
  if (!f.latitude) gaps.push('coordinates');

  return {
    id: prefix + '-' + String(idx + 1).padStart(3, '0'),
    company: f.operator_company,
    facility_name: f.facility_name,
    lat: f.latitude,
    lng: f.longitude,
    address: f.full_address || (f.city + ', ' + f.state_province_region),
    country: f.country,
    region: f.state_province_region,
    status: status,
    facility_type: types[f.facility_type] || 'colocation',
    capacity_mw: f.facility_mw,
    pue: pue,
    pue_source: f.source_1_title || null,
    pue_source_url: f.source_1_url || null,
    cooling_method: cooling[f.cooling_type] || 'unknown',
    regulatory_zone: zone,
    source: f.source_1_publisher || 'Research',
    source_url: f.source_1_url || null,
    source_date: f.source_1_date || '2026-04-03',
    last_verified: f.last_verified_date || '2026-04-03',
    confidence_tier: f.verification_tier === 'strong' ? 'verified' : f.verification_tier === 'moderate' ? 'reported' : 'unconfirmed',
    notes: f.opportunity_summary || '',
    data_gaps: gaps
  };
}

const caOut = ca.map((f, i) => convert(f, i, 'ca'));
const usOut = us.map((f, i) => convert(f, i, 'us'));
const euOut = eu.map((f, i) => convert(f, i, 'eu'));

fs.writeFileSync(path.join(__dirname, '../src/data/facilities/canada.json'), JSON.stringify(caOut, null, 2));
fs.writeFileSync(path.join(__dirname, '../src/data/facilities/us.json'), JSON.stringify(usOut, null, 2));
fs.writeFileSync(path.join(__dirname, '../src/data/facilities/eu.json'), JSON.stringify(euOut, null, 2));

console.log('Converted: CA', caOut.length, '| US', usOut.length, '| EU', euOut.length);
console.log('Total on map:', caOut.length + usOut.length + euOut.length);
