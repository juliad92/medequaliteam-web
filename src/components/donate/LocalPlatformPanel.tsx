import { getT } from '@/i18n/translations'
import type { LocalPlatformCountryCode } from '@/lib/donate/config'

export default function LocalPlatformPanel({
  country,
  locale,
  platform,
  url,
}: {
  country: LocalPlatformCountryCode
  locale: string
  platform: string
  url: string
}) {
  const d = getT(locale).donate

  return (
    <div className="space-y-4 text-[15px] leading-relaxed text-[var(--charcoal)]">
      <p className="text-[var(--muted)]">{d.localPlatform[country].description}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--green)] text-[15px] font-medium text-white transition-colors hover:bg-[var(--green-dark)]"
      >
        <svg
          className="h-[16px] w-[16px]"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        {d.donateNow}
      </a>
      <p className="text-center text-[13px] text-[var(--muted)]">
        {d.platformNote.replace('{platform}', platform)}
      </p>
    </div>
  )
}
