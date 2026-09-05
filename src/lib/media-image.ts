import type { Media } from '@/payload/payload-types'

export type CoverImage = string | Media | null | undefined
export type MediaSizeName = 'thumbnail' | 'card' | 'hero'

/** Defaults matching Payload `imageSizes` in MediaAndPages. */
export const MEDIA_SIZE_FALLBACKS: Record<MediaSizeName, { width: number; height: number }> = {
  thumbnail: { width: 400, height: 300 },
  card: { width: 800, height: 500 },
  hero: { width: 1600, height: 900 },
}

function isMedia(image: CoverImage): image is Media {
  return Boolean(image && typeof image === 'object' && 'url' in image)
}

/** Prefer a named size when available, otherwise the original file URL. */
export function getMediaImageSrc(
  image: CoverImage,
  size: MediaSizeName = 'card',
): string | null {
  if (!image) return null
  if (typeof image === 'string') return image
  return image.sizes?.[size]?.url ?? image.url ?? null
}

/**
 * Intrinsic dimensions from Payload sizes (or the media record).
 * Always returns numbers so next/image never throws "missing required width".
 */
export function getMediaImageDimensions(
  image: CoverImage,
  size: MediaSizeName = 'card',
): { width: number; height: number } {
  const fallback = MEDIA_SIZE_FALLBACKS[size]
  if (!isMedia(image)) return fallback

  const sizeMeta = image.sizes?.[size]
  const width = sizeMeta?.width ?? image.width ?? fallback.width
  const height = sizeMeta?.height ?? image.height ?? fallback.height
  return { width, height }
}

export function getMediaImageAlt(image: CoverImage, fallback: string): string {
  if (!isMedia(image)) return fallback
  return image.alt || fallback
}
