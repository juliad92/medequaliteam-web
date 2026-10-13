import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  Payload,
  PayloadRequest,
} from 'payload'

import { CACHE_TAGS } from './cache.ts'
import type { Page, Project, Testimonial, VolunteerNeed } from '../payload/payload-types.ts'

const LOCALES = ['en', 'fr'] as const

function canRevalidate(context: PayloadRequest['context'] | undefined): boolean {
  return context?.disableRevalidate !== true
}

/** For draft-enabled collections: only live when `_status === 'published'`. */
function isDraftCollectionPublished(
  doc: { _status?: 'draft' | 'published' | null } | null | undefined,
): boolean {
  return doc?._status === 'published'
}

function normalizePath(path: string): string {
  if (!path || path === '/') return ''
  return path.startsWith('/') ? path : `/${path}`
}

function localizedHref(locale: string, path: string): string {
  return `/${locale}${normalizePath(path)}`
}

/** Lazy-load so Payload CLI (`generate:types`) does not resolve Next at config import time. */
async function nextCache() {
  return import('next/cache')
}

/** Revalidate a marketing path for every locale (`/en/...`, `/fr/...`). */
export async function revalidateLocalizedPath(path: string): Promise<void> {
  const { revalidatePath } = await nextCache()
  const normalized = normalizePath(path)
  for (const locale of LOCALES) {
    revalidatePath(localizedHref(locale, normalized))
  }
}

async function revalidateSitemap(): Promise<void> {
  const { revalidatePath } = await nextCache()
  revalidatePath('/sitemap.xml')
}

async function revalidateTag(tag: string): Promise<void> {
  const { revalidateTag: revalidate } = await nextCache()
  revalidate(tag)
}

async function revalidateProjectSurfaces(slug: string): Promise<void> {
  await revalidateLocalizedPath(`/projects/${slug}`)
  await revalidateLocalizedPath(`/volunteer/${slug}`)
  await revalidateLocalizedPath('/projects')
  await revalidateLocalizedPath('')
  await revalidateTag(CACHE_TAGS.projectsNav)
  await revalidateTag(CACHE_TAGS.volunteerNav)
  await revalidateSitemap()
}

async function resolveProjectSlug(
  payload: Payload,
  project: VolunteerNeed['project'] | Testimonial['project'],
): Promise<string | null> {
  if (!project) return null
  if (typeof project === 'object' && 'slug' in project && project.slug) {
    return project.slug
  }

  const id = typeof project === 'object' ? project.id : project
  if (!id) return null

  try {
    const doc = await payload.findByID({
      collection: 'projects',
      id,
      depth: 0,
      select: { slug: true },
    })
    return doc.slug ?? null
  } catch {
    return null
  }
}

export const revalidateProjectAfterChange: CollectionAfterChangeHook<Project> = async ({
  doc,
  previousDoc,
  req: { context, payload },
}) => {
  if (!canRevalidate(context)) return doc

  const publishedNow = isDraftCollectionPublished(doc)
  const wasPublished = isDraftCollectionPublished(previousDoc)

  if (publishedNow) {
    payload.logger.info(`Revalidating project "${doc.slug}"`)
    await revalidateProjectSurfaces(doc.slug)
    if (wasPublished && previousDoc?.slug && previousDoc.slug !== doc.slug) {
      await revalidateLocalizedPath(`/projects/${previousDoc.slug}`)
      await revalidateLocalizedPath(`/volunteer/${previousDoc.slug}`)
    }
  } else if (wasPublished && previousDoc?.slug) {
    payload.logger.info(`Revalidating unpublished project "${previousDoc.slug}"`)
    await revalidateProjectSurfaces(previousDoc.slug)
  }

  return doc
}

export const revalidateProjectAfterDelete: CollectionAfterDeleteHook<Project> = async ({
  doc,
  req: { context, payload },
}) => {
  if (!canRevalidate(context) || !doc?.slug || !isDraftCollectionPublished(doc)) return doc

  payload.logger.info(`Revalidating deleted project "${doc.slug}"`)
  await revalidateProjectSurfaces(doc.slug)
  return doc
}

