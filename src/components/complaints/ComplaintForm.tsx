'use client'

import React, { useState } from 'react'

import PhoneCountryCodeSelect from '@/components/volunteer/PhoneCountryCodeSelect'
import { getT } from '@/i18n/translations'

type SensitiveChoice = '' | 'yes' | 'no'

type FieldName =
  | 'isSensitive'
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phoneCountryCode'
  | 'phone'
  | 'details'

type FieldErrors = Partial<Record<FieldName, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const inputClass =
  'h-11 w-full rounded-lg border border-[var(--border)] bg-white px-4 text-[14px] text-[var(--charcoal)] outline-none focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/20'
const textareaClass =
  'w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-[14px] text-[var(--charcoal)] outline-none focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/20'
const inputErrorClass =
  'h-11 w-full rounded-lg border border-red-500 bg-white px-4 text-[14px] text-[var(--charcoal)] outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
const textareaErrorClass =
  'w-full rounded-lg border border-red-500 bg-white px-4 py-3 text-[14px] text-[var(--charcoal)] outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20'

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="text-[12px] text-red-700" role="alert">
      {message}
    </p>
  )
}

function FieldLabel({
  children,
  required = false,
  htmlFor,
}: {
  children: React.ReactNode
  required?: boolean
  htmlFor?: string
}) {
  return (
    <label htmlFor={htmlFor} className="text-[12px] font-medium text-[var(--charcoal)]">
      {children}
      {required ? (
        <span className="ml-0.5 text-red-600" title="Required" aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="border-b border-[var(--border)] pt-6 pb-2 text-[12px] font-medium tracking-[0.12em] text-[var(--green)] uppercase first:pt-0">
      {children}
    </h3>
  )
}

export default function ComplaintForm({ locale }: { locale: string }) {
  const f = getT(locale).complaints.form

  const [isSensitive, setIsSensitive] = useState<SensitiveChoice>('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneCountryCode, setPhoneCountryCode] = useState('')
  const [phone, setPhone] = useState('')
  const [details, setDetails] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  function clearFieldError(field: FieldName) {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  function validate(): boolean {
    const errors: FieldErrors = {}

    if (!isSensitive) errors.isSensitive = f.fieldErrors.required
    if (!firstName.trim()) errors.firstName = f.fieldErrors.required
    if (!lastName.trim()) errors.lastName = f.fieldErrors.required
    if (!email.trim()) {
      errors.email = f.fieldErrors.required
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      errors.email = f.fieldErrors.email
    }
    if (!phoneCountryCode.trim()) errors.phoneCountryCode = f.fieldErrors.required
    if (!phone.trim()) errors.phone = f.fieldErrors.required
    if (!details.trim()) errors.details = f.fieldErrors.required

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    validate()
    // Submission handling (database storage, email routing) to be implemented later.
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 border-t border-[var(--border)] pt-8" noValidate>
      <fieldset className="grid gap-3">
        <legend className="text-[13px] leading-relaxed text-[var(--charcoal)]">
          {f.sensitiveLabel}
        </legend>
        <div className="flex gap-6">
          {(['yes', 'no'] as const).map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-[14px] text-[var(--muted)]">
              <input
                type="radio"
                name="isSensitive"
                value={opt}
                checked={isSensitive === opt}
                onChange={() => {
                  setIsSensitive(opt)
                  clearFieldError('isSensitive')
                }}
                className="accent-[var(--green)]"
              />
              {opt === 'yes' ? f.yes : f.no}
            </label>
          ))}
        </div>
        <FieldError id="isSensitive-error" message={fieldErrors.isSensitive} />
      </fieldset>

      <SectionTitle>{f.personalDetails}</SectionTitle>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <FieldLabel htmlFor="firstName" required>
            {f.firstName}
          </FieldLabel>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value)
              clearFieldError('firstName')
            }}
            autoComplete="given-name"
            aria-invalid={fieldErrors.firstName ? true : undefined}
            aria-describedby={fieldErrors.firstName ? 'firstName-error' : undefined}
            className={fieldErrors.firstName ? inputErrorClass : inputClass}
          />
          <FieldError id="firstName-error" message={fieldErrors.firstName} />
        </div>

        <div className="grid gap-1.5">
          <FieldLabel htmlFor="lastName" required>
            {f.lastName}
          </FieldLabel>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value)
              clearFieldError('lastName')
            }}
            autoComplete="family-name"
            aria-invalid={fieldErrors.lastName ? true : undefined}
            aria-describedby={fieldErrors.lastName ? 'lastName-error' : undefined}
            className={fieldErrors.lastName ? inputErrorClass : inputClass}
          />
          <FieldError id="lastName-error" message={fieldErrors.lastName} />
        </div>

        <div className="grid gap-1.5 sm:col-span-2">
          <FieldLabel htmlFor="email" required>
            {f.email}
          </FieldLabel>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              clearFieldError('email')
            }}
            autoComplete="email"
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            className={fieldErrors.email ? inputErrorClass : inputClass}
          />
          <FieldError id="email-error" message={fieldErrors.email} />
        </div>

        <div className="grid gap-1.5">
          <FieldLabel htmlFor="phoneCountryCode" required>
            {f.phoneCountryCode}
          </FieldLabel>
          <PhoneCountryCodeSelect
            id="phoneCountryCode"
            value={phoneCountryCode}
            onChange={(value) => {
              setPhoneCountryCode(value)
              clearFieldError('phoneCountryCode')
            }}
            locale={locale}
            hasError={!!fieldErrors.phoneCountryCode}
          />
          <FieldError id="phoneCountryCode-error" message={fieldErrors.phoneCountryCode} />
        </div>

        <div className="grid gap-1.5">
          <FieldLabel htmlFor="phone" required>
            {f.phone}
          </FieldLabel>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              clearFieldError('phone')
            }}
            autoComplete="tel-national"
            aria-invalid={fieldErrors.phone ? true : undefined}
            aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
            className={fieldErrors.phone ? inputErrorClass : inputClass}
          />
          <FieldError id="phone-error" message={fieldErrors.phone} />
        </div>
      </div>

      <SectionTitle>{f.complaintDetails}</SectionTitle>
      <div className="mt-4 grid gap-1.5">
        <FieldLabel htmlFor="details" required>
          {f.complaintDetailsLabel}
        </FieldLabel>
        <textarea
          id="details"
          rows={6}
          value={details}
          onChange={(e) => {
            setDetails(e.target.value)
            clearFieldError('details')
          }}
          aria-invalid={fieldErrors.details ? true : undefined}
          aria-describedby={fieldErrors.details ? 'details-error' : undefined}
          className={fieldErrors.details ? textareaErrorClass : textareaClass}
        />
        <FieldError id="details-error" message={fieldErrors.details} />
      </div>

      <div className="mt-8">
        <button
          type="submit"
          className="h-11 rounded-lg bg-[var(--green)] px-6 text-[14px] font-medium text-white transition-colors hover:bg-[var(--green-dark)]"
        >
          {f.submit}
        </button>
      </div>
    </form>
  )
}
