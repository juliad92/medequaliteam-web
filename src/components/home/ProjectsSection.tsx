import React from 'react'
import Link from 'next/link'
import { getT } from '@/i18n/translations'

const getPlaceholders = (t: ReturnType<typeof getT>) => [
  {
    slug: 'northern-greece',
    status: 'active',
    location: 'Thessaloniki, Greece',
    title: t.nav.projectsActive,
    summary:
      'Providing basic medical care to displaced populations in the Thessaloniki region since December 2023.',
    gradient: 'linear-gradient(135deg, #7db87d, #5a9e5a)',
  },
  {
    slug: 'samos',
    status: 'past',
    location: 'Samos, Greece',
    title: 'Samos (2018–2021)',
    summary:
      'Our founding project — a clinic treating over 80,000 patients on the island of Samos.',
    gradient: 'linear-gradient(135deg, #b0c4b0, #8aaa8a)',
  },
  {
    slug: 'poland',
    status: 'past',
    location: 'Poland',
    title: 'Ukraine (2022–2023)',
    summary:
      'Mobile medical units supporting Ukrainian refugees and relieving pressure on the Polish healthcare system.',
    gradient: 'linear-gradient(135deg, #aab8c8, #8898b0)',
  },
]

type Project = {
  slug: string
  status: string
  location: string
  title: string
  summary: string
  gradient: string
}

function ProjectCard({
  project,
  locale,
  t,
}: {
  project: Project
  locale: string
  t: ReturnType<typeof getT>
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-44" style={{ background: project.gradient }}>
        <span
          className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[10.5px] font-medium tracking-wide uppercase ${project.status === 'active' ? 'bg-[var(--green)]/90 text-white' : 'bg-black/40 text-white/80'}`}
        >
          {project.status === 'active' ? t.projects.active : t.projects.past}
        </span>
      </div>
      <div className="p-6">
        <p className="mb-2 text-[11px] font-medium tracking-[0.12em] text-[var(--green)] uppercase">
          📍 {project.location}
        </p>
        <h3 className="mb-3 font-serif text-lg leading-snug font-normal text-[var(--charcoal)]">
          {project.title}
        </h3>
        <p className="mb-5 text-[13.5px] leading-relaxed text-[var(--muted)]">{project.summary}</p>
        <Link
          href={`/${locale}/projects/${project.slug}`}
          className="group inline-flex items-center gap-1 text-[13px] font-medium text-[var(--green)]"
        >
          {t.projects.learnMore}
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </div>
  )
}

export default function ProjectsSection({
  locale,
  projects,
}: {
  locale: string
  projects?: Project[]
}) {
  const t = getT(locale)
  const displayProjects = projects && projects.length > 0 ? projects : getPlaceholders(t)
  return (
    <section className="bg-[var(--cream)] px-8 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex items-end justify-between">
          <div>
            <p className="mb-3 text-[11px] font-medium tracking-[0.15em] text-[var(--green)] uppercase">
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
            className="border-b border-[var(--border)] pb-0.5 text-[13.5px] font-medium text-[var(--muted)] transition-colors hover:border-[var(--charcoal)] hover:text-[var(--charcoal)]"
          >
            {t.projects.viewAll} →
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {displayProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} locale={locale} t={t} />
          ))}
        </div>
      </div>
    </section>
  )
}
