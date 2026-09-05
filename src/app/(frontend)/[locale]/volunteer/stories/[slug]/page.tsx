import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import { getT } from '@/i18n/translations'
import { getProjectsWithVolunteerNeeds } from '@/lib/volunteer'
import { formatStoryDate, getVolunteerStory } from '@/lib/volunteer-stories'
import Image from 'next/image'
import { MEDIA_SIZE_FALLBACKS } from '@/lib/media-image'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const payload = await getPayload({ config })
  const story = await getVolunteerStory(payload, locale, slug)
  const t = getT(locale)

  if (!story) {
    return { title: t.volunteerStories.metaTitle }
  }

  return {
    title: `${story.role || story.name} — ${story.name}`,
    description: story.excerpt,
  }
}

export default async function VolunteerStoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const payload = await getPayload({ config })
  const story = await getVolunteerStory(payload, locale, slug)
  if (!story) notFound()

  const t = getT(locale)
  const volunteerProjects = await getProjectsWithVolunteerNeeds(payload, locale as 'en' | 'fr')
  const volunteerHref = volunteerProjects[0]
    ? `/${locale}/volunteer/${volunteerProjects[0].slug}`
    : `/${locale}/volunteer/stories`

  const roleLocation = [story.role, story.location].filter(Boolean).join(' · ')

  return (
    <>
      <header className="relative overflow-hidden bg-[var(--charcoal)] px-4 pt-24 pb-16 sm:px-8">
        <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'var(--gradient-hero-glow)' }}
        />
        <div className="animate-fade-up relative mx-auto max-w-7xl">
          <Link
            href={`/${locale}/volunteer/stories`}
            className="mb-6 inline-flex items-center gap-2 text-[14px] font-medium text-white/50 transition-colors hover:text-white"
          >
            ← {t.volunteerStories.backToStories}
          </Link>
          {roleLocation ? (
            <p className="mb-4 flex items-center gap-3 text-[13px] font-medium tracking-[0.16em] text-[var(--green-light)] uppercase">
              <span className="h-px w-8 bg-[var(--green-light)]" />
              {roleLocation}
            </p>
          ) : null}
          <h1
            className="font-serif leading-[1.05] text-white"
            style={{ fontSize: 'clamp(40px, 5.5vw, 64px)', fontWeight: 300 }}
          >
            {t.volunteerStories.meet} {story.name}
          </h1>
          <p className="mt-4 text-[15px] text-white/50">
            {formatStoryDate(locale, story.publishedAt)} · {t.volunteerStories.by}
          </p>
        </div>
      </header>

      <main className="bg-white px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div className="animate-fade-up">
            <div
              className="relative aspect-square overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--cream)]"
              style={story.coverImage ? undefined : { background: 'var(--gradient-card)' }}
            >
              {story.coverImage ? (
                <Image
                  src={story.coverImage}
                  alt={story.coverImageAlt}
                  width={MEDIA_SIZE_FALLBACKS.card.width}
                  height={MEDIA_SIZE_FALLBACKS.card.height}
                  className="absolute inset-0 h-full w-full object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="aspect-square w-full" />
              )}
            </div>
          </div>

          <div className="animate-fade-up delay-100">
            {story.role || story.location ? (
              <p className="mb-3 text-[13px] font-medium tracking-[0.14em] text-[var(--green)] uppercase">
                {[story.role, story.location ? `${t.volunteerStories.from} ${story.location}` : '']
                  .filter(Boolean)
                  .join(' ')}
              </p>
            ) : null}
            {story.intro ? (
              <p className="mb-10 text-[17px] leading-relaxed text-[var(--muted)]">{story.intro}</p>
            ) : null}

            {story.sections.length > 0 ? (
              <div className="space-y-8">
                {story.sections.map((section) => (
                  <div
                    key={section.question}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--cream)] p-6 sm:p-7"
                  >
                    <p className="mb-3 text-[13px] font-medium tracking-[0.12em] text-[var(--green)] uppercase">
                      {section.question}
                    </p>
                    <p className="font-serif text-[18px] leading-relaxed text-[var(--charcoal)] italic">
                      “{section.answer}”
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <section className="relative mx-auto mt-16 max-w-7xl overflow-hidden rounded-2xl sm:mt-20">
          <div className="absolute inset-0 bg-[var(--charcoal)]" />
          <div
            className="absolute inset-0 opacity-90"
            style={{ background: 'var(--gradient-hero)' }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'var(--gradient-hero-glow)' }}
          />
          <div className="relative px-6 py-14 text-center sm:px-12 sm:py-20">
            <p className="mb-4 text-[13px] font-medium tracking-[0.15em] text-[var(--green-light)] uppercase">
              {t.volunteerStories.pullQuoteLabel}
            </p>
            <blockquote
              className="mx-auto max-w-3xl font-serif leading-snug text-white"
              style={{ fontSize: 'clamp(24px, 3.2vw, 36px)', fontWeight: 300 }}
            >
              “{story.pullQuote}”
            </blockquote>
            <p className="mt-6 text-[15px] font-medium tracking-[0.08em] text-white/55 uppercase">
              — {story.name}
            </p>
          </div>
        </section>
      </main>

      <section className="px-4 py-16 sm:px-8 sm:py-20" style={{ background: 'var(--green-dark)' }}>
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 md:grid-cols-[1fr_auto] md:gap-16">
          <div>
            <p className="mb-4 text-[13px] font-medium tracking-[0.15em] text-white/40 uppercase">
              {t.volunteerStories.ctaEyebrow}
            </p>
            <h2
              className="mb-4 font-serif leading-tight text-white"
              style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 300 }}
            >
              {t.volunteerStories.ctaTitle}
            </h2>
            <p className="max-w-lg text-base leading-relaxed text-white/50">
              {t.volunteerStories.ctaBody}
            </p>
          </div>
          <Link
            href={volunteerHref}
            className="rounded-lg bg-white px-8 py-3.5 text-center text-base font-medium text-[var(--green-dark)] transition-colors hover:bg-[var(--cream)]"
          >
            {t.volunteerStories.ctaPrimary}
          </Link>
        </div>
      </section>
    </>
  )
}
