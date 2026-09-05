'use client'

import React, { useRef } from 'react'

import { CV_ACCEPT, isAllowedCvFile } from '@/lib/volunteer/cv-upload'

import { FieldError, FieldLabel, SectionTitle } from './FormFields'
import { inputClass, textareaClass } from './styles'
import type { FormTranslations } from './translations'

export type ExperienceStepProps = {
  t: FormTranslations
  relevantWorkAcademicExperience: string
  setRelevantWorkAcademicExperience: (value: string) => void
  cvFile: File | null
  setCvFile: (file: File | null) => void
  cvError: string
  setCvError: (value: string) => void
  showMedicalGraduation: boolean
  medicalGraduationDate: string
  setMedicalGraduationDate: (value: string) => void
}

export function ExperienceStep({
  t,
  relevantWorkAcademicExperience,
  setRelevantWorkAcademicExperience,
  cvFile,
  setCvFile,
  cvError,
  setCvError,
  showMedicalGraduation,
  medicalGraduationDate,
  setMedicalGraduationDate,
}: ExperienceStepProps) {
  const cvInputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <SectionTitle>{t.sections.experience}</SectionTitle>
      <p className="text-[15px] text-[var(--muted)]">{t.sections.experienceHint}</p>
      <label className="grid gap-2">
        <FieldLabel>{t.fields.relevantWorkAcademicExperience}</FieldLabel>
        <textarea
          value={relevantWorkAcademicExperience}
          onChange={(e) => setRelevantWorkAcademicExperience(e.target.value)}
          rows={3}
          className={textareaClass}
        />
      </label>
      <div className="relative my-1 flex items-center gap-3" aria-hidden="true">
        <div className="h-px flex-1 bg-[var(--border)]" />
        <span className="text-[13px] text-[var(--muted)]">{t.fields.cvOr}</span>
        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>
      <div className="grid gap-2">
        <label className="grid gap-2">
          <FieldLabel>{t.fields.cv}</FieldLabel>
          <span className="text-[14px] text-[var(--muted)]">{t.fields.cvHint}</span>
          <input
            ref={cvInputRef}
            type="file"
            accept={CV_ACCEPT}
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null
              if (!file) {
                setCvFile(null)
                setCvError('')
                return
              }
              if (!isAllowedCvFile(file.name, file.type, file.size)) {
                setCvFile(null)
                setCvError(t.fields.cvInvalid)
                e.target.value = ''
                return
              }
              setCvError('')
              setCvFile(file)
            }}
            className={`${inputClass} py-2 file:mr-4 file:rounded-md file:border-0 file:bg-[var(--green-pale)] file:px-3 file:py-1.5 file:text-[13px] file:font-medium file:text-[var(--green)]`}
          />
        </label>
        {cvFile ? (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[14px] text-[var(--charcoal)]">{cvFile.name}</p>
            <button
              type="button"
              onClick={() => {
                setCvFile(null)
                setCvError('')
                if (cvInputRef.current) cvInputRef.current.value = ''
              }}
              className="text-[14px] font-medium text-[var(--green)] underline-offset-2 hover:underline"
            >
              {t.fields.cvRemove}
            </button>
          </div>
        ) : null}
        <FieldError id="cv-error" message={cvError} />
      </div>
      {showMedicalGraduation ? (
        <label className="grid gap-2">
          <FieldLabel>{t.fields.medicalGraduationDate}</FieldLabel>
          <input
            type="month"
            value={medicalGraduationDate}
            onChange={(e) => setMedicalGraduationDate(e.target.value)}
            className={inputClass}
          />
        </label>
      ) : null}
    </>
  )
}
