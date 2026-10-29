'use client'

import React, { useEffect, useState } from 'react'
import { getT } from '@/i18n/translations'

const STORAGE_KEY = 'met-cookie-consent'

export default function CookieBanner({ locale }: { locale: string }) {
  const t = getT(locale).cookies
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== '1') {
        setVisible(true)
      }
    } catch {
      setVisible(true)
    }
  }, [])

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // ignore storage failures
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label={t.message}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-[var(--warm-white)] px-4 py-2.5 shadow-[0_-8px_24px_rgba(17,20,16,0.08)] sm:px-8 sm:py-3"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-[14px] leading-snug text-[var(--charcoal)]">
          {t.message}{' '}
          <a
            href="https://www.cookiesandyou.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--green)] underline decoration-[var(--green)]/30 underline-offset-2 transition-colors hover:text-[var(--green-dark)] hover:decoration-[var(--green-dark)]"
          >
            {t.learnMore}
          </a>
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-[var(--green)] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[var(--green-dark)]"
        >
          {t.accept}
        </button>
      </div>
    </div>
  )
}
