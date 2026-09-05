'use client'

import React from 'react'

import { FieldError, FieldLabel, SectionTitle, YesNoField } from './FormFields'
import { inputClass, textareaClass, textareaErrorClass } from './styles'
import type { FormTranslations } from './translations'
import type { DrivingLicence, FieldErrors, FieldName, LanguageLevel, YesNo } from './types'

export type FinalDetailsStepProps = {
  t: FormTranslations
  locale: string
  fieldErrors: FieldErrors
  setFieldRef: (name: FieldName) => (el: HTMLElement | null) => void
  clearFieldError: (name: FieldName) => void
  languageOptions: { value: LanguageLevel; label: string }[]
  drivingLabels: Record<DrivingLicence, string>
  languageGreek: LanguageLevel
  setLanguageGreek: (value: LanguageLevel) => void
  languageArabic: LanguageLevel
  setLanguageArabic: (value: LanguageLevel) => void
  languageFarsi: LanguageLevel
  setLanguageFarsi: (value: LanguageLevel) => void
  drivingLicence: DrivingLicence
  setDrivingLicence: (value: DrivingLicence) => void
  drivingLicenceOther: string
  setDrivingLicenceOther: (value: string) => void
  comfortableDriving9SeatVan: YesNo
  setComfortableDriving9SeatVan: (value: YesNo) => void
  howDidYouHearAboutUs: string
  setHowDidYouHearAboutUs: (value: string) => void
}

export function FinalDetailsStep({
  t,
  locale,
  fieldErrors,
  setFieldRef,
  clearFieldError,
  languageOptions,
  drivingLabels,
  languageGreek,
  setLanguageGreek,
  languageArabic,
  setLanguageArabic,
  languageFarsi,
  setLanguageFarsi,
  drivingLicence,
  setDrivingLicence,
  drivingLicenceOther,
  setDrivingLicenceOther,
  comfortableDriving9SeatVan,
  setComfortableDriving9SeatVan,
  howDidYouHearAboutUs,
  setHowDidYouHearAboutUs,
}: FinalDetailsStepProps) {
  return (
    <>
      <SectionTitle>{t.sections.languages}</SectionTitle>
      <p className="text-[15px] text-[var(--muted)]">{t.fields.languageLevel}</p>
      <div className="grid gap-4 md:grid-cols-3">
        {(
          [
            [t.fields.greek, languageGreek, setLanguageGreek],
            [t.fields.arabic, languageArabic, setLanguageArabic],
            [t.fields.farsi, languageFarsi, setLanguageFarsi],
          ] as const
        ).map(([label, value, setter]) => (
          <label key={label} className="grid gap-2">
            <FieldLabel>{label}</FieldLabel>
            <select
              value={value}
              onChange={(e) => setter(e.target.value as LanguageLevel)}
              className={inputClass}
            >
              {languageOptions.map((opt) => (
                <option key={opt.value || 'none'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <SectionTitle>{t.sections.driving}</SectionTitle>
      <fieldset className="grid gap-2">
        <legend className="text-[14px] font-medium text-[var(--charcoal)]">
          {t.fields.drivingLicence}
        </legend>
        <div className="flex flex-wrap gap-6">
          {(['yes', 'no', 'other'] as const).map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-[15px] text-[var(--muted)]">
              <input
                type="radio"
                name="drivingLicence"
                value={opt}
                checked={drivingLicence === opt}
                onChange={() => setDrivingLicence(opt)}
                className="accent-[var(--green)]"
              />
              {drivingLabels[opt]}
            </label>
          ))}
        </div>
      </fieldset>
      {drivingLicence === 'other' ? (
        <label className="grid gap-2">
          <FieldLabel>{t.fields.drivingOther}</FieldLabel>
          <input
            value={drivingLicenceOther}
            onChange={(e) => setDrivingLicenceOther(e.target.value)}
            className={inputClass}
          />
        </label>
      ) : null}
      <YesNoField
        label={t.fields.comfortableDriving9SeatVan}
        name="comfortableDriving9SeatVan"
        value={comfortableDriving9SeatVan}
        onChange={setComfortableDriving9SeatVan}
        locale={locale}
      />

      <SectionTitle required>{t.sections.referral}</SectionTitle>
      <label className="grid gap-2">
        <FieldLabel required>{t.fields.howDidYouHearAboutUs}</FieldLabel>
        <textarea
          ref={setFieldRef('howDidYouHearAboutUs')}
          required
          value={howDidYouHearAboutUs}
          onChange={(e) => {
            setHowDidYouHearAboutUs(e.target.value)
            clearFieldError('howDidYouHearAboutUs')
          }}
          rows={3}
          aria-invalid={fieldErrors.howDidYouHearAboutUs ? true : undefined}
          aria-describedby={
            fieldErrors.howDidYouHearAboutUs ? 'howDidYouHearAboutUs-error' : undefined
          }
          className={fieldErrors.howDidYouHearAboutUs ? textareaErrorClass : textareaClass}
        />
        <FieldError
          id="howDidYouHearAboutUs-error"
          message={fieldErrors.howDidYouHearAboutUs}
        />
      </label>
    </>
  )
}
