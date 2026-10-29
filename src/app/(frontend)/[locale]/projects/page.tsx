import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import { getT } from '@/i18n/translations'
import { breadcrumbJsonLd } from '@/lib/json-ld'
import { buildPageMetadata } from '@/lib/seo'
import ProjectCard, { type ProjectCardData } from '@/components/projects/ProjectCard'
import JsonLd from '@/components/seo/JsonLd'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = getT(locale)
  return buildPageMetadata({
    locale,
    path: '/projects',
    title: t.projects.metaTitle,
    description: t.projects.metaDescription,
  })
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
    sort: ['status', '-dateStart'],
  })

  const displayProjects = projects.filter((p) => p.slug) as ProjectCardData[]

  if (displayProjects.length === 0) notFound()

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [{ name: t.projects.metaTitle, path: '/projects' }])}
      />
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
            {displayProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} locale={locale} headingLevel="h2" />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
