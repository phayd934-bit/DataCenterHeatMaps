const fs = require('fs');
const path = require('path');

// Build GPU lookup from research files
const researchDir = path.join(__dirname, '..', 'src', 'data', 'research');
const gpuLookup = new Map(); // key: normalized "company|facility_name" -> gpu value

for (const f of fs.readdirSync(researchDir)) {
  if (!f.endsWith('.json')) continue;
  let data;
  try { data = JSON.parse(fs.readFileSync(path.join(researchDir, f))); } catch(e) { continue; }
  const arr = Array.isArray(data) ? data : (data.facilities || []);
  for (const fac of arr) {
    const gpu = fac.gpu_architecture || fac.gpu_model || null;
    if (!gpu) continue;
    const name = (fac.facility_name || fac.name || '').toLowerCase().trim();
    const company = (fac.operator_company || fac.operator || '').toLowerCase().trim();
    if (name) {
      gpuLookup.set(name, gpu);
      if (company) gpuLookup.set(`${company}|${name}`, gpu);
    }
  }
}

console.log('GPU lookup entries: ' + gpuLookup.size);

// Process each display file
const facilityFiles = [
  path.join(__dirname, '..', 'src', 'data', 'facilities', 'us.json'),
  path.join(__dirname, '..', 'src', 'data', 'facilities', 'canada.json'),
  path.join(__dirname, '..', 'src', 'data', 'facilities', 'eu.json'),
];

let totalMatched = 0;
let totalFacilities = 0;

for (const filePath of facilityFiles) {
  const facilities = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let matched = 0;

  for (const fac of facilities) {
    totalFacilities++;
    const name = (fac.facility_name || '').toLowerCase().trim();
    const company = (fac.company || '').toLowerCase().trim();

    // Try exact match with company|name first, then name only
    const key1 = `${company}|${name}`;
    const gpu = gpuLookup.get(key1) || gpuLookup.get(name) || null;

    if (gpu) {
      fac.gpu = gpu;
      matched++;
    }
  }

  totalMatched += matched;
  fs.writeFileSync(filePath, JSON.stringify(facilities, null, 2) + '\n');
  console.log(`${path.basename(filePath)}: ${matched}/${facilities.length} matched`);
}

console.log(`\nTotal: ${totalMatched}/${totalFacilities} facilities got GPU data`);
