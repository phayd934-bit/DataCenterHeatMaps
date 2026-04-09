const fs = require('fs');
const path = require('path');

// Operators confirmed ON Baxtel (normalized to lowercase)
const onBaxtelRaw = [
  // US operators (20/20)
  'equinix', 'qts data centers', 'cyrusone', 'switch', 'switch inc.',
  'digital realty', 'digital realty trust', 'digital realty (interxion)',
  'interxion / digital realty', 'interxion (digital realty)',
  'digital realty / vertiv', 'digital realty (via telepoint acquisition)',
  'mc digital realty (digital realty / mitsubishi)',
  'stack infrastructure', 'stack infrastructure (formerly digiplex)',
  'coresite', 'coresite / stn gpu one',
  'aligned data centers', 'aligned', 'aligned energy',
  'compass datacenters', 'compass',
  'databank', 'tierpoint', 'sabey data centers', 'sabey',
  'flexential', 'flexential / coreweave',
  'iron mountain', 'iron mountain data centers',
  't5 data centers', 'edgeconnex',
  'vantage data centers', 'vantage data centers / oracle / openai',
  'vantage data centers (acquired from yondr group)',
  'stream data centers', 'stream data centers (eagle myra llc)',
  'prime data centers', 'cloudhq',
  'qts data centers (blackstone qts)',
  'cyrusone (now kkr/gip)', 'cyrusone (kkr/global infrastructure partners)',
  'cyrusone (kkr & gip)', 'cyrusone (kkr & blackrock)',
  'equinix (formerly mainone/mdxi)',
  // Hyperscalers
  'google', 'google llc',
  'microsoft', 'microsoft corporation', 'microsoft azure',
  'microsoft / nscale', 'microsoft / nscale / aker',
  'microsoft / fortum', 'microsoft / wiwynn', 'microsoft / nvidia',
  'amazon web services', 'aws',
  'meta', 'meta platforms',
  'apple', 'apple inc.',
  'oracle', 'oracle / openai / softbank', 'oracle / openai',
  'oracle / openai / related digital', 'oracle / openai / vantage',
  'oracle / related digital',
  'coreweave', 'crusoe energy', 'crusoe energy systems', 'crusoe',
  'applied digital', 'applied digital corporation', 'applied digital (apld)',
  'xai', 'nvidia',
  'nebius', 'nebius group', 'nebius / patmos', 'nebius / nvidia',
  'nebius group (formerly yandex)',
  'alibaba cloud', 'tencent', 'tencent cloud',
  'ovhcloud', 'hetzner online', 'hetzner online gmbh',
  // Telecom/Specialty found
  'kddi', 'kddi corporation',
  'ntt data', 'ntt data (ntt group)', 'ntt', 'ntt global data centers',
  'ntt global data centers / ntt ltd.', 'ntt data / ntt global data centers',
  'ntt communications / mhi / nesic', 'ntt facilities', 'ntt data / neysa networks / telangana government',
  'dartpoints', 'colovore', 'colovore / king street capital',
  'novva data centers',
  'qscale', 'nautilus data technologies',
  'datavolt', 'data volt',
  'macquarie data centres', 'macquarie data centres / resetdata / submer',
  'lefdal mine datacenter as',
  'core scientific', 'core scientific (corz)', 'core scientific/coreweave',
  'iren', 'iren (formerly iris energy)',
  'bitdeer', 'bitdeer technologies (btdr)',
  'riot platforms', 'riot platforms (riot)',
  'cleanspark', 'cleanspark (clsk)',
  'terawulf', 'terawulf (wulf)', 'terawulf inc.',
  'terawulf (wulf) / fluidstack jv',
  'bit digital', 'bit digital / enovum data centers (btbt)',
  'bell canada', 'leaseweb', 'leaseweb canada (formerly iweb)',
  // International found
  'atnorth', 'at north',
  'kao data', 'nvidia / kao data',
  'ark data centres',
  'cologix', 'airtrunk',
  'global switch',
  'nextdc', 'nextdc/openai', 'nextdc / sharon ai',
  'princeton digital group',
  'bridge data centres',
  'scala data centers',
  'ascenty', 'ascenty (digital realty)',
  'africa data centres',
  'khazna', 'khazna data centers',
  'odata', 'odata (aligned data centers)',
  'telehouse', 'telehouse europe', 'telehouse canada / enwave', 'telehouse (kddi)',
  'raxio', 'raxio group',
  'st telemedia global data centres (stt gdc)',
  'st telemedia', 'stt gdc',
  // Additional confirmed
  'nscale', 'nscale / aker (50/50 jv)', 'nscale / aker',
  'nscale / infrapartners', 'nscale (formerly aipcorp / fidelis new energy)',
  'nscale global holdings', 'nscale/aker/microsoft',
];

