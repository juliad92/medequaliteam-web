'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { getT } from '@/i18n/translations'

export default function Navbar({ locale }: { locale: string }) {
  const t = getT(locale)
  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false)
        setMobileDropdown(null)
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
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
      {/* Top bar — hidden on mobile */}
      <div className="hidden items-center justify-between bg-[var(--charcoal)] px-8 py-2 text-[11px] tracking-wider text-white/50 sm:flex">
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

      {/* Main nav */}
      <nav
        className={`sticky top-0 z-50 border-b border-[var(--border)] bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--charcoal)] text-lg">
              🌍
            </div>
            <span className="font-serif text-[19px] leading-none font-semibold text-[var(--charcoal)]">
              Med&apos;<span className="text-[var(--green)]">Equali</span>Team
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
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

          {/* Mobile: locale switcher + hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <div className="flex items-center gap-2 text-[11px] text-[var(--muted)]">
              <Link
                href="/en"
                className={locale === 'en' ? 'font-semibold text-[var(--charcoal)]' : ''}
              >
                EN
              </Link>
              <span className="opacity-30">/</span>
              <Link
                href="/fr"
                className={locale === 'fr' ? 'font-semibold text-[var(--charcoal)]' : ''}
              >
                FR
              </Link>
            </div>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-[var(--cream)]"
              aria-label="Toggle menu"
            >
              <span
                className={`block h-0.5 w-5 bg-[var(--charcoal)] transition-all duration-200 ${mobileOpen ? 'translate-y-2 rotate-45' : ''}`}
              />
              <span
                className={`block h-0.5 w-5 bg-[var(--charcoal)] transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`block h-0.5 w-5 bg-[var(--charcoal)] transition-all duration-200 ${mobileOpen ? '-translate-y-2 -rotate-45' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-[var(--border)] bg-white px-4 pb-4 md:hidden">
            {navItems.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between">
                  <Link
                    href={`/${locale}${item.href}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 py-3 text-[14px] font-medium text-[var(--charcoal)]"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <button
                      onClick={() =>
                        setMobileDropdown(mobileDropdown === item.label ? null : item.label)
                      }
                      className="px-2 py-3 text-[var(--muted)]"
                    >
                      <span
                        className={`block text-[10px] transition-transform duration-200 ${mobileDropdown === item.label ? 'rotate-180' : ''}`}
                      >
                        ▾
                      </span>
                    </button>
                  )}
                </div>
                {item.children && mobileDropdown === item.label && (
                  <div className="mb-2 ml-3 flex flex-col gap-1 border-l-2 border-[var(--border)] pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={`/${locale}${child.href}`}
                        onClick={() => setMobileOpen(false)}
                        className="py-2 text-[13px] text-[var(--muted)] hover:text-[var(--charcoal)]"
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
              onClick={() => setMobileOpen(false)}
              className="mt-3 block rounded-lg bg-[var(--green)] px-5 py-2.5 text-center text-[14px] font-medium text-white"
            >
              {t.nav.donate}
            </Link>
          </div>
        )}
      </nav>
    </>
  )
}
