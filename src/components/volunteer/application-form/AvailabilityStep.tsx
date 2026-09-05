'use client'

import React from 'react'

import { FieldError, FieldLabel, SectionTitle, YesNoField } from './FormFields'
import { inputClass, textareaClass, textareaErrorClass } from './styles'
import type { FormTranslations } from './translations'
import type { FieldErrors, FieldName, YesNo } from './types'

export type AvailabilityStepProps = {
  t: FormTranslations
  locale: string
  fieldErrors: FieldErrors
  setFieldRef: (name: FieldName) => (el: HTMLElement | null) => void
  clearFieldError: (name: FieldName) => void
  preferredStartDate: string
  setPreferredStartDate: (value: string) => void
  preferredEndDate: string
  setPreferredEndDate: (value: string) => void
  datesFlexible: YesNo
  setDatesFlexible: (value: YesNo) => void
  flexibleFromDate: string
  setFlexibleFromDate: (value: string) => void
  flexibleToDate: string
  setFlexibleToDate: (value: string) => void
  motivation: string
  setMotivation: (value: string) => void
  happyStressfulEnvironment: YesNo
  setHappyStressfulEnvironment: (value: YesNo) => void
  goodEnglishLevel: YesNo
  setGoodEnglishLevel: (value: YesNo) => void
  euSchengenResident: YesNo
  setEuSchengenResident: (value: YesNo) => void
  showVisaFields: boolean
  greeceVisa: YesNo
  setGreeceVisa: (value: YesNo) => void
  greeceVisaComments: string
  setGreeceVisaComments: (value: string) => void
  visaExpiryDate: string
  setVisaExpiryDate: (value: string) => void
}

export function AvailabilityStep({
  t,
  locale,
  fieldErrors,
  setFieldRef,
  clearFieldError,
  preferredStartDate,
  setPreferredStartDate,
  preferredEndDate,
  setPreferredEndDate,
  datesFlexible,
  setDatesFlexible,
  flexibleFromDate,
  setFlexibleFromDate,
  flexibleToDate,
  setFlexibleToDate,
  motivation,
  setMotivation,
  happyStressfulEnvironment,
  setHappyStressfulEnvironment,
  goodEnglishLevel,
  setGoodEnglishLevel,
  euSchengenResident,
  setEuSchengenResident,
  showVisaFields,
  greeceVisa,
  setGreeceVisa,
  greeceVisaComments,
  setGreeceVisaComments,
  visaExpiryDate,
  setVisaExpiryDate,
}: AvailabilityStepProps) {
  return (
    <>
      <SectionTitle>{t.sections.availability}</SectionTitle>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <FieldLabel>{t.fields.preferredStartDate}</FieldLabel>
          <input
            type="date"
            value={preferredStartDate}
            onChange={(e) => setPreferredStartDate(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="grid gap-2">
          <FieldLabel>{t.fields.preferredEndDate}</FieldLabel>
          <input
            type="date"
            value={preferredEndDate}
            onChange={(e) => setPreferredEndDate(e.target.value)}
            className={inputClass}
          />
        </label>
      </div>
      <YesNoField
        label={t.fields.datesFlexible}
        name="datesFlexible"
        value={datesFlexible}
        onChange={setDatesFlexible}
        locale={locale}
      />
      {datesFlexible === 'yes' ? (
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <FieldLabel>{t.fields.flexibleFromDate}</FieldLabel>
            <input
              type="date"
              value={flexibleFromDate}
              onChange={(e) => setFlexibleFromDate(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="grid gap-2">
            <FieldLabel>{t.fields.flexibleToDate}</FieldLabel>
            <input
              type="date"
              value={flexibleToDate}
              onChange={(e) => setFlexibleToDate(e.target.value)}
              className={inputClass}
            />
          </label>
        </div>
      ) : null}
      <label className="grid gap-2">
        <FieldLabel required>{t.fields.motivation}</FieldLabel>
        <textarea
          ref={setFieldRef('motivation')}
          required
          value={motivation}
          onChange={(e) => {
            setMotivation(e.target.value)
            clearFieldError('motivation')
          }}
          rows={4}
          aria-invalid={fieldErrors.motivation ? true : undefined}
          aria-describedby={fieldErrors.motivation ? 'motivation-error' : undefined}
          className={fieldErrors.motivation ? textareaErrorClass : textareaClass}
        />
        <FieldError id="motivation-error" message={fieldErrors.motivation} />
      </label>

      <SectionTitle>{t.sections.workEnv}</SectionTitle>
      <YesNoField
        label={t.fields.happyStressfulEnvironment}
        name="happyStressfulEnvironment"
        value={happyStressfulEnvironment}
        onChange={setHappyStressfulEnvironment}
        locale={locale}
      />

      <SectionTitle>{t.sections.qualities}</SectionTitle>
      <YesNoField
        label={t.fields.goodEnglishLevel}
        name="goodEnglishLevel"
        value={goodEnglishLevel}
        onChange={setGoodEnglishLevel}
        locale={locale}
      />
      <YesNoField
        label={t.fields.euSchengenResident}
        name="euSchengenResident"
        value={euSchengenResident}
        onChange={setEuSchengenResident}
        locale={locale}
      />
      {showVisaFields ? (
        <>
          <YesNoField
            label={t.fields.greeceVisa}
            name="greeceVisa"
            value={greeceVisa}
            onChange={setGreeceVisa}
            locale={locale}
          />
          <label className="grid gap-2">
            <FieldLabel>{t.fields.greeceVisaComments}</FieldLabel>
            <textarea
              value={greeceVisaComments}
              onChange={(e) => setGreeceVisaComments(e.target.value)}
              rows={2}
              className={textareaClass}
            />
          </label>
          <label className="grid gap-2">
            <FieldLabel>{t.fields.visaExpiryDate}</FieldLabel>
            <input
              type="date"
              value={visaExpiryDate}
              onChange={(e) => setVisaExpiryDate(e.target.value)}
              className={inputClass}
            />
          </label>
        </>
      ) : null}
    </>
  )
}