export const revalidateVolunteerNeedAfterChange: CollectionAfterChangeHook<VolunteerNeed> = async ({
  doc,
  previousDoc,
  req: { context, payload },
}) => {
  if (!canRevalidate(context)) return doc

  const publishedNow = isDraftCollectionPublished(doc)
  const wasPublished = isDraftCollectionPublished(previousDoc)
  if (!publishedNow && !wasPublished) return doc

  const slugs = new Set<string>()
  const currentSlug = await resolveProjectSlug(payload, doc.project)
  const previousSlug = await resolveProjectSlug(payload, previousDoc?.project)
  if (currentSlug) slugs.add(currentSlug)
  if (previousSlug) slugs.add(previousSlug)

  payload.logger.info(
    `Revalidating volunteer needs for project(s): ${[...slugs].join(', ') || '(none)'}`,
  )
  await revalidateTag(CACHE_TAGS.volunteerNav)
  for (const slug of slugs) {
    await revalidateLocalizedPath(`/volunteer/${slug}`)
  }
  await revalidateSitemap()

  return doc
}

export const revalidateVolunteerNeedAfterDelete: CollectionAfterDeleteHook<VolunteerNeed> = async ({
  doc,
  req: { context, payload },
}) => {
  if (!canRevalidate(context) || !isDraftCollectionPublished(doc)) return doc

  const slug = await resolveProjectSlug(payload, doc?.project)
  await revalidateTag(CACHE_TAGS.volunteerNav)
  if (slug) await revalidateLocalizedPath(`/volunteer/${slug}`)
  await revalidateSitemap()
  return doc
}

export const revalidateTestimonialAfterChange: CollectionAfterChangeHook<Testimonial> = async ({
  doc,
  previousDoc,
  req: { context, payload },
}) => {
  if (!canRevalidate(context)) return doc

  payload.logger.info(`Revalidating volunteer story "${doc.slug}"`)
  await revalidateLocalizedPath('/volunteer/stories')
  if (doc.slug) await revalidateLocalizedPath(`/volunteer/stories/${doc.slug}`)
  if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
    await revalidateLocalizedPath(`/volunteer/stories/${previousDoc.slug}`)
  }
  await revalidateTag(CACHE_TAGS.volunteerNav)
  await revalidateSitemap()
  return doc
}

export const revalidateTestimonialAfterDelete: CollectionAfterDeleteHook<Testimonial> = async ({
  doc,
  req: { context },
}) => {
  if (!canRevalidate(context)) return doc

  await revalidateLocalizedPath('/volunteer/stories')
  if (doc?.slug) await revalidateLocalizedPath(`/volunteer/stories/${doc.slug}`)
  await revalidateTag(CACHE_TAGS.volunteerNav)
  await revalidateSitemap()
  return doc
}

export const revalidatePageAfterChange: CollectionAfterChangeHook<Page> = async ({
  doc,
  previousDoc,
  req: { context, payload },
}) => {
  if (!canRevalidate(context)) return doc

  const publishedNow = isDraftCollectionPublished(doc)
  const wasPublished = isDraftCollectionPublished(previousDoc)

  if (publishedNow) {
    payload.logger.info(`Revalidating page "${doc.slug}"`)
    await revalidateLocalizedPath(doc.slug)
    if (wasPublished && previousDoc?.slug && previousDoc.slug !== doc.slug) {
      await revalidateLocalizedPath(previousDoc.slug)
    }
    await revalidateSitemap()
  } else if (wasPublished && previousDoc?.slug) {
    payload.logger.info(`Revalidating unpublished page "${previousDoc.slug}"`)
    await revalidateLocalizedPath(previousDoc.slug)
    await revalidateSitemap()
  }

  return doc
}

export const revalidatePageAfterDelete: CollectionAfterDeleteHook<Page> = async ({
  doc,
  req: { context, payload },
}) => {
  if (!canRevalidate(context) || !doc?.slug || !isDraftCollectionPublished(doc)) return doc

  payload.logger.info(`Revalidating deleted page "${doc.slug}"`)
  await revalidateLocalizedPath(doc.slug)
  await revalidateSitemap()
  return doc
}

export const revalidateHomepageAfterChange: GlobalAfterChangeHook = async ({
  doc,
  req: { context, payload },
}) => {
  if (!canRevalidate(context)) return doc

  payload.logger.info('Revalidating homepage')
  await revalidateLocalizedPath('')
  await revalidateSitemap()
  return doc
}
