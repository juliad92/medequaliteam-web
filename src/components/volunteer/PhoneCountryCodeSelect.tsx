import React from 'react'

import {
  PHONE_COUNTRY_CODES,
  formatPhoneCountryCodeOption,
} from '@/lib/phoneCountryCodes'

const baseClass =
  'h-11 rounded-lg border bg-white px-3 text-[15px] text-[var(--charcoal)] outline-none focus:ring-2'

export default function PhoneCountryCodeSelect({
  value,
  onChange,
  locale,
  id,
  hasError = false,
  inputRef,
}: {
  value: string
  onChange: (value: string) => void
  locale: string
  id?: string
  hasError?: boolean
  inputRef?: React.Ref<HTMLSelectElement>
}) {
  const fr = locale === 'fr'
  const borderClass = hasError
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
    : 'border-[var(--border)] focus:border-[var(--green)] focus:ring-[var(--green)]/20'

  return (
    <select
      ref={inputRef}
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={hasError || undefined}
      className={`${baseClass} ${borderClass}`}
    >
      <option value="">{fr ? '— Sélectionner —' : '— Select —'}</option>
      {PHONE_COUNTRY_CODES.map((option) => (
        <option key={option.code} value={option.code}>
          {formatPhoneCountryCodeOption(option, locale)}
        </option>
      ))}
    </select>
  )
}
