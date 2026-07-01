import React from 'react'
import { getT } from '@/i18n/translations'
import { INSTAGRAM_HANDLE, INSTAGRAM_PROFILE, type InstagramPost } from '@/lib/instagram'

function formatPostDate(timestamp: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(timestamp))
}

function truncateCaption(caption: string, maxLength = 100): string {
  const firstLine = caption.split('\n')[0]?.trim() ?? ''
  if (firstLine.length <= maxLength) return firstLine
  return `${firstLine.slice(0, maxLength).trimEnd()}…`
}

export default function InstagramFeed({
  locale,
  posts,
}: {
  locale: string
  posts: InstagramPost[]
}) {
  const t = getT(locale)

  if (posts.length === 0) return null

  return (
    <div className="mt-14 border-t border-[var(--border)] pt-12 sm:mt-16 sm:pt-14">
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-[11px] font-medium tracking-[0.15em] text-[var(--green)] uppercase">
            Instagram
          </p>
          <h3
            className="font-serif leading-tight text-[var(--charcoal)]"
            style={{ fontSize: 'clamp(24px, 2.5vw, 32px)', fontWeight: 300 }}
          >
            {t.news.instagramTitle}
          </h3>
        </div>
        <a
          href={INSTAGRAM_PROFILE}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border-b border-[var(--border)] pb-0.5 text-[13.5px] font-medium text-[var(--muted)] transition-colors hover:border-[var(--charcoal)] hover:text-[var(--charcoal)]"
        >
          <InstagramIcon />
          {t.news.instagramFollow}
        </a>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--cream)]"
            aria-label={
              post.caption
                ? `${t.news.instagramPost}: ${truncateCaption(post.caption, 80)}`
                : `${t.news.instagramPost} @${INSTAGRAM_HANDLE}`
            }
          >
            <img
              src={post.imageUrl}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {post.caption ? (
                <p className="mb-1 line-clamp-2 text-[11px] leading-snug text-white/90">
                  {truncateCaption(post.caption, 80)}
                </p>
              ) : null}
              <p className="text-[10px] text-white/60">{formatPostDate(post.timestamp, locale)}</p>
            </div>
            {post.mediaType === 'VIDEO' ? (
              <span className="absolute top-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white">
                {t.news.instagramVideo}
              </span>
            ) : null}
          </a>
        ))}
      </div>
    </div>
  )
}

function InstagramIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
