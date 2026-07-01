'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getT } from '@/i18n/translations'
import type { VolunteerProjectNavItem } from '@/lib/volunteer'

export default function Navbar({
  locale,
  volunteerProjects = [],
}: {
  locale: string
  volunteerProjects?: VolunteerProjectNavItem[]
}) {
  const t = getT(locale)
  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuDropdown, setMenuDropdown] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => {
    setMenuOpen(false)
    setMenuDropdown(null)
  }

  const volunteerNav = {
    label: t.nav.volunteer,
    href: volunteerProjects[0]
      ? `/volunteer/${volunteerProjects[0].slug}`
      : '/volunteer/stories',
    children: [
      ...volunteerProjects.map((project) => ({
        label: project.title,
        href: `/volunteer/${project.slug}`,
      })),
      { label: t.nav.volunteerStories, href: '/volunteer/stories' },
    ],
  }

  const drawerNavItems = [
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
    volunteerNav,
    { label: t.nav.news, href: '/news' },
  ]

  return (
    <>
      {/* Top bar — always visible */}
      <div className="flex items-center justify-between gap-2 bg-[var(--charcoal)] px-4 py-2 text-[12px] tracking-wider text-white/50 sm:px-8 sm:text-[13px]">
        <div className="flex gap-2 sm:gap-4">
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
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/en"
            className={
              locale === 'en' ? 'font-medium text-white' : 'transition-colors hover:text-white'
            }
          >
            <span className="sm:hidden">EN</span>
            <span className="hidden sm:inline">🇬🇧 English</span>
          </Link>
          <span className="opacity-30">/</span>
          <Link
            href="/fr"
            className={
              locale === 'fr' ? 'font-medium text-white' : 'transition-colors hover:text-white'
            }
          >
            <span className="sm:hidden">FR</span>
            <span className="hidden sm:inline">🇫🇷 Français</span>
          </Link>
        </div>
      </div>

      {/* Main nav */}
      <nav
        className={`sticky top-0 z-50 border-b border-[var(--border)] bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            {/* Burger — left side */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-[var(--cream)]"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span
                className={`block h-0.5 w-5 bg-[var(--charcoal)] transition-all duration-200 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`}
              />
              <span
                className={`block h-0.5 w-5 bg-[var(--charcoal)] transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`block h-0.5 w-5 bg-[var(--charcoal)] transition-all duration-200 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`}
              />
            </button>

            {/* Logo */}
            <Link href={`/${locale}`} className="flex min-w-0 items-center">
              <Image
                src="/logo.png"
                alt="Med'EqualiTeam"
                width={155}
                height={36}
                className="h-9 w-auto max-w-[min(155px,50vw)] shrink-0 object-contain object-left"
                priority
              />
            </Link>
          </div>

          {/* Volunteer + Donate — always visible */}
          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            <div
              className="relative flex items-center"
              onMouseEnter={() => setOpenDropdown(volunteerNav.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={`/${locale}${volunteerNav.href}`}
                className="rounded-lg px-2 py-1.5 text-[14px] font-medium text-[var(--muted)] transition-all hover:bg-[var(--cream)] hover:text-[var(--charcoal)] sm:px-3 sm:py-2 sm:text-[16px]"
              >
                {volunteerNav.label}
                <span className="ml-0.5 hidden text-[12px] opacity-50 md:inline">▾</span>
              </Link>
              <button
                type="button"
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === volunteerNav.label ? null : volunteerNav.label,
                  )
                }
                className="flex h-8 w-7 items-center justify-center rounded-lg text-[12px] text-[var(--muted)] hover:bg-[var(--cream)] md:hidden"
                aria-expanded={openDropdown === volunteerNav.label}
                aria-label={`${openDropdown === volunteerNav.label ? 'Collapse' : 'Expand'} ${volunteerNav.label}`}
              >
                ▾
              </button>
              {openDropdown === volunteerNav.label && (
                <div className="absolute top-full right-0 z-50 mt-1 min-w-[200px] rounded-xl border border-[var(--border)] bg-white py-2 shadow-lg md:left-0 md:right-auto">
                  {volunteerNav.children.map((child) => (
                    <Link
                      key={child.href}
                      href={`/${locale}${child.href}`}
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2.5 text-[15px] text-[var(--muted)] transition-colors hover:bg-[var(--cream)] hover:text-[var(--charcoal)]"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              href={`/${locale}/donate`}
              className="rounded-lg bg-[var(--green)] px-3 py-1.5 text-[14px] font-medium text-white transition-colors hover:bg-[var(--green-dark)] sm:ml-1 sm:px-5 sm:py-2 sm:text-[16px]"
            >
              {t.nav.donate}
            </Link>
          </div>
        </div>
      </nav>

      {/* Drawer — slides in from the left */}
      <div
        className={`fixed inset-0 z-[60] ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!menuOpen}
      >
        {/* Backdrop */}
        <button
          type="button"
          onClick={closeMenu}
          className={`absolute inset-0 bg-[var(--charcoal)]/40 transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
        />

        {/* Panel */}
        <aside
          className={`absolute top-0 left-0 flex h-full w-[min(300px,85vw)] flex-col bg-white shadow-xl transition-transform duration-300 ease-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--border)] px-4">
            <span className="font-serif text-[17px] font-semibold text-[var(--charcoal)]">
              Menu
            </span>
            <button
              type="button"
              onClick={closeMenu}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--cream)] hover:text-[var(--charcoal)]"
              aria-label="Close menu"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path
                  d="M4 4L14 14M14 4L4 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-3">
            {drawerNavItems.map((item) => (
              <div key={item.label} className="border-b border-[var(--border)] last:border-b-0">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/${locale}${item.href}`}
                    onClick={closeMenu}
                    className="flex-1 py-3.5 text-[16px] font-medium text-[var(--charcoal)]"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <button
                      type="button"
                      onClick={() =>
                        setMenuDropdown(menuDropdown === item.label ? null : item.label)
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--cream)]"
                      aria-expanded={menuDropdown === item.label}
                      aria-label={`${menuDropdown === item.label ? 'Collapse' : 'Expand'} ${item.label}`}
                    >
                      <span
                        className={`block text-[13px] transition-transform duration-200 ${menuDropdown === item.label ? 'rotate-180' : ''}`}
                      >
                        ▾
                      </span>
                    </button>
                  )}
                </div>
                {item.children && menuDropdown === item.label && (
                  <div className="mb-3 ml-1 flex flex-col gap-0.5 border-l-2 border-[var(--green)] pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={`/${locale}${child.href}`}
                        onClick={closeMenu}
                        className="py-2 text-[16px] text-[var(--muted)] transition-colors hover:text-[var(--charcoal)]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

        </aside>
      </div>
    </>
  )
}
