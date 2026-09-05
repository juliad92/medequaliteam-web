import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import { getT } from '@/i18n/translations'
import type { Media } from '@/payload/payload-types'
import { getMediaImageAlt, getMediaImageSrc, MediaImage } from '@/components/media-image'

export const dynamic = 'force-dynamic'

type Project = {
  slug: string
  status: string
  location: string
  title: string
  summary: string
  coverImage?: (string | null) | Media
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = getT(locale)
  return {
    title: t.projects.metaTitle,
    description: t.projects.metaDescription,
  }
}

export default async function ProjectsListingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = getT(locale)
  const payload = await getPayload({ config })

  const { docs: projects } = await payload.find({
    collection: 'projects',
    where: { _status: { equals: 'published' } },
    locale: locale as 'en' | 'fr',
    fallbackLocale: 'en',
    depth: 1,
    limit: 100,
    sort: 'dateStart',
  })

  const displayProjects = projects.filter((p) => p.slug) as Project[]

  if (displayProjects.length === 0) notFound()

  return (
    <>
      <header className="relative overflow-hidden bg-[var(--charcoal)] px-4 pt-24 pb-14 sm:px-8 sm:pt-28">
        <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'var(--gradient-hero-glow)' }}
        />
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-3 flex items-center gap-3 text-[13px] font-medium tracking-[0.15em] text-[var(--green-light)] uppercase">
            <span className="h-px w-8 bg-[var(--green-light)]" />
            {t.projects.eyebrow}
          </p>
          <h1
            className="font-serif leading-[1.05] text-white"
            style={{ fontSize: 'clamp(40px, 5.5vw, 64px)', fontWeight: 300 }}
          >
            {t.projects.title}
          </h1>
        </div>
      </header>

      <main className="bg-white px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayProjects.map((project) => {
              const imageUrl = getMediaImageSrc(project.coverImage, 'card')
              const imageAlt = getMediaImageAlt(project.coverImage, project.title)
              const statusLabel =
                t.projects.status[project.status as keyof typeof t.projects.status] ??
                project.status

              return (
                <article
                  key={project.slug}
                  className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className="relative h-44 overflow-hidden"
                    style={{
                      background:
                        project.status === 'active'
                          ? 'var(--gradient-card)'
                          : 'var(--gradient-hero)',
                    }}
                  >
                    {imageUrl ? (
                      <MediaImage
                        image={project.coverImage}
                        alt={imageAlt}
                        size="card"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : null}
                    <span
                      className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[14px] font-medium tracking-wide uppercase ${
                        project.status === 'active'
                          ? 'bg-[var(--green)]/90 text-white'
                          : 'bg-black/40 text-white/80'
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </div>
                  <div className="p-6">
                    <p className="mb-2 text-[13px] font-medium tracking-[0.12em] text-[var(--green)] uppercase">
                      📍 {project.location}
                    </p>
                    <h2 className="mb-3 font-serif text-lg leading-snug font-normal text-[var(--charcoal)]">
                      {project.title}
                    </h2>
                    <p className="mb-5 text-[16px] leading-relaxed text-[var(--muted)]">
                      {project.summary}
                    </p>
                    <a
                      href={`/${locale}/projects/${project.slug}`}
                      className="group inline-flex items-center gap-1 text-[15px] font-medium text-[var(--green)]"
                    >
                      {t.projects.learnMore}
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </a>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </main>
    </>
  )
}
