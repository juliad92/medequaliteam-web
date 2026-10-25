'use client'

import React, { useMemo } from 'react'

import { MediaImage } from '@/components/media-image'
import { getT } from '@/i18n/translations'
import type { CoverImage } from '@/lib/media-image'

export type PartnerLogo = {
  id: string
  name: string
  url: string
  logo: CoverImage
}

/** Below this count, a centered static row reads better than a sparse marquee. */
const MARQUEE_MIN_PARTNERS = 5
/** Pad the scrolling set so the track never looks empty with 5–8 logos. */
const MARQUEE_MIN_TRACK_ITEMS = 12

function PartnerItem({
  partner,
  clone = false,
  size = 'marquee',
}: {
  partner: PartnerLogo
  clone?: boolean
  size?: 'marquee' | 'static'
}) {
  const isStatic = size === 'static'

  return (
    <li
      className={
        isStatic
          ? 'flex h-20 w-52 shrink-0 items-center justify-center sm:h-24 sm:w-60'
          : 'flex h-16 w-48 shrink-0 items-center justify-center sm:h-20 sm:w-56'
      }
      data-marquee-clone={clone ? '' : undefined}
      aria-hidden={clone || undefined}
    >
      <a
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={clone ? -1 : undefined}
        className="relative block h-full w-full opacity-70 transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--green)]"
        title={partner.name}
      >
        <span className="absolute inset-3">
          <MediaImage
            image={partner.logo}
            alt={clone ? '' : partner.name}
            size="original"
            fill
            className="object-contain"
            sizes={isStatic ? '240px' : '224px'}
          />
        </span>
      </a>
    </li>
  )
}

function buildMarqueeSequence(partners: PartnerLogo[]): PartnerLogo[] {
  if (partners.length === 0) return []
  const sequence: PartnerLogo[] = []
  while (sequence.length < MARQUEE_MIN_TRACK_ITEMS) {
    sequence.push(...partners)
  }
  return sequence
}

export default function PartnersMarquee({
  locale,
  partners,
}: {
  locale: string
  partners: PartnerLogo[]
}) {
  const t = getT(locale).partnersBanner
  const useMarquee = partners.length >= MARQUEE_MIN_PARTNERS

  const marqueeSequence = useMemo(
    () => (useMarquee ? buildMarqueeSequence(partners) : []),
    [partners, useMarquee],
  )

  if (partners.length === 0) return null

  return (
    <section
      className="border-t border-[var(--border)] bg-[var(--white)] py-10 sm:py-12"
      aria-label={t.title}
    >
      <div className="mx-auto mb-6 max-w-7xl px-4 sm:px-8">
        <p className="text-center text-[13px] font-medium tracking-[0.14em] text-[var(--green)] uppercase">
          {t.title}
        </p>
      </div>

      {useMarquee ? (
        <div className="partners-marquee relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--cream)] to-transparent sm:w-20"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--cream)] to-transparent sm:w-20"
            aria-hidden
          />

          <ul className="partners-marquee__track flex w-max items-center gap-10 py-4 sm:gap-14">
            {marqueeSequence.map((partner, index) => (
              <PartnerItem key={`${partner.id}-${index}`} partner={partner} />
            ))}
            {marqueeSequence.map((partner, index) => (
              <PartnerItem key={`${partner.id}-clone-${index}`} partner={partner} clone />
            ))}
          </ul>
        </div>
      ) : (
        <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-8 px-4 py-2 sm:gap-x-14 sm:px-8">
          {partners.map((partner) => (
            <PartnerItem key={partner.id} partner={partner} size="static" />
          ))}
        </ul>
      )}
    </section>
  )
}
