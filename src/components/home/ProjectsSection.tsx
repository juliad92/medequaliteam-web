import React from 'react'
import Link from 'next/link'
import { getT } from '@/i18n/translations'
import type { Project as PayloadProject } from '@/payload/payload-types'
import ProjectCard, { type ProjectCardData } from '@/components/projects/ProjectCard'

const getPlaceholders = (t: ReturnType<typeof getT>): ProjectCardData[] => [
  {
    slug: 'northern-greece',
    status: 'active',
    location: 'Thessaloniki, Greece',
    title: t.nav.projectsActive,
    summary:
      'Providing basic medical care to displaced populations in the Thessaloniki region since December 2023.',
    gradient: 'var(--gradient-card)',
  },
]

export default function ProjectsSection({
  locale,
  projects,
}: {
  locale: string
  projects?: PayloadProject[]
}) {
  const t = getT(locale)
  const displayProjects: ProjectCardData[] =
    projects && projects.length > 0 ? projects : getPlaceholders(t)
  return (
    <section className="bg-[var(--cream)] px-4 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col items-start gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-[13px] font-medium tracking-[0.15em] text-[var(--green)] uppercase">
              {t.projects.eyebrow}
            </p>
            <h2
              className="font-serif leading-tight text-[var(--charcoal)]"
              style={{ fontSize: 'clamp(30px, 3.5vw, 44px)', fontWeight: 300 }}
            >
              {t.projects.title}
            </h2>
          </div>
          <Link
            href={`/${locale}/projects`}
            className="border-b border-[var(--border)] pb-0.5 text-[16px] font-medium text-[var(--muted)] transition-colors hover:border-[var(--charcoal)] hover:text-[var(--charcoal)]"
          >
            {t.projects.viewAll} →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  )
}
