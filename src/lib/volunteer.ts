import { getPayload, type Payload } from 'payload'
import { unstable_cache } from 'next/cache'
import config from '@payload-config'
import type { Project } from '@/payload/payload-types'

export type VolunteerProjectNavItem = {
  slug: string
  title: string
  location: string
}

type Locale = 'en' | 'fr'

const VOLUNTEER_NAV_REVALIDATE_SECONDS = 300

export const getCachedProjectsWithVolunteerNeeds = unstable_cache(
  async (locale: Locale) => {
    const payload = await getPayload({ config })
    return getProjectsWithVolunteerNeeds(payload, locale)
  },
  ['volunteer-nav-projects'],
  {
    revalidate: VOLUNTEER_NAV_REVALIDATE_SECONDS,
    tags: ['volunteer-nav'],
  },
)

export async function getProjectsWithVolunteerNeeds(
  payload: Payload,
  locale: Locale,
): Promise<VolunteerProjectNavItem[]> {
  const { docs: needs } = await payload.find({
    collection: 'volunteer-needs',
    where: { _status: { equals: 'published' } },
    locale,
    fallbackLocale: 'en',
    depth: 1,
    limit: 500,
  })

  const byId = new Map<string, VolunteerProjectNavItem>()

  for (const need of needs) {
    const project = need.project
    if (!project || typeof project === 'string') continue

    const p = project as Project
    if (!p.slug || !p.title) continue

    byId.set(p.id, {
      slug: p.slug,
      title: p.title,
      location: p.location ?? '',
    })
  }

  return Array.from(byId.values()).sort((a, b) => a.title.localeCompare(b.title))
}

export async function getVolunteerNeedsForProject(
  payload: Payload,
  projectId: string,
  locale: Locale,
) {
  const { docs } = await payload.find({
    collection: 'volunteer-needs',
    where: {
      project: { equals: projectId },
      _status: { equals: 'published' },
    },
    locale,
    fallbackLocale: 'en',
    sort: 'roleName',
    limit: 100,
  })

  return docs
}
