import Image from 'next/image'

import {
  getMediaImageAlt,
  getMediaImageDimensions,
  getMediaImageSrc,
  type CoverImage,
  type MediaSizeName,
} from '@/lib/media-image'

type MediaImageProps = {
  image: CoverImage
  alt?: string
  /** Prefer a named Payload size when available (default: card). */
  size?: MediaSizeName
  /** CSS class applied to the Image (defaults to object-cover). */
  className?: string
  /** sizes attribute for next/image. */
  sizes?: string
  /**
   * Cover the parent container (parent must be `relative` + sized).
   * Uses explicit width/height + absolute CSS instead of next/image `fill`,
   * which avoids intermittent "missing required width" errors.
   */
  fill?: boolean
  priority?: boolean
  ariaHidden?: boolean
}

/**
 * Shared next/image wrapper for Payload media.
 * Always passes numeric width/height so next/image never throws.
 */
export function MediaImage({
  image,
  alt: altProp,
  size = 'card',
  className = 'object-cover',
  sizes,
  fill = false,
  priority,
  ariaHidden,
}: MediaImageProps) {
  const src = getMediaImageSrc(image, size)
  if (!src) return null

  const { width, height } = getMediaImageDimensions(image, size)
  const alt = altProp ?? getMediaImageAlt(image, '')

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={fill ? `absolute inset-0 h-full w-full ${className}` : className}
      sizes={sizes}
      priority={priority}
      aria-hidden={ariaHidden}
    />
  )
}

export { getMediaImageAlt, getMediaImageDimensions, getMediaImageSrc }
