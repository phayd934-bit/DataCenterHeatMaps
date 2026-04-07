const KNOWN_ZONES = new Set([
  'us-federal',
  'us-va',
  'us-tx',
  'us-ca',
  'us-or',
  'us-il',
  'ca-federal',
  'ca-on',
  'ca-qc',
  'ca-bc',
  'ca-ab',
  'eu-wide',
  'eu-de',
  'eu-nl',
  'eu-ie',
  'eu-se',
  'eu-fr',
  'eu-gb',
  'eu-no',
  'eu-fi',
  'eu-is',
  'eu-dk',
  'eu-es',
  'eu-it',
  'eu-pl',
  'eu-pt',
  'eu-ch',
  'apac-jp',
  'apac-kr',
  'apac-sg',
  'apac-au',
  'me-sa',
  'me-ae',
  'apac-in',
  'latam-br',
  'eu-tr',
])

const DIRECT_ZONE_MAP = {
  'eu-germany': 'eu-de',
  'eu-united kingdom': 'eu-gb',
  'eu-uk': 'eu-gb',
  'eu-france': 'eu-fr',
  'eu-sweden': 'eu-se',
  'eu-norway': 'eu-no',
  'eu-finland': 'eu-fi',
  'eu-denmark': 'eu-dk',
  'eu-spain': 'eu-es',
  'eu-italy': 'eu-it',
  'eu-poland': 'eu-pl',
  'eu-portugal': 'eu-pt',
  'eu-switzerland': 'eu-ch',
  'eu-netherlands': 'eu-nl',
  'eu-ireland': 'eu-ie',
  'eu-japan': 'apac-jp',
  'eu-jp': 'apac-jp',
  'eu-south korea': 'apac-kr',
  'eu-kr': 'apac-kr',
  'eu-singapore': 'apac-sg',
  'eu-sg': 'apac-sg',
  'eu-australia': 'apac-au',
  'eu-au': 'apac-au',
  'eu-india': 'apac-in',
  'eu-in': 'apac-in',
  'eu-saudi arabia': 'me-sa',
  'eu-sa': 'me-sa',
  'eu-united arab emirates': 'me-ae',
  'eu-uae': 'me-ae',
  'eu-ae': 'me-ae',
  'eu-brazil': 'latam-br',
  'eu-br': 'latam-br',
  'eu-turkey': 'eu-tr',
}

const US_ZONE_BY_REGION = {
  virginia: 'us-va',
  texas: 'us-tx',
  california: 'us-ca',
  oregon: 'us-or',
  illinois: 'us-il',
}

const CANADA_ZONE_BY_REGION = {
  ontario: 'ca-on',
  quebec: 'ca-qc',
  'british columbia': 'ca-bc',
  alberta: 'ca-ab',
}

const COUNTRY_ZONE_MAP = {
  gb: 'eu-gb',
  'united kingdom': 'eu-gb',
  de: 'eu-de',
  germany: 'eu-de',
  fr: 'eu-fr',
  france: 'eu-fr',
  se: 'eu-se',
  sweden: 'eu-se',
  no: 'eu-no',
  norway: 'eu-no',
  fi: 'eu-fi',
  finland: 'eu-fi',
  dk: 'eu-dk',
  denmark: 'eu-dk',
  es: 'eu-es',
  spain: 'eu-es',
  it: 'eu-it',
  italy: 'eu-it',
  pl: 'eu-pl',
  poland: 'eu-pl',
  pt: 'eu-pt',
  portugal: 'eu-pt',
  ch: 'eu-ch',
  switzerland: 'eu-ch',
  nl: 'eu-nl',
  netherlands: 'eu-nl',
  ie: 'eu-ie',
  ireland: 'eu-ie',
  jp: 'apac-jp',
  japan: 'apac-jp',
  kr: 'apac-kr',
  'south korea': 'apac-kr',
  sg: 'apac-sg',
  singapore: 'apac-sg',
  au: 'apac-au',
  australia: 'apac-au',
  in: 'apac-in',
  india: 'apac-in',
  sa: 'me-sa',
  'saudi arabia': 'me-sa',
  ae: 'me-ae',
  uae: 'me-ae',
  'united arab emirates': 'me-ae',
  br: 'latam-br',
  brazil: 'latam-br',
  tr: 'eu-tr',
  turkey: 'eu-tr',
  eu: 'eu-wide',
}

const EU_WIDE_COUNTRIES = new Set([
  'at', 'austria', 'be', 'belgium', 'bg', 'bulgaria', 'hr', 'croatia', 'cy', 'cyprus', 'cz',
  'czech republic', 'czechia', 'ee', 'estonia', 'el', 'gr', 'greece', 'hu', 'hungary', 'lt',
  'lithuania', 'lu', 'luxembourg', 'lv', 'latvia', 'mt', 'malta', 'ro', 'romania', 'si',
  'slovenia', 'sk', 'slovakia',
])

const SUPPLEMENTARY_NAME_PATTERNS = [
  /\bpending\b/i,
  /\bvetoed\b/i,
  /\bstudy\b/i,
  /\bguide\b/i,
  /\bguidance\b/i,
  /\bcall for application\b/i,
  /\bcall for power\b/i,
  /\bstrategy\b/i,
  /\benergy star\b/i,
  /\bgreen mark\b/i,
  /\bnabers\b/i,
  /\bcsa z243/i,
  /\bss 564\b/i,
  /\bss 697\b/i,
  /\bss 715\b/i,
]

const SUPPLEMENTARY_SUMMARY_PATTERNS = [
  /\bnot legally binding\b/i,
  /\bvoluntary\b/i,
  /\bif enacted\b/i,
  /\bwould require\b/i,
  /\bwould have required\b/i,
  /\bsignals regulatory trajectory\b/i,
  /\bproposed\b/i,
  /\bconsultation\b/i,
]

function normalize(value) {
  return String(value || '').trim().toLowerCase()
}

export function resolveRegulatoryZone(facility) {
  const currentZone = normalize(facility?.regulatory_zone)
  const country = normalize(facility?.country)
  const region = normalize(facility?.region)

  if (DIRECT_ZONE_MAP[currentZone]) return DIRECT_ZONE_MAP[currentZone]
  if (KNOWN_ZONES.has(currentZone)) return currentZone

  if (country === 'us' || country === 'united states') {
    return US_ZONE_BY_REGION[region] || 'us-federal'
  }

  if (country === 'ca' || country === 'canada') {
    return CANADA_ZONE_BY_REGION[region] || 'ca-federal'
  }

  if (COUNTRY_ZONE_MAP[country]) return COUNTRY_ZONE_MAP[country]
  if (EU_WIDE_COUNTRIES.has(country)) return 'eu-wide'

  return null
}

export function isSupplementaryRegulation(regulation) {
  if (!regulation) return false
  if (regulation.category === 'tax_incentive') return true

  const name = regulation.name || ''
  const summary = regulation.summary || ''

  if (SUPPLEMENTARY_NAME_PATTERNS.some((pattern) => pattern.test(name))) return true
  if (SUPPLEMENTARY_SUMMARY_PATTERNS.some((pattern) => pattern.test(summary))) return true

  return false
}
