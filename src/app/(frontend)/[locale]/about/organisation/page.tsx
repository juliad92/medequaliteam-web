import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import PageHero from '@/components/pages/PageHero'
import LexicalRenderer from '@/components/richtext/LexicalRenderer'
import { getT } from '@/i18n/translations'
import { getPageBySlug, getPageHero, getPageRichTextContent } from '@/lib/pages'

import '../../styles.css'

export const dynamic = 'force-dynamic'

const PAGE_SLUG = 'about/organisation'

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
      title: t.whyWeExist.metaTitle,
      description: t.whyWeExist.metaDescription,
    }
  }

  return {
    title: page.meta?.title || page.title || t.whyWeExist.metaTitle,
    description: page.meta?.description || t.whyWeExist.metaDescription,
  }
}

export default async function WhyWeExistPage({ params }: { params: Promise<{ locale: string }> }) {
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
