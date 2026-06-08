import React from 'react'
import type { Metadata } from 'next'

import DonationForm from '@/components/donate/DonationForm'
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
    title: t.donate.metaTitle,
    description: t.donate.metaDescription,
  }
}

export default async function DonatePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = getT(locale)

  return (
    <main className="min-h-screen bg-[var(--warm-white)]">
      <h2 className="sr-only">{t.donate.srTitle}</h2>
      <DonationForm locale={locale} />
    </main>
  )
}
