import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import PageHero from '@/components/pages/PageHero'
import LexicalRenderer from '@/components/richtext/LexicalRenderer'
import JsonLd from '@/components/seo/JsonLd'
import { getT } from '@/i18n/translations'
import { breadcrumbJsonLd } from '@/lib/json-ld'
import { getPageBySlug, getPageHero, getPageRichTextContent } from '@/lib/pages'
import { buildCmsPageMetadata } from '@/lib/seo'

import '../../styles.css'

const PAGE_SLUG = 'about/meet-team'

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
    path: '/about/meet-team',
    page,
    fallbackTitle: t.whyWeExist.metaTitle,
    fallbackDescription: t.whyWeExist.metaDescription,
  })
}

export default async function MeetTeamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = getT(locale)
  const page = await getPageBySlug(PAGE_SLUG, locale as Locale)

  if (!page) notFound()

  const hero = getPageHero(page)
  const content = getPageRichTextContent(page)

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: t.nav.about, path: '/about/why-we-exist' },
          { name: page.title || t.nav.aboutTeam, path: '/about/meet-team' },
        ])}
      />
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
