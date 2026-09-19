import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import PageHero from '@/components/pages/PageHero'
import LexicalRenderer from '@/components/richtext/LexicalRenderer'
import { getT } from '@/i18n/translations'
import { getPageBySlug, getPageHero, getPageRichTextContent } from '@/lib/pages'
import { buildCmsPageMetadata } from '@/lib/seo'

import '../../styles.css'

export const dynamic = 'force-dynamic'

const PAGE_SLUG = 'about/why-we-exist'

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
    path: '/about/why-we-exist',
    page,
    fallbackTitle: t.whyWeExist.metaTitle,
    fallbackDescription: t.whyWeExist.metaDescription,
  })
}

export default async function WhyWeExistPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const page = await getPageBySlug(PAGE_SLUG, locale as Locale)

  if (!page) notFound()

  const hero = getPageHero(page)
  const content = getPageRichTextContent(page)

  return (
    <>
      <PageHero locale={locale} hero={hero} fallbackHeading={page.title} />

      <main className="bg-[var(--warm-white)] px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto w-full max-w-2xl">
          {content ? (
            <article>
              <LexicalRenderer content={content} variant="article" />
            </article>
          ) : null}
        </div>
      </main>
    </>
  )
}
