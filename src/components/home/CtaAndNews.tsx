import React from 'react'
import Link from 'next/link'
import { getT } from '@/i18n/translations'

export function VolunteerCTA({
  locale,
  volunteerHref,
}: {
  locale: string
  volunteerHref: string
}) {
  const t = getT(locale)
  return (
    <section className="px-8 py-20" style={{ background: 'var(--green-dark)' }}>
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-16">
        <div>
          <p className="mb-4 text-[11px] font-medium tracking-[0.15em] text-white/40 uppercase">
            {t.volunteerCta.eyebrow}
          </p>
          <h2
            className="mb-4 font-serif leading-tight text-white"
            style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 300 }}
          >
            {t.volunteerCta.title}
          </h2>
          <p className="max-w-lg text-base leading-relaxed text-white/50">{t.volunteerCta.body}</p>
        </div>
        <div className="flex flex-shrink-0 flex-col gap-3">
          <Link
            href={volunteerHref}
            className="rounded-lg bg-white px-8 py-3.5 text-center text-sm font-medium text-[var(--green-dark)] transition-colors hover:bg-[var(--cream)]"
          >
            {t.volunteerCta.primary}
          </Link>
          <Link
            href={`/${locale}/volunteer/stories`}
            className="rounded-lg border border-white/25 px-8 py-3.5 text-center text-sm font-medium text-white/70 transition-colors hover:border-white/60 hover:text-white"
          >
            {t.volunteerCta.secondary}
          </Link>
        </div>
      </div>
    </section>
  )
}

const getPlaceholderPosts = (locale: string) => [
  {
    slug: 'annual-report-2025',
    category: locale === 'fr' ? 'Rapport annuel' : 'Annual report',
    title:
      locale === 'fr'
        ? 'Notre rapport annuel 2025 est disponible'
        : 'Our 2025 Annual Report is out',
    excerpt:
      locale === 'fr'
        ? 'Un bilan complet de notre année à Thessalonique.'
        : 'A full review of our year in Thessaloniki.',
    date: 'May 2025',
    gradient: 'linear-gradient(135deg, #9dbf9d, #7aa07a)',
  },
  {
    slug: 'mobile-clinic',
    category: locale === 'fr' ? 'Actualité terrain' : 'Field update',
    title:
      locale === 'fr' ? 'Nouvelle clinique mobile à Oreokastro' : 'New mobile clinic in Oreokastro',
    excerpt: '',
    date: 'March 2025',
    gradient: 'linear-gradient(135deg, #b5c5b5, #96aa96)',
  },
  {
    slug: 'newsletter-2025',
    category: locale === 'fr' ? 'Newsletter' : 'Newsletter',
    title: locale === 'fr' ? 'Hiver 2025 — Nouvelles de Grèce' : 'Winter 2025 — Update from Greece',
    excerpt: '',
    date: 'January 2025',
    gradient: 'linear-gradient(135deg, #aab8c8, #8898b0)',
  },
]

export function NewsSection({ locale, posts }: { locale: string; posts?: any[] }) {
  const t = getT(locale)
  const displayPosts = posts && posts.length > 0 ? posts : getPlaceholderPosts(locale)
  const [featured, ...rest] = displayPosts
  return (
    <section className="bg-white px-8 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-3 text-[11px] font-medium tracking-[0.15em] text-[var(--green)] uppercase">
              {t.news.eyebrow}
            </p>
            <h2
              className="font-serif leading-tight text-[var(--charcoal)]"
              style={{ fontSize: 'clamp(30px, 3.5vw, 44px)', fontWeight: 300 }}
            >
              {t.news.title}
            </h2>
          </div>
          <Link
            href={`/${locale}/news`}
            className="border-b border-[var(--border)] pb-0.5 text-[13.5px] font-medium text-[var(--muted)] transition-colors hover:border-[var(--charcoal)] hover:text-[var(--charcoal)]"
          >
            {t.news.viewAll} →
          </Link>
        </div>
        <div className="grid grid-cols-[2fr_1fr_1fr] gap-6">
          <div className="cursor-pointer overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--cream)] transition-shadow hover:shadow-lg">
            <div className="h-56" style={{ background: featured.gradient }} />
            <div className="p-6">
              <p className="mb-2 text-[10.5px] font-medium tracking-[0.12em] text-[var(--green)] uppercase">
                {featured.category}
              </p>
              <h3 className="mb-3 font-serif text-xl leading-snug font-normal text-[var(--charcoal)]">
                {featured.title}
              </h3>
              {featured.excerpt && (
                <p className="mb-3 text-[13.5px] leading-relaxed text-[var(--muted)]">
                  {featured.excerpt}
                </p>
              )}
              <p className="text-[12px] text-[var(--muted)]">{featured.date}</p>
            </div>
          </div>
          {rest.map((post: any) => (
            <div
              key={post.slug}
              className="cursor-pointer overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--cream)] transition-shadow hover:shadow-lg"
            >
              <div className="h-32" style={{ background: post.gradient }} />
              <div className="p-5">
                <p className="mb-2 text-[10.5px] font-medium tracking-[0.12em] text-[var(--green)] uppercase">
                  {post.category}
                </p>
                <h3 className="mb-3 font-serif text-[16px] leading-snug font-normal text-[var(--charcoal)]">
                  {post.title}
                </h3>
                <p className="text-[12px] text-[var(--muted)]">{post.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
