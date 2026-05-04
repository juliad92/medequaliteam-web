'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { getT } from '@/i18n/translations'

export default function Navbar({ locale }: { locale: string }) {
  const t = getT(locale)
  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = [
    {
      label: t.nav.about,
      href: '/about',
      children: [
        { label: t.nav.aboutWhy, href: '/about/why-we-exist' },
        { label: t.nav.aboutOrg, href: '/about/organisation' },
        { label: t.nav.aboutTeam, href: '/about/team' },
      ],
    },
    {
      label: t.nav.projects,
      href: '/projects',
      children: [
        { label: t.nav.projectsActive, href: '/projects/northern-greece' },
        { label: t.nav.projectsPast, href: '/projects/past' },
      ],
    },
    {
      label: t.nav.volunteer,
      href: '/volunteer',
      children: [
        { label: t.nav.volunteerGreece, href: '/volunteer/greece' },
        { label: t.nav.volunteerStories, href: '/volunteer/stories' },
      ],
    },
    { label: t.nav.news, href: '/news' },
  ]

  return (
    <>
      <div className="flex items-center justify-between bg-[var(--charcoal)] px-8 py-2 text-[11px] tracking-wider text-white/50">
        <div className="flex gap-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
          >
            Facebook
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
          >
            Twitter
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
          >
            Instagram
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/en"
            className={
              locale === 'en' ? 'font-medium text-white' : 'transition-colors hover:text-white'
            }
          >
            🇬🇧 English
          </Link>
          <span className="opacity-30">/</span>
          <Link
            href="/fr"
            className={
              locale === 'fr' ? 'font-medium text-white' : 'transition-colors hover:text-white'
            }
          >
            🇫🇷 Français
          </Link>
        </div>
      </div>

      <nav
        className={`sticky top-0 z-50 border-b border-[var(--border)] bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--charcoal)] text-lg">
              🌍
            </div>
            <span className="font-serif text-[19px] leading-none font-semibold text-[var(--charcoal)]">
              Med&apos;<span className="text-[var(--green)]">Equali</span>Team
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={`/${locale}${item.href}`}
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-[13.5px] font-medium text-[var(--muted)] transition-all hover:bg-[var(--cream)] hover:text-[var(--charcoal)]"
                >
                  {item.label}
                  {item.children && <span className="text-[10px] opacity-50">▾</span>}
                </Link>
                {item.children && openDropdown === item.label && (
                  <div className="absolute top-full left-0 z-50 mt-1 min-w-[200px] rounded-xl border border-[var(--border)] bg-white py-2 shadow-lg">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={`/${locale}${child.href}`}
                        className="block px-4 py-2.5 text-[13px] text-[var(--muted)] transition-colors hover:bg-[var(--cream)] hover:text-[var(--charcoal)]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href={`/${locale}/donate`}
              className="ml-3 rounded-lg bg-[var(--green)] px-5 py-2 text-[13.5px] font-medium text-white transition-colors hover:bg-[var(--green-dark)]"
            >
              {t.nav.donate}
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}
