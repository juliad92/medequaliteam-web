import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import LexicalRenderer from '@/components/richtext/LexicalRenderer'
import JsonLd from '@/components/seo/JsonLd'
import { getT } from '@/i18n/translations'
import { breadcrumbJsonLd } from '@/lib/json-ld'
import { getPageBySlug, getPageRichTextContent } from '@/lib/pages'
import { buildCmsPageMetadata } from '@/lib/seo'

import '../styles.css'

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

  return buildCmsPageMetadata({
    locale,
    path: '/financial-report',
    page,
    fallbackTitle: t.financialReport.metaTitle,
    fallbackDescription: t.financialReport.metaDescription,
  })
}

export default async function FinancialReportPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = getT(locale)
  const page = await getPageBySlug(PAGE_SLUG, locale as Locale)

  if (!page) notFound()

  const content = getPageRichTextContent(page)

  return (
    <main className="min-h-screen bg-[var(--warm-white)]">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: page.title || t.financialReport.metaTitle, path: '/financial-report' },
        ])}
      />
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
