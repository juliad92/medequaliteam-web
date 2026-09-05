import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import LexicalRenderer from '@/components/richtext/LexicalRenderer'
import { getT } from '@/i18n/translations'
import { getPageBySlug, getPageRichTextContent } from '@/lib/pages'

import '../styles.css'

export const dynamic = 'force-dynamic'

const PAGE_SLUG = 'financial-report'

type Locale = 'en' | 'fr'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = getT(locale)
  const page = await getPageBySlug(PAGE_SLUG, locale as Locale)

  if (!page) {
    return {
      title: t.financialReport.metaTitle,
      description: t.financialReport.metaDescription,
    }
  }

  return {
    title: page.meta?.title || page.title || t.financialReport.metaTitle,
    description: page.meta?.description || t.financialReport.metaDescription,
  }
}

export default async function FinancialReportPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const page = await getPageBySlug(PAGE_SLUG, locale as Locale)

  if (!page) notFound()

  const content = getPageRichTextContent(page)

  return (
    <main className="min-h-screen bg-[var(--warm-white)]">
      <div className="mx-auto w-full max-w-2xl px-4 pt-6 pb-10 sm:px-6 sm:pt-8 sm:pb-14">
        <header className="mb-8 border-b border-[var(--border)] pb-8">
          <h1 className="mb-4 font-serif text-[28px] leading-tight font-normal text-[var(--charcoal)]">
            {page.title}
          </h1>
        </header>

        {content ? (
          <article>
            <LexicalRenderer content={content} variant="article" />
          </article>
        ) : null}
      </div>
    </main>
  )
}
