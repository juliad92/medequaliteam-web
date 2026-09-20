import React from 'react'
import type { Metadata } from 'next'

import DonationForm from '@/components/donate/DonationForm'
import JsonLd from '@/components/seo/JsonLd'
import { getT } from '@/i18n/translations'
import { breadcrumbJsonLd } from '@/lib/json-ld'
import { buildPageMetadata } from '@/lib/seo'

import '../styles.css'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = getT(locale)

  return buildPageMetadata({
    locale,
    path: '/donate',
    title: t.donate.metaTitle,
    description: t.donate.metaDescription,
  })
}

export default async function DonatePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = getT(locale)

  return (
    <main className="min-h-screen bg-[var(--warm-white)]">
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: t.donate.metaTitle, path: '/donate' }])} />
      <h2 className="sr-only">{t.donate.srTitle}</h2>
      <DonationForm locale={locale} />
    </main>
  )
}
