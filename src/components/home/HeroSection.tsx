import React from 'react'
import Link from 'next/link'
import { getT } from '@/i18n/translations'
import type { Homepage, Media } from '@/payload/payload-types'

type Project = {
  slug: string
  status: string
  location: string
  title: string
  summary: string
  gradient: string
}

type HeroImage = string | Media | null | undefined

function getHeroImageUrl(image: HeroImage): string | null {
  if (!image || typeof image === 'string') return null
  return image.sizes?.hero?.url ?? image.url ?? null
}

export default function HeroSection({
  locale,
  heroData,
  project,
}: {
  locale: string
  heroData?: Homepage['hero']
  project?: Project
}) {
  const t = getT(locale)
  const imageUrl = getHeroImageUrl(heroData?.image)

  return (
    <section className="relative flex min-h-[calc(100svh-7rem)] items-end overflow-hidden bg-[var(--charcoal)] lg:min-h-[88vh]">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      <div
        className="absolute inset-0"
        style={{
          background: imageUrl
            ? 'linear-gradient(135deg, rgba(15,31,20,0.82) 0%, rgba(15,31,20,0.72) 40%, rgba(28,40,24,0.78) 100%)'
            : 'linear-gradient(135deg, #1a2e20 0%, #0f1f14 40%, #1c2818 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 15% 60%, rgba(61,140,79,0.18) 0%, transparent 50%), radial-gradient(circle at 85% 20%, rgba(61,140,79,0.08) 0%, transparent 40%)',
        }}
      />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-end gap-10 px-4 pt-28 pb-16 sm:px-8 sm:pb-20 lg:grid-cols-2 lg:gap-16 lg:pt-0">
        <div
          className="animate-fade-up opacity-0"
          style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
        >
          <p className="mb-5 flex items-center gap-3 text-[11px] font-medium tracking-[0.16em] text-[var(--green-light)] uppercase">
            <span className="h-px w-8 bg-[var(--green-light)]" />
            {t.hero.eyebrow}
          </p>
          <h1
            className="mb-4 font-serif leading-[1.05] text-white"
            style={{ fontSize: 'clamp(52px, 6.5vw, 88px)', fontWeight: 300 }}
          >
            Med&apos;Equali
            <em className="text-white/60" style={{ fontStyle: 'italic' }}>
              Team
            </em>
          </h1>
          <p className="mb-8 font-serif text-lg text-white/55 sm:mb-10 sm:text-xl" style={{ fontStyle: 'italic' }}>
            {heroData?.tagline}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/${locale}/donate`}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--green)] px-7 py-3.5 text-sm font-medium tracking-wide text-white transition-all hover:-translate-y-0.5 hover:bg-[var(--green-dark)]"
            >
              {t.hero.donateCta}
            </Link>
            <Link
              href={`/${locale}/volunteer`}
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-7 py-3.5 text-sm font-medium text-white/80 transition-all hover:border-white/60 hover:text-white"
            >
              {t.hero.volunteerCta}
            </Link>
          </div>
        </div>
        <div
          className="animate-fade-up opacity-0"
          style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
        >
          <div className="rounded-2xl border border-white/10 bg-white/6 p-6 backdrop-blur-sm sm:p-8">
            <p className="mb-4 flex items-center gap-2 text-[10px] font-medium tracking-[0.18em] text-[var(--green-light)] uppercase">
              <span className="h-px w-5 bg-[var(--green-light)]" />
              {t.hero.currentProject}
            </p>
            <h2 className="mb-3 font-serif text-2xl leading-snug font-normal text-white">
              {project?.title}
            </h2>
            <div className="mb-5 flex gap-4 text-[12px] text-white/40">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--green-light)]" />
                {project?.location}
              </span>
              <span>{locale === 'fr' ? 'Actif depuis 2023' : 'Active since 2023'}</span>
            </div>
            <p className="mb-6 text-[13.5px] leading-relaxed text-white/55">{project?.summary}</p>
            <Link
              href={`/${locale}/projects/northern-greece`}
              className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--green-light)] transition-colors hover:text-white"
            >
              {t.hero.learnMore}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 opacity-30 sm:flex">
        <span className="text-[10px] tracking-widest text-white uppercase">{t.hero.scroll}</span>
        <div className="h-8 w-px bg-white/50" />
      </div>
    </section>
  )
}
