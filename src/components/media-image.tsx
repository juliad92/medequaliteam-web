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
   * Uses next/image `fill` so object-fit (contain/cover) is not clipped
   * by conflicting intrinsic width/height attributes.
   */
  fill?: boolean
  priority?: boolean
  ariaHidden?: boolean
}

/**
 * Shared next/image wrapper for Payload media.
 * Always passes numeric width/height (or fill) so next/image never throws.
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

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
        aria-hidden={ariaHidden}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      aria-hidden={ariaHidden}
    />
  )
}

export { getMediaImageAlt, getMediaImageDimensions, getMediaImageSrc }
