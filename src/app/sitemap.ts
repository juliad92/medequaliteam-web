import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

import { getSiteUrl, LOCALES, localizedHref } from '@/lib/seo'
import { getProjectsWithVolunteerNeeds } from '@/lib/volunteer'

/** Public marketing paths that exist for every locale (no CMS slug). */
const STATIC_PATHS: Array<{
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}> = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/about/why-we-exist', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/about/organisation', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/about/meet-team', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/projects', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/donate', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/volunteer/stories', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/financial-report', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/data-protection', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/complaints', changeFrequency: 'yearly', priority: 0.4 },
]

function absoluteUrl(locale: string, path: string): string {
  return `${getSiteUrl()}${localizedHref(locale, path)}`
}

function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const locale of LOCALES) {
    languages[locale] = absoluteUrl(locale, path)
  }
  languages['x-default'] = absoluteUrl('en', path)
  return languages
}

function sitemapEntry(
  path: string,
  options: {
    lastModified?: Date
    changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency']
    priority?: number
  } = {},
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl('en', path),
    lastModified: options.lastModified ?? new Date(),
    changeFrequency: options.changeFrequency,
    priority: options.priority,
    alternates: {
      languages: languageAlternates(path),
    },
  }
}

async function getDynamicPaths(): Promise<
  Array<{
    path: string
    lastModified?: Date
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
    priority: number
  }>
> {
  try {
    const payload = await getPayload({ config })

    const [{ docs: projects }, { docs: stories }, volunteerProjects] = await Promise.all([
      payload.find({
        collection: 'projects',
        where: { _status: { equals: 'published' } },
        locale: 'en',
        fallbackLocale: 'en',
        depth: 0,
        limit: 200,
        select: { slug: true, updatedAt: true },
      }),
      payload.find({
        collection: 'testimonials',
        locale: 'en',
        fallbackLocale: 'en',
        depth: 0,
        limit: 200,
        select: { slug: true, updatedAt: true, publishedAt: true },
      }),
      getProjectsWithVolunteerNeeds(payload, 'en'),
    ])

    const dynamic: Array<{
      path: string
      lastModified?: Date
      changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
      priority: number
    }> = []

    for (const project of projects) {
      if (!project.slug) continue
      dynamic.push({
        path: `/projects/${project.slug}`,
        lastModified: project.updatedAt ? new Date(project.updatedAt) : undefined,
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }

    for (const project of volunteerProjects) {
      dynamic.push({
        path: `/volunteer/${project.slug}`,
        changeFrequency: 'weekly',
        priority: 0.85,
      })
    }

    for (const story of stories) {
      if (!story.slug) continue
      const lastModified = story.updatedAt
        ? new Date(story.updatedAt)
        : story.publishedAt
          ? new Date(story.publishedAt)
          : undefined
      dynamic.push({
        path: `/volunteer/stories/${story.slug}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }

    return dynamic
  } catch {
    // Build/preview without a reachable DB should still emit static URLs.
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dynamicPaths = await getDynamicPaths()

  return [
    ...STATIC_PATHS.map(({ path, changeFrequency, priority }) =>
      sitemapEntry(path, { changeFrequency, priority }),
    ),
    ...dynamicPaths.map(({ path, lastModified, changeFrequency, priority }) =>
      sitemapEntry(path, { lastModified, changeFrequency, priority }),
    ),
  ]
}
