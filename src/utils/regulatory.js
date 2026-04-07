import usRegulatory from '../data/regulatory/us.json'
import canadaRegulatory from '../data/regulatory/canada.json'
import euRegulatory from '../data/regulatory/eu.json'
import apacRegulatory from '../data/regulatory/new-apac-reg.json'
import emergingRegulatory from '../data/regulatory/new-emerging-reg.json'
import euSouthRegulatory from '../data/regulatory/new-eu-south-reg.json'
import nordicsUkRegulatory from '../data/regulatory/new-nordics-uk-reg.json'

const allZones = [...usRegulatory, ...canadaRegulatory, ...euRegulatory, ...apacRegulatory, ...emergingRegulatory, ...euSouthRegulatory, ...nordicsUkRegulatory]

const zoneIndex = Object.fromEntries(allZones.map((z) => [z.zone_id, z]))

const FALLBACK = {
  US: 'us-federal',
  CA: 'ca-federal',
  DE: 'eu-de', NL: 'eu-nl', IE: 'eu-ie', SE: 'eu-se', FR: 'eu-fr',
  GB: 'eu-gb', NO: 'eu-no', FI: 'eu-fi', IS: 'eu-is', DK: 'eu-dk',
  ES: 'eu-es', IT: 'eu-it', PL: 'eu-pl', PT: 'eu-pt', CH: 'eu-ch',
  TR: 'eu-tr',
  JP: 'apac-jp', KR: 'apac-kr', SG: 'apac-sg', AU: 'apac-au',
  IN: 'apac-in',
  SA: 'me-sa', AE: 'me-ae',
  BR: 'latam-br',
}

export function resolveRegulatoryZone(facility) {
  const zoneId = facility.regulatory_zone
  if (zoneId && zoneIndex[zoneId]) return zoneId

  const country = facility.country
  if (country && FALLBACK[country]) return FALLBACK[country]

  if (country === 'US') return 'us-federal'
  if (country === 'CA') return 'ca-federal'

  return 'eu-wide'
}

export function isSupplementaryRegulation(reg) {
  return reg.level === 'agency' || reg.level === 'local'
}
