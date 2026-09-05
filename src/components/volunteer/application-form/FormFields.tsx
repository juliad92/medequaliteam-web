'use client'

import React from 'react'

import { STEP_COUNT } from './types'
import type { YesNo } from './types'

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="text-[14px] text-red-700" role="alert">
      {message}
    </p>
  )
}

export function FieldLabel({
  children,
  required = false,
}: {
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <span className="text-[14px] font-medium text-[var(--charcoal)]">
      {children}
      {required ? (
        <span className="ml-0.5 text-red-600" title="Required" aria-hidden="true">
          *
        </span>
      ) : null}
    </span>
  )
}

export function SectionTitle({
  children,
  required = false,
}: {
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <h3 className="border-b border-[var(--border)] pt-4 pb-2 text-[14px] font-medium tracking-[0.12em] text-[var(--green)] uppercase first:pt-0">
      {children}
      {required ? (
        <span className="ml-1 tracking-normal text-red-600 normal-case" aria-hidden="true">
          *
        </span>
      ) : null}
    </h3>
  )
}

export function YesNoField({
  label,
  value,
  onChange,
  name,
  locale,
}: {
  label: string
  value: YesNo
  onChange: (v: YesNo) => void
  name: string
  locale: string
}) {
  const fr = locale === 'fr'
  const labels = { yes: fr ? 'Oui' : 'Yes', no: fr ? 'Non' : 'No' }

  return (
    <fieldset className="grid gap-2">
      <legend className="text-[14px] font-medium text-[var(--charcoal)]">{label}</legend>
      <div className="flex gap-6">
        {(['yes', 'no'] as const).map((opt) => (
          <label key={opt} className="flex items-center gap-2 text-[15px] text-[var(--muted)]">
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="accent-[var(--green)]"
            />
            {labels[opt]}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function ProgressBar({
  currentStep,
  stepLabels,
  locale,
}: {
  currentStep: number
  stepLabels: string[]
  locale: string
}) {
  const fr = locale === 'fr'
  const progress = ((currentStep + 1) / STEP_COUNT) * 100

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between gap-4">
        <p className="text-[14px] font-medium text-[var(--charcoal)]">
          {fr
            ? `Étape ${currentStep + 1} sur ${STEP_COUNT} — ${stepLabels[currentStep]}`
            : `Step ${currentStep + 1} of ${STEP_COUNT} — ${stepLabels[currentStep]}`}
        </p>
        <p className="text-[14px] text-[var(--muted)]">{Math.round(progress)}%</p>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-[var(--cream)]"
        role="progressbar"
        aria-valuenow={currentStep + 1}
        aria-valuemin={1}
        aria-valuemax={STEP_COUNT}
        aria-label={
          fr
            ? `Progression : étape ${currentStep + 1} sur ${STEP_COUNT}`
            : `Progress: step ${currentStep + 1} of ${STEP_COUNT}`
        }
      >
        <div
          className="h-full rounded-full bg-[var(--green)] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
