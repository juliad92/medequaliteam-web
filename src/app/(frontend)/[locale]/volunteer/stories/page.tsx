import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

import { getT } from '@/i18n/translations'
import { getProjectsWithVolunteerNeeds } from '@/lib/volunteer'
import { formatStoryDate, getVolunteerStories } from '@/lib/volunteer-stories'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = getT(locale)

  return {
    title: t.volunteerStories.metaTitle,
    description: t.volunteerStories.metaDescription,
  }
}

export default async function VolunteerStoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = getT(locale)
  const payload = await getPayload({ config })
  const stories = await getVolunteerStories(payload, locale)

  const volunteerProjects = await getProjectsWithVolunteerNeeds(payload, locale as 'en' | 'fr')
  const volunteerHref = volunteerProjects[0]
    ? `/${locale}/volunteer/${volunteerProjects[0].slug}`
    : `/${locale}/volunteer/stories`

  return (
    <>
      <header className="relative overflow-hidden bg-[var(--charcoal)] px-4 pt-24 pb-16 sm:px-8">
        <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'var(--gradient-hero-glow)' }}
        />
        <div className="animate-fade-up relative mx-auto max-w-7xl">
          <p className="mb-4 flex items-center gap-3 text-[13px] font-medium tracking-[0.16em] text-[var(--green-light)] uppercase">
            <span className="h-px w-8 bg-[var(--green-light)]" />
            {t.volunteerStories.eyebrow}
          </p>
          <h1
            className="font-serif leading-[1.05] text-white"
            style={{ fontSize: 'clamp(40px, 5.5vw, 64px)', fontWeight: 300 }}
          >
            {t.volunteerStories.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-white/55">
            {t.volunteerStories.subtitle}
          </p>
        </div>
      </header>

      <main className="bg-[var(--warm-white)] px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          {stories.length === 0 ? (
            <p className="text-[16px] leading-relaxed text-[var(--muted)]">
              {t.volunteerStories.subtitle}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {stories.map((story, index) => (
                <Link
                  key={story.id}
                  href={`/${locale}/volunteer/stories/${story.slug}`}
                  className={`group animate-fade-up overflow-hidden rounded-2xl border border-[var(--border)] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${index === 0 ? 'delay-100' : 'delay-200'}`}
                >
                  <div
                    className="relative aspect-[5/4] overflow-hidden bg-[var(--cream)]"
                    style={story.coverImage ? undefined : { background: 'var(--gradient-card)' }}
                  >
                    {story.coverImage ? (
                      <Image
                        src={story.coverImage}
                        alt={story.coverImageAlt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : null}
                  </div>
                  <div className="p-6 sm:p-7">
                    {story.role ? (
                      <p className="mb-2 text-[13px] font-medium tracking-[0.12em] text-[var(--green)] uppercase">
                        {story.role}
                      </p>
                    ) : null}
                    <h2 className="mb-2 font-serif text-2xl leading-snug font-normal text-[var(--charcoal)]">
                      {t.volunteerStories.meet} {story.name}
                    </h2>
                    <p className="mb-4 text-[15px] leading-relaxed text-[var(--muted)]">
                      {story.excerpt}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-[14px] text-[var(--muted)]">
                        {formatStoryDate(locale, story.publishedAt)} · {t.volunteerStories.by}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[15px] font-medium text-[var(--green)]">
                        {t.volunteerStories.readStory}
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
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
