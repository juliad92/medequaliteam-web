import React from 'react'
import type { Metadata } from 'next'

import ComplaintsContent from '@/components/complaints/ComplaintsContent'
import { getT } from '@/i18n/translations'

import '../styles.css'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = getT(locale)

  return {
    title: t.complaints.metaTitle,
    description: t.complaints.metaDescription,
  }
}

export default async function ComplaintsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = getT(locale)

  return (
    <main className="min-h-screen bg-[var(--warm-white)]">
      <h2 className="sr-only">{t.complaints.srTitle}</h2>
      <ComplaintsContent locale={locale} />
    </main>
  )
}
