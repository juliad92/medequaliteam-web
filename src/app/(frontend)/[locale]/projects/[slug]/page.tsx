import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import LexicalRenderer from '@/components/richtext/LexicalRenderer'
import ImpactBar from '@/components/home/ImpactBar'
import ProjectPageNav from '@/components/projects/ProjectPageNav'
import { getT } from '@/i18n/translations'
import { extractArticleNavSections } from '@/lib/lexical-sections'
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
  // const coverImageUrl = getCoverImageUrl(project.coverImage)
  // const coverImageAlt = getCoverImageAlt(project.coverImage, project.title)
  const hasStats = Boolean(project.stats && project.stats.length > 0)
  const hasPartners = Boolean(project.partners && project.partners.length > 0)
  const dateLine = [startLabel, endLabel].filter(Boolean).join(' → ')
  const volunteerHref = `/${locale}/volunteer/${project.slug}`
  const navSections = extractArticleNavSections(project.content)

  return (
    <>
      <header className="relative overflow-hidden bg-[var(--charcoal)] px-4 pt-20 pb-14 sm:px-8 sm:pt-24">
        <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'var(--gradient-hero-glow)' }}
        />
        <div className="relative mx-auto max-w-7xl">
          <Link
            href={`/${locale}/projects`}
            className="mb-4 inline-flex items-center gap-2 text-[14px] font-medium text-white/50 transition-colors hover:text-white"
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
          {project.summary ? (
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/55">
              {project.summary}
            </p>
          ) : null}
        </div>
      </header>

      {hasStats ? <ImpactBar locale={locale} impactStats={project.stats!} /> : null}

      <ProjectPageNav locale={locale} sections={navSections} />

      <main className="bg-white px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(260px,300px)] lg:gap-14">
            {/* At a glance + CTAs — after lead on mobile, sticky sidebar on desktop */}
            <aside className="space-y-6 lg:sticky lg:top-36 lg:col-start-2 lg:row-span-2 lg:self-start">
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
                      <dd className="mt-1 text-[15px] text-[var(--charcoal)]">
                        {project.location}
                      </dd>
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
