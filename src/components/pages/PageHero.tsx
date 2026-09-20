import React from 'react'
import Link from 'next/link'

import { MediaImage } from '@/components/media-image'
import type { PageHeroBlock } from '@/lib/pages'

function resolveHref(url: string, locale: string): string {
  if (/^(https?:|mailto:)/i.test(url)) return url
  if (url.startsWith(`/${locale}/`) || url === `/${locale}`) return url
  if (url.startsWith('/')) return `/${locale}${url}`
  return url
}

export default function PageHero({
  locale,
  hero,
  fallbackHeading,
}: {
  locale: string
  hero: PageHeroBlock | null
  fallbackHeading: string
}) {
  const heading = hero?.heading || fallbackHeading
  const subheading = hero?.subheading
  const ctas = hero?.ctas?.filter((cta) => cta.label && cta.url) ?? []
  const hasImage = Boolean(hero?.image)

  return (
    <header className="relative overflow-hidden bg-[var(--charcoal)] px-4 pt-24 pb-16 sm:px-8 sm:pt-28 sm:pb-20">
      {hasImage ? (
        <MediaImage
          image={hero?.image}
          alt=""
          size="hero"
          fill
          priority
          ariaHidden
          className="object-cover"
          sizes="100vw"
        />
      ) : null}
      <div
        className="absolute inset-0"
        style={{
          background: hasImage ? 'var(--gradient-hero-overlay)' : 'var(--gradient-hero)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'var(--gradient-hero-glow)' }}
      />
      <div className="animate-fade-up relative mx-auto max-w-7xl">
        <h1
          className="max-w-4xl font-serif leading-[1.05] text-white"
          style={{ fontSize: 'clamp(40px, 5.5vw, 64px)', fontWeight: 300 }}
        >
          {heading}
        </h1>
        {subheading ? (
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/55 sm:text-[18px]">
            {subheading}
          </p>
        ) : null}
        {ctas.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-4">
            {ctas.map((cta) => {
              const href = resolveHref(cta.url, locale)
              const isExternal = /^(https?:|mailto:)/i.test(cta.url)
              const className =
                cta.variant === 'secondary'
                  ? 'inline-flex items-center gap-2 rounded-lg border border-white/30 px-7 py-3.5 text-base font-medium text-white/80 transition-all hover:border-white/60 hover:text-white'
                  : 'inline-flex items-center gap-2 rounded-lg bg-[var(--green)] px-7 py-3.5 text-base font-medium tracking-wide text-white transition-all hover:-translate-y-0.5 hover:bg-[var(--green-dark)]'

              if (isExternal) {
                return (
                  <a
                    key={cta.id ?? cta.url}
                    href={href}
                    className={className}
                    target={cta.url.startsWith('http') ? '_blank' : undefined}
                    rel={cta.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {cta.label}
                  </a>
                )
              }

              return (
                <Link key={cta.id ?? cta.url} href={href} className={className}>
                  {cta.label}
                </Link>
              )
            })}
          </div>
        ) : null}
      </div>
    </header>
  )
}
