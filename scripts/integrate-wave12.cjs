const fs=require('fs'),path=require('path');
const ca=require('../src/data/research/canada-facilities.json');
const us=require('../src/data/research/us-facilities.json');
const eu=require('../src/data/research/eu-facilities.json');
const en=new Set([...ca,...us,...eu].map(f=>f.facility_name.toLowerCase()));
const eo=new Set([...ca,...us,...eu].map(f=>(f.operator_company+'|'+f.city).toLowerCase()));
function dup(f){return en.has((f.facility_name||'').toLowerCase())||eo.has(((f.operator_company||'')+'|'+(f.city||'')).toLowerCase())}
function gb(c){if(c==='CA')return'Canada';if(c==='US')return'USA';if(['DE','FR','NL','BE','CH','PL','ES','IT','GR','AT','IE','PT','CZ','RO','HU','NO','SE','FI','DK','IS','GB','EE','LT','LV','HR','RS','BG','LU','SK','SI'].includes(c))return'EU';if(['JP','KR','SG','AU','TW','MY','ID','TH','VN','PH','IN','HK','NZ','CN'].includes(c))return'Tier5_APAC';return'Tier6_Emerging'}
function norm(f){return{facility_name:f.facility_name||'Unknown',operator_company:f.operator_company||f.operator||'Unknown',country:f.country||'Unknown',state_province_region:f.state_province_region||f.region||'',city:f.city||'',latitude:f.latitude||f.lat||null,longitude:f.longitude||f.lng||null,region_priority_bucket:gb(f.country),facility_status:f.facility_status||'existing',facility_type:f.facility_type||'colocation',pue_value:f.pue_value||f.pue||null,pue_verified:f.pue_verified||(f.pue_value!=null),pue_evidence_type:f.pue_value?'direct':null,cooling_type:f.cooling_type||'unknown',liquid_cooling_verified:f.liquid_cooling_verified||['liquid','immersion','hybrid','direct-to-chip'].includes((f.cooling_type||'').toLowerCase()),immersion_cooling_verified:f.immersion_cooling_verified||(f.cooling_type||'').toLowerCase().includes('immersion'),cooling_evidence_type:['liquid','immersion','hybrid'].includes((f.cooling_type||'').toLowerCase())?'direct':null,facility_mw:f.facility_mw||f.mw||null,mw_verified:f.mw_verified||(f.facility_mw!=null),matched_on_pue:false,matched_on_cooling:['liquid','immersion','hybrid','direct-to-chip'].includes((f.cooling_type||'').toLowerCase()),matched_on_mw:false,matched_metric_count:['liquid','immersion','hybrid','direct-to-chip'].includes((f.cooling_type||'').toLowerCase())?1:0,qualifies_for_dataset:['liquid','immersion','hybrid','direct-to-chip'].includes((f.cooling_type||'').toLowerCase()),liquid_cooling_fit_score:60,confidence_score:60,verification_tier:'moderate',last_verified_date:'2026-04-04',source_1_url:f.source_1_url||f.source_url||null,source_1_publisher:f.source_1_publisher||null,opportunity_summary:f.opportunity_summary||f.notes||'',gpu_architecture:f.gpu_architecture||null,gpu_model:f.gpu_model||null,gpu_count:f.gpu_count||null,gpu_verified:f.gpu_verified||false,gpu_evidence_type:null,compute_vendor:f.compute_vendor||null,rack_density_kw:f.rack_density_kw||null,notes:f.notes||''}}
let added=0,skipped=0;
for(const file of['new-push1000-w12','new-canada-final-w10','new-canada-final-w10']){
const fp=path.join(__dirname,`../src/data/research/${file}.json`);
if(!fs.existsSync(fp)){console.log(`${file}: not found`);continue}
let data;try{data=JSON.parse(fs.readFileSync(fp,'utf8'))}catch(e){console.log(`${file}: error`);continue}
if(!Array.isArray(data))continue;let fa=0;
for(const raw of data){if(dup(raw)){skipped++;continue}const n=norm(raw);if(!n.latitude||!n.longitude){skipped++;continue}
if(n.country==='CA')ca.push(n);else if(n.country==='US')us.push(n);else eu.push(n);
en.add(n.facility_name.toLowerCase());eo.add((n.operator_company+'|'+n.city).toLowerCase());added++;fa++}
console.log(`${file}: ${fa} added, ${data.length-fa} skipped`)}
fs.writeFileSync(path.join(__dirname,'../src/data/research/canada-facilities.json'),JSON.stringify(ca,null,2));
fs.writeFileSync(path.join(__dirname,'../src/data/research/us-facilities.json'),JSON.stringify(us,null,2));
fs.writeFileSync(path.join(__dirname,'../src/data/research/eu-facilities.json'),JSON.stringify(eu,null,2));
const countries=[...new Set([...ca,...us,...eu].map(f=>f.country))].sort();
console.log(`\nWAVE 6: Added ${added} | Skipped ${skipped}`);
console.log(`CA: ${ca.length} | US: ${us.length} | EU/Global: ${eu.length}`);
console.log(`GRAND TOTAL: ${ca.length+us.length+eu.length} | Countries: ${countries.length}`);
