import React from 'react'
import type { Metadata } from 'next'

import ComplaintsContent from '@/components/complaints/ComplaintsContent'
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
    path: '/complaints',
    title: t.complaints.metaTitle,
    description: t.complaints.metaDescription,
  })
}

export default async function ComplaintsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = getT(locale)

  return (
    <main className="min-h-screen bg-[var(--warm-white)]">
      <JsonLd
        data={breadcrumbJsonLd(locale, [{ name: t.complaints.metaTitle, path: '/complaints' }])}
      />
      <h2 className="sr-only">{t.complaints.srTitle}</h2>
      <ComplaintsContent locale={locale} />
    </main>
  )
}
