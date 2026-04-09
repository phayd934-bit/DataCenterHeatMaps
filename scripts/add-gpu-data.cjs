const fs = require('fs');
const path = require('path');

const ca = require('../src/data/research/canada-facilities.json');
const us = require('../src/data/research/us-facilities.json');
const eu = require('../src/data/research/eu-facilities.json');

// GPU data lookup by facility name
const gpuData = {
  // CANADA
  "Q01 Campus": { gpu_architecture: "NVIDIA Hopper", gpu_model: "H100 (HPE AI Cloud)", gpu_count: null, gpu_verified: true, gpu_evidence_type: "indirect", compute_vendor: "NVIDIA", rack_density_kw: 600 },
  "DC1 Richmond Hill": { gpu_architecture: null, gpu_model: null, gpu_count: null, gpu_verified: false, gpu_evidence_type: null, compute_vendor: null, rack_density_kw: null },
  "DC4 Richmond Hill": { gpu_architecture: null, gpu_model: null, gpu_count: null, gpu_verified: false, gpu_evidence_type: null, compute_vendor: null, rack_density_kw: null },
  "CAL-3 Calgary": { gpu_architecture: null, gpu_model: null, gpu_count: null, gpu_verified: false, gpu_evidence_type: null, compute_vendor: "NVIDIA (GPU-as-a-Service ready)", rack_density_kw: 125 },
  "Sovereign AI Factory — Kamloops": { gpu_architecture: "NVIDIA Hopper + Blackwell", gpu_model: "Hopper/Blackwell supercomputers", gpu_count: null, gpu_verified: true, gpu_evidence_type: "direct", compute_vendor: "NVIDIA", rack_density_kw: null },
  "Sovereign AI Factory — Rimouski": { gpu_architecture: "NVIDIA Hopper", gpu_model: "H100 (500 GPUs initial)", gpu_count: 500, gpu_verified: true, gpu_evidence_type: "direct", compute_vendor: "NVIDIA", rack_density_kw: null },
  "MTL8 Montréal": { gpu_architecture: null, gpu_model: "GPU-as-a-Service clients", gpu_count: null, gpu_verified: false, gpu_evidence_type: "indirect", compute_vendor: "NVIDIA", rack_density_kw: null },
  "TOR1 Toronto": { gpu_architecture: null, gpu_model: null, gpu_count: null, gpu_verified: false, gpu_evidence_type: null, compute_vendor: null, rack_density_kw: null },
  "Montreal II (QC4)": { gpu_architecture: null, gpu_model: null, gpu_count: null, gpu_verified: false, gpu_evidence_type: null, compute_vendor: null, rack_density_kw: null },
  "AI Fabric — Merritt": { gpu_architecture: "NVIDIA Hopper + Blackwell", gpu_model: "Hopper/Blackwell (same platform as Kamloops)", gpu_count: null, gpu_verified: true, gpu_evidence_type: "indirect", compute_vendor: "NVIDIA", rack_density_kw: null },

  // USA
  "Polaris Forge 1 — Ellendale": { gpu_architecture: "NVIDIA Blackwell", gpu_model: "GB200 NVL72", gpu_count: null, gpu_verified: true, gpu_evidence_type: "direct", compute_vendor: "NVIDIA (CoreWeave tenant)", rack_density_kw: 130 },
  "Stockton1 Floating Data Center": { gpu_architecture: null, gpu_model: null, gpu_count: null, gpu_verified: false, gpu_evidence_type: null, compute_vendor: null, rack_density_kw: 55 },
  "SUPERNAP 7": { gpu_architecture: "NVIDIA Blackwell", gpu_model: "GB300 NVL72 (CoreWeave EVO deployment)", gpu_count: null, gpu_verified: true, gpu_evidence_type: "direct", compute_vendor: "NVIDIA", rack_density_kw: 2000 },
  "Abilene AI Data Center (Stargate)": { gpu_architecture: "NVIDIA Blackwell", gpu_model: "GB200 (up to 400,000 chips)", gpu_count: 400000, gpu_verified: true, gpu_evidence_type: "direct", compute_vendor: "NVIDIA (OpenAI/Oracle)", rack_density_kw: 130 },
  "PHX-01 Phoenix": { gpu_architecture: null, gpu_model: "DeltaFlow supports all GPU platforms", gpu_count: null, gpu_verified: false, gpu_evidence_type: "indirect", compute_vendor: "NVIDIA (multi-tenant)", rack_density_kw: 300 },
  "Lambda AI Factory — Chicago": { gpu_architecture: "NVIDIA Blackwell", gpu_model: "GB200/GB300 (Lambda deploys early)", gpu_count: null, gpu_verified: true, gpu_evidence_type: "direct", compute_vendor: "NVIDIA", rack_density_kw: 600 },
  "GRC / Endor AI Data Centers": { gpu_architecture: null, gpu_model: null, gpu_count: null, gpu_verified: false, gpu_evidence_type: null, compute_vendor: null, rack_density_kw: null },
  "SJC02 Santa Clara": { gpu_architecture: "NVIDIA Blackwell", gpu_model: "NVL72-ready (250kW cabinets)", gpu_count: null, gpu_verified: true, gpu_evidence_type: "direct", compute_vendor: "NVIDIA", rack_density_kw: 250 },
  "DataBank SLC1 Downtown": { gpu_architecture: "NVIDIA Blackwell", gpu_model: "DGX-Ready certified", gpu_count: null, gpu_verified: true, gpu_evidence_type: "direct", compute_vendor: "NVIDIA", rack_density_kw: null },
  "Flexential Hillsboro 3": { gpu_architecture: null, gpu_model: null, gpu_count: null, gpu_verified: false, gpu_evidence_type: null, compute_vendor: null, rack_density_kw: null },
  "Sabey SDC Ashburn A": { gpu_architecture: null, gpu_model: null, gpu_count: null, gpu_verified: false, gpu_evidence_type: null, compute_vendor: null, rack_density_kw: 100 },

  // EU
  "EcoDataCenter 1 — Falun": { gpu_architecture: null, gpu_model: "Iceotope chassis-level immersion", gpu_count: null, gpu_verified: false, gpu_evidence_type: null, compute_vendor: null, rack_density_kw: 100 },
  "SVG-Rennesøy": { gpu_architecture: null, gpu_model: null, gpu_count: null, gpu_verified: false, gpu_evidence_type: null, compute_vendor: null, rack_density_kw: null },
  "FRA5 Frankfurt V": { gpu_architecture: null, gpu_model: null, gpu_count: null, gpu_verified: false, gpu_evidence_type: null, compute_vendor: null, rack_density_kw: null },
  "Stellium OCP Immersion Deployment": { gpu_architecture: null, gpu_model: "Submer SmartPod (OCP-compliant)", gpu_count: null, gpu_verified: false, gpu_evidence_type: null, compute_vendor: null, rack_density_kw: 150 },
  "DEN01 Copenhagen": { gpu_architecture: null, gpu_model: null, gpu_count: null, gpu_verified: false, gpu_evidence_type: null, compute_vendor: null, rack_density_kw: null },
  "OVHcloud Hybrid Immersion": { gpu_architecture: null, gpu_model: "OVHcloud custom (16 patents)", gpu_count: null, gpu_verified: false, gpu_evidence_type: null, compute_vendor: "OVHcloud custom", rack_density_kw: null },
  "Bellas Vistas Immersion Pilot": { gpu_architecture: null, gpu_model: "Submer SmartPod XL+ (50kW)", gpu_count: null, gpu_verified: false, gpu_evidence_type: null, compute_vendor: null, rack_density_kw: 50 },
  "N01 Kristiansand": { gpu_architecture: null, gpu_model: null, gpu_count: null, gpu_verified: false, gpu_evidence_type: null, compute_vendor: null, rack_density_kw: 100 },
  "KLON-03 Harlow": { gpu_architecture: "NVIDIA (DGX-Ready)", gpu_model: "NVIDIA DGX-Ready certified", gpu_count: null, gpu_verified: true, gpu_evidence_type: "direct", compute_vendor: "NVIDIA", rack_density_kw: 130 },
  "Verne/Nscale AI Campus": { gpu_architecture: "NVIDIA Blackwell Ultra", gpu_model: "Blackwell Ultra (4,600 GPUs)", gpu_count: 4600, gpu_verified: true, gpu_evidence_type: "direct", compute_vendor: "NVIDIA (Nscale tenant)", rack_density_kw: null },
  "Scaleway DC5 Paris": { gpu_architecture: null, gpu_model: null, gpu_count: null, gpu_verified: false, gpu_evidence_type: null, compute_vendor: null, rack_density_kw: null },
  "LiquidStack Hong Kong Deployment": { gpu_architecture: null, gpu_model: null, gpu_count: null, gpu_verified: false, gpu_evidence_type: null, compute_vendor: null, rack_density_kw: 252 },
  "DigiPlex Oslo Campus": { gpu_architecture: null, gpu_model: null, gpu_count: null, gpu_verified: false, gpu_evidence_type: null, compute_vendor: null, rack_density_kw: null },
};

