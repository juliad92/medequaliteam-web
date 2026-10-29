import React from 'react'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'

import Navbar from '@/components/layout/Navbar'
import NewsletterBanner from '@/components/layout/NewsletterBanner'
import CookieBanner from '@/components/layout/CookieBanner'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import { montserrat } from '@/lib/fonts'
import { organizationAndWebsiteJsonLd } from '@/lib/json-ld'
import { getCachedProjectsForNav } from '@/lib/projects'
import { getCachedProjectsWithVolunteerNeeds } from '@/lib/volunteer'

const locales = ['en', 'fr'] as const
type Locale = (typeof locales)[number]

/** ISR for all public marketing routes under this locale layout (seconds). */
export const revalidate = 300

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
    <html lang={locale} className={`${montserrat.variable} ${montserrat.className}`}>
      <body>
        <JsonLd data={organizationAndWebsiteJsonLd(locale)} />
        <Navbar locale={locale} volunteerProjects={volunteerProjects} projects={projects} />
        {children}
        <NewsletterBanner locale={locale} />
        <Footer locale={locale} volunteerProjects={volunteerProjects} projects={projects} />
        <CookieBanner locale={locale} />
        <Analytics />
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="a4912dce-c7b7-49b5-ba74-de2d0a6e9cd2"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