const onBaxtel = new Set(onBaxtelRaw.map(s => s.toLowerCase().trim()));

// Confirmed NOT on Baxtel
const notOnBaxtelRaw = [
  'bytedance', 'bytedance / volcano cloud', 'bytedance / aolani cloud',
  'bytedance / tiktok', 'baidu', 'scaleway', 'vultr',
  'sk telecom', 'vapor io', 'edgemicro', 'edge micro',
  'cdc data centres', 'yotta data services', 'yotta data services (hiranandani group)',
  'ctrls datacenters', 'ctrls', 'bahnhof', 'bahnhof ab',
  'hut 8', 'hut 8 (hut)', 'marathon digital', 'marathon digital holdings (mara)',
  'cipher mining', 'cipher mining (cifr)', 'telus',
  'ecodatacenter', 'green mountain', 'green mountain as',
  'colt data centre services',
  'virtus data centres',
  'keppel dc reit', 'keppel dc',
  'aruba s.p.a.',
  'edged', 'edged energy', 'edged us',
  'edged energy / merlin properties',
  'chindata group', 'chindata group (hec group)', 'chindata',
  'gds holdings', 'gds holdings / dayone',
  'digiplex', 'digiplex (aligned data centers)', 'digiplex (stack infrastructure)',
  'gulf data hub',
];

const notOnBaxtel = new Set(notOnBaxtelRaw.map(s => s.toLowerCase().trim()));

const dir = path.join(__dirname, '..', 'src', 'data', 'research');
let totalFacilities = 0;
let matchedFacilities = 0;
let notMatchedFacilities = 0;
let uncheckedFacilities = 0;
const uncheckedOps = new Map();
const matchedOps = new Map();
const notMatchedOps = new Map();

for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith('.json')) continue;
  let data;
  try { data = JSON.parse(fs.readFileSync(path.join(dir, f))); } catch(e) { console.log('SKIP bad JSON: '+f); continue; }
  const arr = Array.isArray(data) ? data : (data.facilities || []);
  for (const fac of arr) {
    totalFacilities++;
    const op = (fac.operator_company || fac.operator || '').toLowerCase().trim();
    if (!op || op === 'unknown' || op.startsWith('undisclosed') || op.startsWith('tbd')) {
      uncheckedFacilities++;
      uncheckedOps.set(op || '(empty)', (uncheckedOps.get(op || '(empty)') || 0) + 1);
      continue;
    }
    if (onBaxtel.has(op)) {
      matchedFacilities++;
      matchedOps.set(op, (matchedOps.get(op) || 0) + 1);
    } else if (notOnBaxtel.has(op)) {
      notMatchedFacilities++;
      notMatchedOps.set(op, (notMatchedOps.get(op) || 0) + 1);
    } else {
      uncheckedFacilities++;
      uncheckedOps.set(op, (uncheckedOps.get(op) || 0) + 1);
    }
  }
}

console.log('=== BAXTEL MATCH REPORT ===');
console.log('Total facilities in our dataset: ' + totalFacilities);
console.log('');
console.log('Operator ON Baxtel -> facilities: ' + matchedFacilities + ' (' + (matchedFacilities/totalFacilities*100).toFixed(1) + '%)');
console.log('Operator NOT on Baxtel -> facilities: ' + notMatchedFacilities + ' (' + (notMatchedFacilities/totalFacilities*100).toFixed(1) + '%)');
console.log('Operator not checked -> facilities: ' + uncheckedFacilities + ' (' + (uncheckedFacilities/totalFacilities*100).toFixed(1) + '%)');
console.log('');
console.log('=== TOP MATCHED OPERATORS (on Baxtel) ===');
const sortedMatched = [...matchedOps.entries()].sort((a,b) => b[1] - a[1]);
for (const [op, count] of sortedMatched.slice(0, 30)) {
  console.log('  ' + count + 'x ' + op);
}
console.log('  ... and ' + (sortedMatched.length - 30) + ' more operators');
console.log('');
console.log('=== NOT MATCHED OPERATORS (not on Baxtel) ===');
const sortedNot = [...notMatchedOps.entries()].sort((a,b) => b[1] - a[1]);
for (const [op, count] of sortedNot) {
  console.log('  ' + count + 'x ' + op);
}
console.log('');
console.log('=== TOP UNCHECKED OPERATORS ===');
const sortedUnchecked = [...uncheckedOps.entries()].sort((a,b) => b[1] - a[1]);
for (const [op, count] of sortedUnchecked.slice(0, 40)) {
  console.log('  ' + count + 'x ' + op);
}
console.log('  Total unchecked unique operators: ' + sortedUnchecked.length);
