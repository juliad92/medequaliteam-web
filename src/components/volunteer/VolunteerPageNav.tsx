'use client'

import React from 'react'

const SECTIONS = [
  { id: 'volunteer-overview', en: 'Overview', fr: 'Aperçu' },
  { id: 'volunteer-roles', en: 'Open roles', fr: 'Rôles ouverts' },
  { id: 'volunteer-process', en: 'Next steps', fr: 'Processus' },
  { id: 'volunteer-application', en: 'Apply', fr: 'Postuler' },
] as const

export default function VolunteerPageNav({ locale }: { locale: string }) {
  const fr = locale === 'fr'

  return (
    <nav
      aria-label={fr ? 'Navigation de la page bénévolat' : 'Volunteer page navigation'}
      className="sticky top-16 z-40 border-b border-[var(--border)] bg-white/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-8 py-3">
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="shrink-0 rounded-lg px-4 py-2 text-[13px] font-medium text-[var(--muted)] transition-colors hover:bg-[var(--green-pale)] hover:text-[var(--green-dark)]"
          >
            {fr ? section.fr : section.en}
          </a>
        ))}
      </div>
    </nav>
  )
}
