import React from 'react'
import { notFound } from 'next/navigation'
import { Analytics } from '@vercel/analytics/next'

import Navbar from '@/components/layout/Navbar'
import NewsletterBanner from '@/components/layout/NewsletterBanner'
import Footer from '@/components/layout/Footer'
import { getCachedProjectsForNav } from '@/lib/projects'
import { getCachedProjectsWithVolunteerNeeds } from '@/lib/volunteer'

const locales = ['en', 'fr'] as const
type Locale = (typeof locales)[number]

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) notFound()

  const [volunteerProjects, projects] = await Promise.all([
    getCachedProjectsWithVolunteerNeeds(locale as Locale),
    getCachedProjectsForNav(locale as Locale),
  ])

  return (
    <html lang={locale}>
      <body>
        <Navbar locale={locale} volunteerProjects={volunteerProjects} projects={projects} />
        {children}
        <NewsletterBanner locale={locale} />
        <Footer locale={locale} volunteerProjects={volunteerProjects} projects={projects} />
        <Analytics />
      </body>
    </html>
  )
}
