import React from 'react'
import Link from 'next/link'
import { getT } from '@/i18n/translations'

export default function Footer({ locale }: { locale: string }) {
  const t = getT(locale)
  const footerLinks = {
    [t.nav.about]: [
      { label: t.nav.aboutWhy, href: '/about/why-we-exist' },
      { label: t.nav.aboutOrg, href: '/about/organisation' },
      { label: t.nav.aboutTeam, href: '/about/team' },
    ],
    [t.nav.projects]: [
      { label: t.nav.projectsActive, href: '/projects/northern-greece' },
      { label: t.nav.projectsPast, href: '/projects/past' },
    ],
    [t.nav.volunteer]: [
      { label: t.nav.volunteerGreece, href: '/volunteer/greece' },
      { label: t.nav.volunteerStories, href: '/volunteer/stories' },
    ],
    [t.nav.donate]: [
      { label: t.nav.donate, href: '/donate' },
      { label: locale === 'fr' ? 'Rapport financier' : 'Financial report', href: '/donate/report' },
    ],
  }
  return (
    <footer className="bg-[var(--charcoal)] px-8 pt-16 pb-10 text-white/50">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-10 border-b border-white/8 pb-12">
          <div>
            <p className="mb-3 font-serif text-lg text-white">
              Med&apos;<span className="text-[var(--green-light)]">Equali</span>Team
            </p>
            <p className="mb-5 text-[13px] leading-relaxed">{t.footer.tagline}</p>
            <div className="flex gap-2">
              {['f', 'tw', 'ig'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/6 text-[11px] transition-all hover:bg-white/12 hover:text-white"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <p className="mb-4 text-[11px] font-medium tracking-[0.12em] text-white/60 uppercase">
                {section}
              </p>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={`/${locale}${link.href}`}
                      className="text-[13px] text-white/40 transition-colors hover:text-white/80"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 text-[12px]">
          <p>
            © 2026 Med&apos;EqualiTeam. {t.footer.rights} · {t.footer.charity} W102001158 · 867
            route de Dorjon, 74490 Megevette, France
          </p>
          <div className="flex gap-5">
            <Link href={`/${locale}/complaints`} className="transition-colors hover:text-white/70">
              {t.footer.complaints}
            </Link>
            <Link
              href={`/${locale}/data-protection`}
              className="transition-colors hover:text-white/70"
            >
              {t.footer.dataProtection}
            </Link>
            <a href="mailto:info@medequali.team" className="transition-colors hover:text-white/70">
              info@medequali.team
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