function addGpu(facilities) {
  return facilities.map(f => {
    const gpu = gpuData[f.facility_name];
    if (gpu) {
      return { ...f, ...gpu };
    }
    return {
      ...f,
      gpu_architecture: null,
      gpu_model: null,
      gpu_count: null,
      gpu_verified: false,
      gpu_evidence_type: null,
      compute_vendor: null,
      rack_density_kw: null
    };
  });
}

const caUpdated = addGpu(ca);
const usUpdated = addGpu(us);
const euUpdated = addGpu(eu);

fs.writeFileSync(path.join(__dirname, '../src/data/research/canada-facilities.json'), JSON.stringify(caUpdated, null, 2));
fs.writeFileSync(path.join(__dirname, '../src/data/research/us-facilities.json'), JSON.stringify(usUpdated, null, 2));
fs.writeFileSync(path.join(__dirname, '../src/data/research/eu-facilities.json'), JSON.stringify(euUpdated, null, 2));

// Count stats
const all = [...caUpdated, ...usUpdated, ...euUpdated];
const withGpu = all.filter(f => f.gpu_verified);
const withArch = all.filter(f => f.gpu_architecture);
const withDensity = all.filter(f => f.rack_density_kw);

console.log('GPU data added to all', all.length, 'facilities');
console.log('GPU verified:', withGpu.length, 'of', all.length);
console.log('Architecture known:', withArch.length);
console.log('Rack density known:', withDensity.length);
