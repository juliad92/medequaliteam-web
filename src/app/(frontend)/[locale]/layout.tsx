import React from 'react'
import { notFound } from 'next/navigation'
import { Analytics } from '@vercel/analytics/next'
import { getPayload } from 'payload'
import config from '@payload-config'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getProjectsWithVolunteerNeeds } from '@/lib/volunteer'

const locales = ['en', 'fr'] as const
type Locale = (typeof locales)[number]

export const dynamic = 'force-dynamic'

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

  const payload = await getPayload({ config })
  const volunteerProjects = await getProjectsWithVolunteerNeeds(payload, locale as Locale)

  return (
    <html lang={locale}>
      <body>
        <Navbar locale={locale} volunteerProjects={volunteerProjects} />
        {children}
        <Footer locale={locale} volunteerProjects={volunteerProjects} />
        <Analytics />
      </body>
    </html>
  )
}
