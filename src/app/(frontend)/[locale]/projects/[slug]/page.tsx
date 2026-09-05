import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import LexicalRenderer from '@/components/richtext/LexicalRenderer'
import { getT } from '@/i18n/translations'
import type { Media } from '@/payload/payload-types'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

type Project = {
  title: string
  slug: string
  status: string
  location: string
  dateStart?: string | null
  dateEnd?: string | null
  coverImage?: (string | null) | Media
  summary: string
  content?: unknown
  partners?: { name: string; url?: string | null; logo?: (string | null) | Media }[] | null
  stats?: { value: string; label: string; id?: string | null }[] | null
}

function getCoverImageUrl(image: Project['coverImage']): string | null {
  if (!image || typeof image === 'string') return null
  return image.sizes?.hero?.url ?? image.sizes?.card?.url ?? image.url ?? null
}

function getCoverImageAlt(image: Project['coverImage'], fallback: string): string {
  if (!image || typeof image === 'string') return fallback
  return image.alt ?? fallback
}

function formatDate(value: string | null | undefined, locale: string): string | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const t = getT(locale)
  const payload = await getPayload({ config })
  const { docs: projects } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    locale: locale as 'en' | 'fr',
    fallbackLocale: 'en',
    limit: 1,
  })
  const project = projects[0] as Project | undefined
  if (!project) return { title: t.projects.metaTitle }
  return {
    title: `${project.title} — ${t.projects.metaTitle}`,
    description: project.summary ?? t.projects.metaDescription,
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const t = getT(locale)
  const payload = await getPayload({ config })

  const { docs: projects } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    locale: locale as 'en' | 'fr',
    fallbackLocale: 'en',
    depth: 1,
    limit: 1,
  })

  const project = projects[0] as Project | undefined
  if (!project) notFound()

  const statusLabel =
    t.projects.status[project.status as keyof typeof t.projects.status] ?? project.status
  const startLabel = formatDate(project.dateStart, locale)
  const endLabel = formatDate(project.dateEnd, locale)
  const coverImageUrl = getCoverImageUrl(project.coverImage)
  const coverImageAlt = getCoverImageAlt(project.coverImage, project.title)
  const hasStats = Boolean(project.stats && project.stats.length > 0)
  const hasPartners = Boolean(project.partners && project.partners.length > 0)
  const dateLine = [startLabel, endLabel].filter(Boolean).join(' → ')
  const volunteerHref = `/${locale}/volunteer/${project.slug}`

  return (
    <>
      <header className="relative overflow-hidden bg-[var(--charcoal)] px-4 pt-24 pb-16 sm:px-8 sm:pt-28">
        <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'var(--gradient-hero-glow)' }}
        />
        <div className="relative mx-auto max-w-7xl">
          <Link
            href={`/${locale}/projects`}
            className="mb-6 inline-flex items-center gap-2 text-[14px] font-medium text-white/50 transition-colors hover:text-white"
          >
            ← {t.projects.backToList}
          </Link>
          <p className="mb-4 flex items-center gap-3 text-[13px] font-medium tracking-[0.16em] text-[var(--green-light)] uppercase">
            <span className="h-px w-8 bg-[var(--green-light)]" />
            {statusLabel}
            {project.location ? ` · ${project.location}` : ''}
          </p>
          <h1
            className="max-w-4xl font-serif leading-[1.05] text-white"
            style={{ fontSize: 'clamp(40px, 5.5vw, 64px)', fontWeight: 300 }}
          >
            {project.title}
          </h1>
          {startLabel || endLabel ? (
            <p className="mt-4 text-[15px] text-white/50">
              {[
                startLabel ? `${t.projects.dateFrom} ${startLabel}` : '',
                endLabel ? `${t.projects.dateTo} ${endLabel}` : '',
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
          ) : null}
        </div>
      </header>

      <main className="bg-white px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          {hasStats ? (
            <section aria-labelledby="project-impact" className="mb-12 border-y border-[var(--border)] py-8 sm:mb-16 sm:py-10">
              <p
                id="project-impact"
                className="mb-6 text-[13px] font-medium tracking-[0.14em] text-[var(--green)] uppercase"
              >
                {t.projects.impactStats}
              </p>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
                {project.stats!.map((stat) => (
                  <div key={stat.id ?? `${stat.value}-${stat.label}`}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <p className="font-serif text-[clamp(28px,3vw,36px)] leading-none text-[var(--charcoal)]">
                        {stat.value}
                      </p>
                      <p className="mt-2 text-[14px] leading-snug text-[var(--muted)]">{stat.label}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(260px,300px)] lg:gap-14">
            {/* Lead: cover + summary — appears first on all breakpoints */}
            <div className="space-y-8 lg:col-start-1">
              {coverImageUrl ? (
                <div
                  className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--cream)]"
                  style={
                    project.status === 'active' ? undefined : { background: 'var(--gradient-hero)' }
                  }
                >
                  <Image
                    src={coverImageUrl}
                    alt={coverImageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    priority
                  />
                </div>
              ) : null}

              {project.summary ? (
                <p className="max-w-[65ch] text-[19px] leading-relaxed text-[var(--charcoal)]">
                  {project.summary}
                </p>
              ) : null}
            </div>

            {/* At a glance + CTAs — after lead on mobile, sticky sidebar on desktop */}
            <aside className="space-y-6 lg:col-start-2 lg:row-span-2 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--cream)] p-6 sm:p-7">
                <p className="mb-5 text-[13px] font-medium tracking-[0.14em] text-[var(--green)] uppercase">
                  {t.projects.atAGlance}
                </p>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-[12px] font-medium tracking-[0.1em] text-[var(--muted)] uppercase">
                      {t.projects.statusLabel}
                    </dt>
                    <dd className="mt-1 text-[15px] text-[var(--charcoal)]">{statusLabel}</dd>
                  </div>
                  {project.location ? (
                    <div>
                      <dt className="text-[12px] font-medium tracking-[0.1em] text-[var(--muted)] uppercase">
                        {t.projects.locationLabel}
                      </dt>
                      <dd className="mt-1 text-[15px] text-[var(--charcoal)]">{project.location}</dd>
                    </div>
                  ) : null}
                  {dateLine ? (
                    <div>
                      <dt className="text-[12px] font-medium tracking-[0.1em] text-[var(--muted)] uppercase">
                        {t.projects.datesLabel}
                      </dt>
                      <dd className="mt-1 text-[15px] text-[var(--charcoal)]">{dateLine}</dd>
                    </div>
                  ) : null}
                </dl>

                <div className="mt-6 flex flex-col gap-2.5 border-t border-[var(--border)] pt-5">
                  <Link
                    href={volunteerHref}
                    className="inline-flex h-11 items-center justify-center rounded-lg bg-[var(--green)] px-5 text-[15px] font-medium text-white transition-colors hover:bg-[var(--green-dark)]"
                  >
                    {t.projects.volunteerCta}
                  </Link>
                  <Link
                    href={`/${locale}/donate`}
                    className="inline-flex h-11 items-center justify-center rounded-lg border border-[var(--border)] bg-white px-5 text-[15px] font-medium text-[var(--charcoal)] transition-colors hover:bg-[var(--warm-white)]"
                  >
                    {t.projects.donateCta}
                  </Link>
                </div>
              </div>

              {hasPartners ? (
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--cream)] p-6 sm:p-7">
                  <p className="mb-4 text-[13px] font-medium tracking-[0.14em] text-[var(--green)] uppercase">
                    {t.projects.partners}
                  </p>
                  <ul className="space-y-3">
                    {project.partners!.map((partner, idx) => (
                      <li key={partner.name + idx}>
                        {partner.url ? (
                          <a
                            href={partner.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[15px] font-medium text-[var(--green)] hover:underline"
                          >
                            {partner.name}
                          </a>
                        ) : (
                          <span className="text-[15px] text-[var(--muted)]">{partner.name}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </aside>

            {/* Long-form content — after aside on mobile so readers get facts first */}
            {project.content ? (
              <article className="lg:col-start-1">
                <LexicalRenderer content={project.content} variant="article" />
              </article>
            ) : null}
          </div>
        </div>
      </main>
    </>
  )
}
