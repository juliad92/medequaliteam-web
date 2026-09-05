import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import config from '@payload-config'

export type ProjectNavItem = {
  slug: string
  title: string
  status: 'active' | 'past' | 'upcoming'
}

type Locale = 'en' | 'fr'

const PROJECTS_NAV_REVALIDATE_SECONDS = 300

const STATUS_ORDER: Record<ProjectNavItem['status'], number> = {
  active: 0,
  upcoming: 1,
  past: 2,
}

export const getCachedProjectsForNav = unstable_cache(
  async (locale: Locale): Promise<ProjectNavItem[]> => {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'projects',
      where: { _status: { equals: 'published' } },
      locale,
      fallbackLocale: 'en',
      depth: 0,
      limit: 100,
      sort: '-dateStart',
    })

    return docs
      .filter((p): p is typeof p & { slug: string; title: string } => Boolean(p.slug && p.title))
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        status: p.status,
      }))
      .sort((a, b) => {
        const byStatus = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
        if (byStatus !== 0) return byStatus
        return a.title.localeCompare(b.title)
      })
  },
  ['projects-nav'],
  {
    revalidate: PROJECTS_NAV_REVALIDATE_SECONDS,
    tags: ['projects-nav'],
  },
)
