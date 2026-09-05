import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import LexicalRenderer from '@/components/richtext/LexicalRenderer'
import { getT } from '@/i18n/translations'
import { getPageBySlug, getPageRichTextContent } from '@/lib/pages'

import '../styles.css'

export const dynamic = 'force-dynamic'

const PAGE_SLUG = 'data-protection'

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
      title: t.dataProtection.metaTitle,
      description: t.dataProtection.metaDescription,
    }
  }

  return {
    title: page.meta?.title || page.title || t.dataProtection.metaTitle,
    description: page.meta?.description || t.dataProtection.metaDescription,
  }
}

export default async function DataProtectionPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = getT(locale)
  const page = await getPageBySlug(PAGE_SLUG, locale as Locale)

  if (!page) notFound()

  const content = getPageRichTextContent(page)
  const dates = page.policyDates
  const hasDates = Boolean(dates?.approvedOn || dates?.reviewedOn || dates?.reviewDate)

  return (
    <main className="min-h-screen bg-[var(--warm-white)]">
      <div className="mx-auto w-full max-w-2xl px-4 pt-6 pb-10 sm:px-6 sm:pt-8 sm:pb-14">
        <header className="mb-8 border-b border-[var(--border)] pb-8">
          <h1 className="mb-4 font-serif text-[28px] leading-tight font-normal text-[var(--charcoal)]">
            {page.title}
          </h1>
          {hasDates ? (
            <dl className="flex flex-col gap-1.5 text-[13px] text-[var(--muted)] sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-1">
              {dates?.approvedOn ? (
                <div className="flex gap-1.5">
                  <dt className="font-medium text-[var(--charcoal)]">
                    {t.dataProtection.approvedOn}
                  </dt>
                  <dd>{dates.approvedOn}</dd>
                </div>
              ) : null}
              {dates?.reviewedOn ? (
                <div className="flex gap-1.5">
                  <dt className="font-medium text-[var(--charcoal)]">
                    {t.dataProtection.reviewedOn}
                  </dt>
                  <dd>{dates.reviewedOn}</dd>
                </div>
              ) : null}
              {dates?.reviewDate ? (
                <div className="flex gap-1.5">
                  <dt className="font-medium text-[var(--charcoal)]">
                    {t.dataProtection.reviewDate}
                  </dt>
                  <dd>{dates.reviewDate}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}
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
