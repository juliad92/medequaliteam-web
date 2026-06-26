export type DonateCountryCode = 'FR' | 'US' | 'DE' | 'BE' | 'CH' | 'GB' | 'OTHER'

export type DonateFrequency = 'once' | 'monthly' | 'yearly'

export type DonateCountryConfig = {
  currency: string
  symbol: string
  deductionRate: number
  platform: string
  url: string | null
  dualChannelAlt: 'givingEurope' | 'platform' | null
}

export const GIVING_EUROPE_URL = 'https://giving.eu/organisations/medequaliteam/'

export type DonationChannel = 'helloasso' | 'local'

export type GivingEuropeCountryCode = 'BE' | 'CH' | 'GB'

export type LocalPlatformCountryCode = 'US' | 'DE'

export function isGivingEuropeCountry(
  country: DonateCountryCode,
): country is GivingEuropeCountryCode {
  return country === 'BE' || country === 'CH' || country === 'GB'
}

export function isLocalPlatformCountry(
  country: DonateCountryCode,
): country is LocalPlatformCountryCode {
  return country === 'US' || country === 'DE'
}

export function offersDualDonationChannel(country: DonateCountryCode): boolean {
  return DONATE_COUNTRY_CONFIG[country].dualChannelAlt !== null
}

export const DONATE_PRESET_AMOUNTS = [15, 30, 50, 100, 200, 500] as const

export const DONATE_COUNTRY_CONFIG: Record<DonateCountryCode, DonateCountryConfig> = {
  FR: {
    currency: 'EUR',
    symbol: '€',
    deductionRate: 0.66,
    platform: 'HelloAsso',
    url: 'https://www.helloasso.com/associations/med-equaliteam/formulaires/4/widget?view=form',
    dualChannelAlt: null,
  },
  US: {
    currency: 'USD',
    symbol: '$',
    deductionRate: 0.37,
    platform: 'Friends of Fondation de France',
    url: 'https://donorbox.org/med-equali-team/',
    dualChannelAlt: 'platform',
  },
  DE: {
    currency: 'EUR',
    symbol: '€',
    deductionRate: 0.45,
    platform: 'Maecenata Foundation',
    url: 'http://www.spenden.maecenata.eu/',
    dualChannelAlt: 'platform',
  },
  BE: {
    currency: 'EUR',
    symbol: '€',
    deductionRate: 0.45,
    platform: 'Giving Europe',
    url: GIVING_EUROPE_URL,
    dualChannelAlt: 'givingEurope',
  },
  CH: {
    currency: 'CHF',
    symbol: 'CHF ',
    deductionRate: 0.35,
    platform: 'Giving Europe',
    url: null,
    dualChannelAlt: 'givingEurope',
  },
  GB: {
    currency: 'GBP',
    symbol: '£',
    deductionRate: 0.25,
    platform: 'Giving Europe',
    url: GIVING_EUROPE_URL,
    dualChannelAlt: 'givingEurope',
  },
  OTHER: {
    currency: 'EUR',
    symbol: '€',
    deductionRate: 0,
    platform: 'HelloAsso',
    url: 'https://www.helloasso.com/associations/med-equaliteam/formulaires/4',
    dualChannelAlt: null,
  },
}

export const HELLOASSO_FORM_URL =
  'https://www.helloasso.com/associations/med-equaliteam/formulaires/4'

export function getHelloAssoWidgetUrl(formUrl: string = HELLOASSO_FORM_URL): string {
  return `${formUrl.replace(/\/$/, '')}/widget`
}

export const PAYPAL_URL =
  'https://www.paypal.com/donate?token=SLZ07JDHY5MqlqcCMbLj81syk3K4c-PjYl8iDYepQSx9JdgnG96bzP5WwrlXAXNRAZvyfRiC1N5YmHOe'
export const DONATE_EMAIL = 'donate@medequali.team'

export function getImpactLabel(amount: number, locale: string): string {
  const labels =
    locale === 'fr'
      ? {
          consultation: '1 consultation',
          consultations: '2 consultations',
          medicine: 'médicaments enfant',
          family: 'kit famille',
          emergency: 'kit urgence',
          month: '1 mois terrain',
        }
      : {
          consultation: '1 consultation',
          consultations: '2 consultations',
          medicine: "child's medicine",
          family: 'family kit',
          emergency: 'emergency kit',
          month: 'full month ops',
        }

  if (amount <= 15) return labels.consultation
  if (amount <= 30) return labels.consultations
  if (amount <= 50) return labels.medicine
  if (amount <= 100) return labels.family
  if (amount <= 200) return labels.emergency
  return labels.month
}
