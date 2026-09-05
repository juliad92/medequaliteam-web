'use client'

import React from 'react'

import type { ArticleNavSection } from '@/lib/lexical-sections'

export default function ProjectPageNav({
  locale,
  sections,
}: {
  locale: string
  sections: ArticleNavSection[]
}) {
  if (sections.length < 2) return null

  const fr = locale === 'fr'

  return (
    <nav
      aria-label={fr ? 'Navigation de la page projet' : 'Project page navigation'}
      className="sticky top-16 z-40 border-b border-[var(--border)] bg-white/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-3 sm:px-8">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="shrink-0 rounded-lg px-4 py-2 text-[15px] font-medium text-[var(--muted)] transition-colors hover:bg-[var(--green-pale)] hover:text-[var(--green-dark)]"
          >
            {section.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
