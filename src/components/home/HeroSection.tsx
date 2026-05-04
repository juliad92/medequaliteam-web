import React from 'react'
import Link from 'next/link'
import { getT } from '@/i18n/translations'

type Project = {
  slug: string
  status: string
  location: string
  title: string
  summary: string
  gradient: string
}

export default function HeroSection({ locale, project }: { locale: string; project?: Project }) {
  const t = getT(locale)
  return (
    <section className="relative flex min-h-[88vh] items-end overflow-hidden bg-[var(--charcoal)]">
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1a2e20 0%, #0f1f14 40%, #1c2818 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 15% 60%, rgba(61,140,79,0.18) 0%, transparent 50%), radial-gradient(circle at 85% 20%, rgba(61,140,79,0.08) 0%, transparent 40%)',
        }}
      />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-2 items-end gap-16 px-8 pb-20">
        <div
          className="animate-fade-up opacity-0"
          style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
        >
          <p className="mb-5 flex items-center gap-3 text-[11px] font-medium tracking-[0.16em] text-[var(--green-light)] uppercase">
            <span className="h-px w-8 bg-[var(--green-light)]" />
            {t.hero.eyebrow}
          </p>
          <h1
            className="mb-4 font-serif leading-[1.05] text-white"
            style={{ fontSize: 'clamp(52px, 6.5vw, 88px)', fontWeight: 300 }}
          >
            Med&apos;Equali
            <em className="text-white/60" style={{ fontStyle: 'italic' }}>
              Team
            </em>
          </h1>
          <p className="mb-10 font-serif text-xl text-white/55" style={{ fontStyle: 'italic' }}>
            {t.hero.tagline}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/${locale}/donate`}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--green)] px-7 py-3.5 text-sm font-medium tracking-wide text-white transition-all hover:-translate-y-0.5 hover:bg-[var(--green-dark)]"
            >
              {t.hero.donateCta}
            </Link>
            <Link
              href={`/${locale}/volunteer`}
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-7 py-3.5 text-sm font-medium text-white/80 transition-all hover:border-white/60 hover:text-white"
            >
              {t.hero.volunteerCta}
            </Link>
          </div>
        </div>
        <div
          className="animate-fade-up opacity-0"
          style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
        >
          <div className="rounded-2xl border border-white/10 bg-white/6 p-8 backdrop-blur-sm">
            <p className="mb-4 flex items-center gap-2 text-[10px] font-medium tracking-[0.18em] text-[var(--green-light)] uppercase">
              <span className="h-px w-5 bg-[var(--green-light)]" />
              {t.hero.latestProject}
            </p>
            <h2 className="mb-3 font-serif text-2xl leading-snug font-normal text-white">
              {project?.title}
            </h2>
            <div className="mb-5 flex gap-4 text-[12px] text-white/40">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--green-light)]" />
                {project?.location}
              </span>
              <span>{locale === 'fr' ? 'Actif depuis 2023' : 'Active since 2023'}</span>
            </div>
            <p className="mb-6 text-[13.5px] leading-relaxed text-white/55">{project?.summary}</p>
            <Link
              href={`/${locale}/projects/northern-greece`}
              className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--green-light)] transition-colors hover:text-white"
            >
              {t.hero.learnMore}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 opacity-30">
        <span className="text-[10px] tracking-widest text-white uppercase">{t.hero.scroll}</span>
        <div className="h-8 w-px bg-white/50" />
      </div>
    </section>
  )
}
