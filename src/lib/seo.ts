import type { Metadata } from 'next'

import { getMediaImageSrc, type CoverImage } from '@/lib/media-image'
import type { Page } from '@/payload/payload-types'

export const SITE_NAME = "Med'EqualiTeam"
export const LOCALES = ['en', 'fr'] as const
export type SeoLocale = (typeof LOCALES)[number]

/**
 * Whether search engines may index this deployment.
 * Set `ALLOW_SEARCH_INDEXING=true` only on the public production host
 * (medequali.team). Defaults to false so Vercel "hidden production" / previews stay out of the index.
 */
export function isSearchIndexingAllowed(): boolean {
  const raw = process.env.ALLOW_SEARCH_INDEXING?.trim().toLowerCase()
  return raw === '1' || raw === 'true' || raw === 'yes'
}

/** Robots metadata for Next.js `metadata.robots` (root layout / pages). */
export function getRobotsMetadata(): Metadata['robots'] {
  if (isSearchIndexingAllowed()) {
    return {
      index: true,
      follow: true,
    }
  }

  return {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  }
}

/** Public site origin for metadataBase, OG, and canonical URLs. */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit) return explicit.replace(/\/$/, '')

  return 'https://medequali.team'
}

/** Path without locale prefix. Use `''` for the homepage, `'/projects'` for listing, etc. */
export function normalizeSeoPath(path: string): string {
  if (!path || path === '/') return ''
  return path.startsWith('/') ? path : `/${path}`
}

export function localizedHref(locale: string, path: string = ''): string {
  return `/${locale}${normalizeSeoPath(path)}`
}

export function languageAlternates(path: string = ''): Record<string, string> {
  const normalized = normalizeSeoPath(path)
  return {
    en: localizedHref('en', normalized),
    fr: localizedHref('fr', normalized),
    'x-default': localizedHref('en', normalized),
  }
}

function resolveOgImageUrl(image?: CoverImage | string | null): string | undefined {
  if (!image) return undefined
  if (typeof image === 'string') {
    // Absolute URL or site-relative path (resolved via metadataBase)
    return image
  }
  return getMediaImageSrc(image, 'hero') ?? getMediaImageSrc(image, 'card') ?? undefined
}

type BuildPageMetadataArgs = {
  locale: string
  /** Path without locale, e.g. `''`, `'/donate'`, `'/projects/slug'`. */
  path?: string
  title: string
  description: string
  image?: CoverImage | string | null
  /**
   * When true, skip the root `title.template` (use for titles that already include the brand).
   */
  absoluteTitle?: boolean
}

/** Title, description, Open Graph, Twitter, canonical, and hreflang alternates. */
export function buildPageMetadata({
  locale,
  path = '',
  title,
  description,
  image,
  absoluteTitle = false,
}: BuildPageMetadataArgs): Metadata {
  const canonical = localizedHref(locale, path)
  const ogImage = resolveOgImageUrl(image)
  const ogLocale = locale === 'fr' ? 'fr_FR' : 'en_GB'
  const alternateLocale = locale === 'fr' ? ['en_GB'] : ['fr_FR']

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: 'website',
      locale: ogLocale,
      alternateLocale,
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}

type BuildCmsPageMetadataArgs = {
  locale: string
  path: string
  page: Page | null
  fallbackTitle: string
  fallbackDescription: string
}

export function buildCmsPageMetadata({
  locale,
  path,
  page,
  fallbackTitle,
  fallbackDescription,
}: BuildCmsPageMetadataArgs): Metadata {
  return buildPageMetadata({
    locale,
    path,
    title: page?.meta?.title || page?.title || fallbackTitle,
    description: page?.meta?.description || fallbackDescription,
    image: page?.meta?.image,
  })
}
