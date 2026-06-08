export type PhoneCountryCodeOption = {
  code: string
  name: { en: string; fr: string }
}

/** Common dial codes for volunteer applicants (Europe, MENA, and frequent origins). */
export const PHONE_COUNTRY_CODES: PhoneCountryCodeOption[] = [
  { code: '+30', name: { en: 'Greece', fr: 'Grèce' } },
  { code: '+33', name: { en: 'France', fr: 'France' } },
  { code: '+49', name: { en: 'Germany', fr: 'Allemagne' } },
  { code: '+44', name: { en: 'United Kingdom', fr: 'Royaume-Uni' } },
  { code: '+39', name: { en: 'Italy', fr: 'Italie' } },
  { code: '+34', name: { en: 'Spain', fr: 'Espagne' } },
  { code: '+31', name: { en: 'Netherlands', fr: 'Pays-Bas' } },
  { code: '+32', name: { en: 'Belgium', fr: 'Belgique' } },
  { code: '+41', name: { en: 'Switzerland', fr: 'Suisse' } },
  { code: '+43', name: { en: 'Austria', fr: 'Autriche' } },
  { code: '+46', name: { en: 'Sweden', fr: 'Suède' } },
  { code: '+47', name: { en: 'Norway', fr: 'Norvège' } },
  { code: '+45', name: { en: 'Denmark', fr: 'Danemark' } },
  { code: '+358', name: { en: 'Finland', fr: 'Finlande' } },
  { code: '+48', name: { en: 'Poland', fr: 'Pologne' } },
  { code: '+351', name: { en: 'Portugal', fr: 'Portugal' } },
  { code: '+353', name: { en: 'Ireland', fr: 'Irlande' } },
  { code: '+1', name: { en: 'United States / Canada', fr: 'États-Unis / Canada' } },
  { code: '+61', name: { en: 'Australia', fr: 'Australie' } },
  { code: '+90', name: { en: 'Turkey', fr: 'Turquie' } },
  { code: '+963', name: { en: 'Syria', fr: 'Syrie' } },
  { code: '+964', name: { en: 'Iraq', fr: 'Irak' } },
  { code: '+98', name: { en: 'Iran', fr: 'Iran' } },
  { code: '+93', name: { en: 'Afghanistan', fr: 'Afghanistan' } },
  { code: '+92', name: { en: 'Pakistan', fr: 'Pakistan' } },
  { code: '+20', name: { en: 'Egypt', fr: 'Égypte' } },
  { code: '+961', name: { en: 'Lebanon', fr: 'Liban' } },
  { code: '+962', name: { en: 'Jordan', fr: 'Jordanie' } },
  { code: '+972', name: { en: 'Israel', fr: 'Israël' } },
  { code: '+212', name: { en: 'Morocco', fr: 'Maroc' } },
  { code: '+216', name: { en: 'Tunisia', fr: 'Tunisie' } },
  { code: '+213', name: { en: 'Algeria', fr: 'Algérie' } },
  { code: '+91', name: { en: 'India', fr: 'Inde' } },
  { code: '+55', name: { en: 'Brazil', fr: 'Brésil' } },
  { code: '+27', name: { en: 'South Africa', fr: 'Afrique du Sud' } },
  { code: '+380', name: { en: 'Ukraine', fr: 'Ukraine' } },
  { code: '+40', name: { en: 'Romania', fr: 'Roumanie' } },
  { code: '+36', name: { en: 'Hungary', fr: 'Hongrie' } },
  { code: '+420', name: { en: 'Czech Republic', fr: 'Tchéquie' } },
].sort((a, b) => {
  const numA = Number(a.code.replace(/\D/g, ''))
  const numB = Number(b.code.replace(/\D/g, ''))
  if (numA !== numB) return numA - numB
  return a.name.en.localeCompare(b.name.en)
})

export function formatPhoneCountryCodeOption(option: PhoneCountryCodeOption, locale: string): string {
  const name = locale === 'fr' ? option.name.fr : option.name.en
  return `${option.code} (${name})`
}
