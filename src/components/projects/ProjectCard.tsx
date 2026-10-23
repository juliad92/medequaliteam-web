import React from 'react'
import Link from 'next/link'
import { getT } from '@/i18n/translations'
import { MediaImage } from '@/components/media-image'
import type { Media } from '@/payload/payload-types'

export type ProjectCardData = {
  slug: string
  status: string
  location: string
  title: string
  summary: string
  coverImage?: (string | null) | Media
  gradient?: string
}

export default function ProjectCard({
  project,
  locale,
  headingLevel = 'h3',
}: {
  project: ProjectCardData
  locale: string
  headingLevel?: 'h2' | 'h3'
}) {
  const t = getT(locale)
  const href = `/${locale}/projects/${project.slug}`
  const statusLabel =
    t.projects.status[project.status as keyof typeof t.projects.status] ?? project.status
  const imageAlt =
    project.coverImage && typeof project.coverImage !== 'string'
      ? (project.coverImage.alt ?? project.title)
      : project.title
  const Heading = headingLevel

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl border border-[var(--border)] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div
        className="relative h-44 overflow-hidden"
        style={{
          background:
            project.gradient ??
            (project.status === 'active' ? 'var(--gradient-card)' : 'var(--gradient-hero)'),
        }}
      >
        <MediaImage
          image={project.coverImage}
          alt={imageAlt}
          size="card"
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
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
        <Heading className="mb-3 font-serif text-lg leading-snug font-normal text-[var(--charcoal)]">
          {project.title}
        </Heading>
        <p className="mb-5 text-[16px] leading-relaxed text-[var(--muted)]">{project.summary}</p>
        <span className="inline-flex items-center gap-1 text-[15px] font-medium text-[var(--green)]">
          {t.projects.learnMore}
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  )
}
