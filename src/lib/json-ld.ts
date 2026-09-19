import { getSiteUrl, localizedHref, SITE_NAME } from '@/lib/seo'

const SAME_AS = [
  'https://facebook.com/MedEqualiTeam',
  'https://x.com/equalimed',
  'https://instagram.com/medequaliteam',
] as const

const DESCRIPTION_EN =
  "Medical NGO providing free primary healthcare for refugees and displaced populations. Volunteer-powered and crowdfunded; 100% of donations go to operations."

const DESCRIPTION_FR =
  "ONG médicale fournissant des soins de santé primaires gratuits aux réfugiés et personnes déplacées. Financée par le crowdfunding et portée par des bénévoles ; 100 % des dons vont aux opérations."

export type BreadcrumbItem = {
  name: string
  /** Path without locale prefix, e.g. `/donate` or `''` for home. */
  path: string
}

/** NGO + WebSite graph for the locale layout. */
export function organizationAndWebsiteJsonLd(locale: string) {
  const siteUrl = getSiteUrl()
  const homeUrl = `${siteUrl}${localizedHref(locale)}`
  const description = locale === 'fr' ? DESCRIPTION_FR : DESCRIPTION_EN
  const organizationId = `${siteUrl}/#organization`
  const websiteGraphId = `${siteUrl}/#website`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'NGO',
        '@id': organizationId,
        name: SITE_NAME,
        legalName: SITE_NAME,
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
        image: `${siteUrl}/logo.png`,
        email: 'info@medequali.team',
        description,
        foundingDate: '2018',
        identifier: 'W102001158',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '867 route de Dorjon',
          addressLocality: 'Megevette',
          postalCode: '74490',
          addressCountry: 'FR',
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            email: 'info@medequali.team',
            contactType: 'customer support',
            availableLanguage: ['English', 'French'],
          },
          {
            '@type': 'ContactPoint',
            email: 'volunteer@medequali.team',
            contactType: 'volunteer coordination',
            availableLanguage: ['English', 'French'],
          },
        ],
        sameAs: [...SAME_AS],
      },
      {
        '@type': 'WebSite',
        '@id': websiteGraphId,
        name: SITE_NAME,
        url: siteUrl,
        inLanguage: ['en', 'fr'],
        publisher: { '@id': organizationId },
        about: { '@id': organizationId },
        mainEntity: { '@id': organizationId },
        potentialAction: {
          '@type': 'ReadAction',
          target: homeUrl,
        },
      },
    ],
  }
}

/** BreadcrumbList for nested public routes. */
export function breadcrumbJsonLd(locale: string, items: BreadcrumbItem[]) {
  const siteUrl = getSiteUrl()
  const homeName = locale === 'fr' ? 'Accueil' : 'Home'

  const crumbs: BreadcrumbItem[] = [{ name: homeName, path: '' }, ...items]

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${localizedHref(locale, item.path)}`,
    })),
  }
}
