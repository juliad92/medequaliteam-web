type PermanentRedirect = {
  source: string
  destination: string
  permanent: true
}

const LOCALES = 'en|fr'

type RedirectRule = {
  /** Path after the locale segment, e.g. `/news` or `/volunteer/:projectSlug/:path+`. */
  source: string
  /** Destination path; may include `:locale` and other matched params. */
  destination: string
}

/**
 * Legacy Django → Next.js URL map (permanent 308).
 * Covers removed sections (news, contact-us), renamed paths, volunteer role
 * subpaths, nested project URLs, and trailing-slash variants.
 */
const LOCALE_RULES: RedirectRule[] = [
  // Removed / renamed top-level pages
  { source: '/news', destination: '/:locale' },
  { source: '/news/:path+', destination: '/:locale' },
  { source: '/contact-us', destination: '/:locale' },
  { source: '/acknowledgements', destination: '/:locale/about/organisation' },
  { source: '/just-dummy-page', destination: '/:locale' },

  // About hub (old site had /about/ index)
  { source: '/about', destination: '/:locale/about/why-we-exist' },

  // Donate legacy paths
  { source: '/donate/donate-funds', destination: '/:locale/donate' },
  { source: '/donate/financial_report', destination: '/:locale/financial-report' },
  { source: '/donate/financial-report', destination: '/:locale/financial-report' },

  // Volunteer: stories used to live under feedback-volunteers
  { source: '/volunteer/feedback-volunteers', destination: '/:locale/volunteer/stories' },
  {
    source: '/volunteer/feedback-volunteers/:slug',
    destination: '/:locale/volunteer/stories/:slug',
  },

  // Volunteer index → stories hub (no bare /volunteer page in the rebuild)
  { source: '/volunteer', destination: '/:locale/volunteer/stories' },

  // Role subpaths under a project (e.g. /volunteer/volunteer_greece/medical-doctor).
  // Exclude `stories` so /volunteer/stories/:slug is not collapsed.
  {
    source: '/volunteer/:projectSlug((?!stories)[^/]+)/:path+',
    destination: '/:locale/volunteer/:projectSlug',
  },

  // Projects: removed listing / nested CMS pages from the old site
  { source: '/projects/past-projects', destination: '/:locale/projects' },
  { source: '/projects/clinic', destination: '/:locale/projects' },
  { source: '/projects/clinic/:path+', destination: '/:locale/projects' },
  {
    source: '/projects/:slug/:path+',
    destination: '/:locale/projects/:slug',
  },
]

function withTrailingSlashVariants(rule: PermanentRedirect): PermanentRedirect[] {
  const { source, destination, permanent } = rule
  if (source.endsWith('/') || source.includes(':path')) {
    return [{ source, destination, permanent }]
  }
  return [
    { source, destination, permanent },
    { source: `${source}/`, destination, permanent },
  ]
}

function expandLocaleRules(): PermanentRedirect[] {
  const redirects: PermanentRedirect[] = []

  for (const rule of LOCALE_RULES) {
    const source = `/:locale(${LOCALES})${rule.source}`
    const destination = rule.destination

    for (const variant of withTrailingSlashVariants({
      source,
      destination,
      permanent: true,
    })) {
      redirects.push(variant)
    }
  }

  // Unprefixed legacy URLs (bookmarks / external links without /en|/fr)
  const unprefixed: Array<{ source: string; destination: string }> = [
    { source: '/news', destination: '/en' },
    { source: '/news/:path+', destination: '/en' },
    { source: '/contact-us', destination: '/en' },
    { source: '/acknowledgements', destination: '/en/about/organisation' },
    { source: '/just-dummy-page', destination: '/en' },
    { source: '/about', destination: '/en/about/why-we-exist' },
    { source: '/volunteer', destination: '/en/volunteer/stories' },
    { source: '/volunteer/feedback-volunteers', destination: '/en/volunteer/stories' },
    {
      source: '/volunteer/feedback-volunteers/:slug',
      destination: '/en/volunteer/stories/:slug',
    },
    { source: '/donate/donate-funds', destination: '/en/donate' },
    { source: '/donate/financial_report', destination: '/en/financial-report' },
    { source: '/projects/past-projects', destination: '/en/projects' },
    { source: '/projects/clinic', destination: '/en/projects' },
    { source: '/projects/clinic/:path+', destination: '/en/projects' },
  ]

  for (const rule of unprefixed) {
    for (const variant of withTrailingSlashVariants({
      ...rule,
      permanent: true,
    })) {
      redirects.push(variant)
    }
  }

  return redirects
}

/** Permanent redirects for cutover from the legacy Django site. */
export function getRedirects(): PermanentRedirect[] {
  return [{ source: '/', destination: '/en', permanent: true }, ...expandLocaleRules()]
}
