'use client'

import React from 'react'

import PhoneCountryCodeSelect from '@/components/volunteer/PhoneCountryCodeSelect'

import { FieldError, FieldLabel, SectionTitle } from './FormFields'
import { inputClass, inputErrorClass } from './styles'
import type { FormTranslations } from './translations'
import type { AvailableRole, FieldErrors, FieldName } from './types'

export type ProfileStepProps = {
  t: FormTranslations
  locale: string
  fieldErrors: FieldErrors
  setFieldRef: (name: FieldName) => (el: HTMLElement | null) => void
  clearFieldError: (name: FieldName) => void
  firstName: string
  setFirstName: (value: string) => void
  lastName: string
  setLastName: (value: string) => void
  age: string
  setAge: (value: string) => void
  email: string
  setEmail: (value: string) => void
  countryOfResidence: string
  setCountryOfResidence: (value: string) => void
  nationality: string
  setNationality: (value: string) => void
  phoneCountryCode: string
  setPhoneCountryCode: (value: string) => void
  phone: string
  setPhone: (value: string) => void
  availableRoles: AvailableRole[]
  selectedRoleIds: string[]
  toggleRole: (id: string) => void
}

export function ProfileStep({
  t,
  locale,
  fieldErrors,
  setFieldRef,
  clearFieldError,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  age,
  setAge,
  email,
  setEmail,
  countryOfResidence,
  setCountryOfResidence,
  nationality,
  setNationality,
  phoneCountryCode,
  setPhoneCountryCode,
  phone,
  setPhone,
  availableRoles,
  selectedRoleIds,
  toggleRole,
}: ProfileStepProps) {
  return (
    <>
      <SectionTitle>{t.sections.personal}</SectionTitle>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <FieldLabel required>{t.fields.firstName}</FieldLabel>
          <input
            ref={setFieldRef('firstName')}
            required
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value)
              clearFieldError('firstName')
            }}
            aria-invalid={fieldErrors.firstName ? true : undefined}
            aria-describedby={fieldErrors.firstName ? 'firstName-error' : undefined}
            className={fieldErrors.firstName ? inputErrorClass : inputClass}
          />
          <FieldError id="firstName-error" message={fieldErrors.firstName} />
        </label>
        <label className="grid gap-2">
          <FieldLabel required>{t.fields.lastName}</FieldLabel>
          <input
            ref={setFieldRef('lastName')}
            required
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value)
              clearFieldError('lastName')
            }}
            aria-invalid={fieldErrors.lastName ? true : undefined}
            aria-describedby={fieldErrors.lastName ? 'lastName-error' : undefined}
            className={fieldErrors.lastName ? inputErrorClass : inputClass}
          />
          <FieldError id="lastName-error" message={fieldErrors.lastName} />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-2">
          <FieldLabel required>{t.fields.age}</FieldLabel>
          <input
            ref={setFieldRef('age')}
            required
            type="number"
            min={16}
            max={99}
            value={age}
            onChange={(e) => {
              setAge(e.target.value)
              clearFieldError('age')
            }}
            aria-invalid={fieldErrors.age ? true : undefined}
            aria-describedby={fieldErrors.age ? 'age-error' : undefined}
            className={fieldErrors.age ? inputErrorClass : inputClass}
          />
          <FieldError id="age-error" message={fieldErrors.age} />
        </label>
        <label className="grid gap-2 md:col-span-2">
          <FieldLabel required>{t.fields.email}</FieldLabel>
          <input
            ref={setFieldRef('email')}
            required
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              clearFieldError('email')
            }}
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            className={fieldErrors.email ? inputErrorClass : inputClass}
          />
          <FieldError id="email-error" message={fieldErrors.email} />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <FieldLabel required>{t.fields.countryOfResidence}</FieldLabel>
          <input
            ref={setFieldRef('countryOfResidence')}
            required
            value={countryOfResidence}
            onChange={(e) => {
              setCountryOfResidence(e.target.value)
              clearFieldError('countryOfResidence')
            }}
            aria-invalid={fieldErrors.countryOfResidence ? true : undefined}
            aria-describedby={fieldErrors.countryOfResidence ? 'countryOfResidence-error' : undefined}
            className={fieldErrors.countryOfResidence ? inputErrorClass : inputClass}
          />
          <FieldError id="countryOfResidence-error" message={fieldErrors.countryOfResidence} />
        </label>
        <label className="grid gap-2">
          <FieldLabel required>{t.fields.nationality}</FieldLabel>
          <input
            ref={setFieldRef('nationality')}
            required
            value={nationality}
            onChange={(e) => {
              setNationality(e.target.value)
              clearFieldError('nationality')
            }}
            aria-invalid={fieldErrors.nationality ? true : undefined}
            aria-describedby={fieldErrors.nationality ? 'nationality-error' : undefined}
            className={fieldErrors.nationality ? inputErrorClass : inputClass}
          />
          <FieldError id="nationality-error" message={fieldErrors.nationality} />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-[minmax(160px,0.45fr)_1fr]">
        <label className="grid gap-2">
          <FieldLabel required>{t.fields.phoneCountryCode}</FieldLabel>
          <PhoneCountryCodeSelect
            value={phoneCountryCode}
            onChange={(value) => {
              setPhoneCountryCode(value)
              clearFieldError('phoneCountryCode')
            }}
            locale={locale}
            hasError={!!fieldErrors.phoneCountryCode}
            inputRef={setFieldRef('phoneCountryCode')}
            id="phoneCountryCode"
          />
          <FieldError id="phoneCountryCode-error" message={fieldErrors.phoneCountryCode} />
        </label>
        <label className="grid gap-2">
          <FieldLabel required>{t.fields.phone}</FieldLabel>
          <input
            ref={setFieldRef('phone')}
            required
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              clearFieldError('phone')
            }}
            aria-invalid={fieldErrors.phone ? true : undefined}
            aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
            className={fieldErrors.phone ? inputErrorClass : inputClass}
          />
          <FieldError id="phone-error" message={fieldErrors.phone} />
        </label>
      </div>

      {availableRoles.length > 0 ? (
        <>
          <SectionTitle required>{t.sections.roles}</SectionTitle>
          <p className="text-[15px] text-[var(--muted)]">{t.sections.rolesHint}</p>
          <div
            ref={setFieldRef('selectedRoles')}
            className={`grid gap-2 rounded-lg ${fieldErrors.selectedRoles ? 'ring-2 ring-red-500/30' : ''}`}
            tabIndex={-1}
          >
            {availableRoles.map((role) => (
              <label
                key={role.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--border)] px-4 py-3 transition-colors hover:bg-[var(--green-pale)]"
              >
                <input
                  type="checkbox"
                  checked={selectedRoleIds.includes(role.id)}
                  onChange={() => toggleRole(role.id)}
                  className="h-4 w-4 accent-[var(--green)]"
                />
                <span className="text-[15px] text-[var(--charcoal)]">{role.roleName}</span>
              </label>
            ))}
          </div>
          <FieldError id="selectedRoles-error" message={fieldErrors.selectedRoles} />
        </>
      ) : null}
    </>
  )
}
