'use client'

import React, { useState } from 'react'
import { getT } from '@/i18n/translations'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const inputClass =
  'h-11 w-full rounded-lg border border-[var(--border)] bg-white px-4 text-[15px] text-[var(--charcoal)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/20'
const inputErrorClass =
  'h-11 w-full rounded-lg border border-red-500 bg-white px-4 text-[15px] text-[var(--charcoal)] outline-none placeholder:text-[var(--muted)] focus:border-red-500 focus:ring-2 focus:ring-red-500/20'

type FieldErrors = {
  firstName?: string
  email?: string
}

export default function NewsletterBanner({ locale }: { locale: string }) {
  const t = getT(locale).newsletter
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  function clearFieldError(field: keyof FieldErrors) {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  function validate(): FieldErrors {
    const errors: FieldErrors = {}
    if (!firstName.trim()) errors.firstName = t.fieldErrors.required
    if (!email.trim()) {
      errors.email = t.fieldErrors.required
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      errors.email = t.fieldErrors.invalidEmail
    }
    return errors
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setStatus('submitting')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          email: email.trim(),
          locale,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setStatus('error')
        return
      }
      setStatus('success')
      setFirstName('')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="bg-[var(--cream)] px-4 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 md:grid-cols-[1fr_auto] md:gap-16">
        <div>
          <p className="mb-3 text-[13px] font-medium tracking-[0.15em] text-[var(--green)] uppercase">
            {t.eyebrow}
          </p>
          <h2
            className="mb-3 font-serif leading-tight text-[var(--charcoal)]"
            style={{ fontSize: 'clamp(24px, 2.8vw, 34px)', fontWeight: 300 }}
          >
            {t.title}
          </h2>
          <p className="max-w-md text-base leading-relaxed text-[var(--muted)]">{t.body}</p>
        </div>

        {status === 'success' ? (
          <p className="max-w-md text-base leading-relaxed text-[var(--green-dark)]" role="status">
            {t.success}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex w-full flex-col gap-3 sm:max-w-md md:w-[min(100%,28rem)]"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <label htmlFor="newsletter-firstName" className="sr-only">
                  {t.firstName}
                </label>
                <input
                  id="newsletter-firstName"
                  type="text"
                  name="firstName"
                  autoComplete="given-name"
                  placeholder={t.firstName}
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value)
                    clearFieldError('firstName')
                    if (status === 'error') setStatus('idle')
                  }}
                  aria-invalid={fieldErrors.firstName ? true : undefined}
                  aria-describedby={fieldErrors.firstName ? 'newsletter-firstName-error' : undefined}
                  className={fieldErrors.firstName ? inputErrorClass : inputClass}
                />
                {fieldErrors.firstName && (
                  <p
                    id="newsletter-firstName-error"
                    className="text-[14px] text-red-700"
                    role="alert"
                  >
                    {fieldErrors.firstName}
                  </p>
                )}
              </div>

              <div className="grid gap-1.5">
                <label htmlFor="newsletter-email" className="sr-only">
                  {t.email}
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder={t.email}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    clearFieldError('email')
                    if (status === 'error') setStatus('idle')
                  }}
                  aria-invalid={fieldErrors.email ? true : undefined}
                  aria-describedby={fieldErrors.email ? 'newsletter-email-error' : undefined}
                  className={fieldErrors.email ? inputErrorClass : inputClass}
                />
                {fieldErrors.email && (
                  <p id="newsletter-email-error" className="text-[14px] text-red-700" role="alert">
                    {fieldErrors.email}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="h-11 rounded-lg bg-[var(--green)] px-6 text-[15px] font-medium text-white transition-colors hover:bg-[var(--green-dark)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === 'submitting' ? t.submitting : t.submit}
            </button>

            {status === 'error' && (
              <p className="text-[14px] text-red-700" role="alert">
                {t.error}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  )
}
