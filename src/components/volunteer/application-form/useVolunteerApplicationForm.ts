'use client'

import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react'

import { isMedicalVolunteerRole } from '@/lib/volunteer-role'

import { getVolunteerApplicationFormTranslations } from './translations'
import {
  STEP_COUNT,
  STEP_FIELD_ORDER,
  type DrivingLicence,
  type FieldErrors,
  type FieldName,
  type FormStatus,
  type LanguageLevel,
  type VolunteerApplicationFormProps,
  type YesNo,
} from './types'
import { getStepErrors, scrollToFirstError } from './validation'

export function useVolunteerApplicationForm({
  locale,
  projectId,
  availableRoles = [],
  selectedRoleIds,
  onSelectedRoleIdsChange,
}: VolunteerApplicationFormProps) {
  const t = useMemo(() => getVolunteerApplicationFormTranslations(locale), [locale])

  const [currentStep, setCurrentStep] = useState(0)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const fieldRefs = useRef<Partial<Record<FieldName, HTMLElement>>>({})

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [age, setAge] = useState('')
  const [email, setEmail] = useState('')
  const [countryOfResidence, setCountryOfResidence] = useState('')
  const [nationality, setNationality] = useState('')
  const [phoneCountryCode, setPhoneCountryCode] = useState('')
  const [phone, setPhone] = useState('')

  const [relevantWorkAcademicExperience, setRelevantWorkAcademicExperience] = useState('')
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvError, setCvError] = useState('')
  const [medicalGraduationDate, setMedicalGraduationDate] = useState('')

  const [preferredStartDate, setPreferredStartDate] = useState('')
  const [preferredEndDate, setPreferredEndDate] = useState('')
  const [datesFlexible, setDatesFlexible] = useState<YesNo>('')
  const [flexibleFromDate, setFlexibleFromDate] = useState('')
  const [flexibleToDate, setFlexibleToDate] = useState('')
  const [motivation, setMotivation] = useState('')

  const [happyStressfulEnvironment, setHappyStressfulEnvironment] = useState<YesNo>('')
  const [goodEnglishLevel, setGoodEnglishLevel] = useState<YesNo>('')
  const [euSchengenResident, setEuSchengenResident] = useState<YesNo>('')
  const [greeceVisa, setGreeceVisa] = useState<YesNo>('')
  const [greeceVisaComments, setGreeceVisaComments] = useState('')
  const [visaExpiryDate, setVisaExpiryDate] = useState('')

  const [languageGreek, setLanguageGreek] = useState<LanguageLevel>('')
  const [languageArabic, setLanguageArabic] = useState<LanguageLevel>('')
  const [languageFarsi, setLanguageFarsi] = useState<LanguageLevel>('')

  const [drivingLicence, setDrivingLicence] = useState<DrivingLicence>('')
  const [drivingLicenceOther, setDrivingLicenceOther] = useState('')
  const [comfortableDriving9SeatVan, setComfortableDriving9SeatVan] = useState<YesNo>('')

  const [howDidYouHearAboutUs, setHowDidYouHearAboutUs] = useState('')

  const showMedicalGraduation = useMemo(
    () =>
      availableRoles.some(
        (role) => selectedRoleIds.includes(role.id) && isMedicalVolunteerRole(role.roleName),
      ),
    [availableRoles, selectedRoleIds],
  )

  const showVisaFields = euSchengenResident === 'no'

  useEffect(() => {
    if (euSchengenResident === 'yes') {
      setGreeceVisa('')
      setGreeceVisaComments('')
      setVisaExpiryDate('')
    }
  }, [euSchengenResident])

  useEffect(() => {
    if (!showMedicalGraduation) {
      setMedicalGraduationDate('')
    }
  }, [showMedicalGraduation])

  useEffect(() => {
    if (datesFlexible !== 'yes') {
      setFlexibleFromDate('')
      setFlexibleToDate('')
    }
  }, [datesFlexible])

  const setFieldRef = (name: FieldName) => (el: HTMLElement | null) => {
    if (el) fieldRefs.current[name] = el
    else delete fieldRefs.current[name]
  }

  const clearFieldError = (name: FieldName) => {
    setFieldErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  const validateStep = (step: number): boolean => {
    const errors = getStepErrors({
      step,
      t,
      firstName,
      lastName,
      age,
      email,
      countryOfResidence,
      nationality,
      phoneCountryCode,
      phone,
      motivation,
      howDidYouHearAboutUs,
      availableRolesCount: availableRoles.length,
      selectedRoleIdsCount: selectedRoleIds.length,
    })

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      scrollToFirstError(errors, step, fieldRefs.current, STEP_FIELD_ORDER)
      return false
    }

    setFieldErrors({})
    return true
  }

  const toggleRole = (id: string) => {
    clearFieldError('selectedRoles')
    onSelectedRoleIdsChange(
      selectedRoleIds.includes(id)
        ? selectedRoleIds.filter((r) => r !== id)
        : [...selectedRoleIds, id],
    )
  }

  const goNext = () => {
    if (!validateStep(currentStep)) return
    setCurrentStep((s) => Math.min(s + 1, STEP_COUNT - 1))
  }

  const goPrevious = () => {
    setFieldErrors({})
    setCurrentStep((s) => Math.max(s - 1, 0))
  }

  const submitApplication = async () => {
    if (currentStep !== STEP_COUNT - 1) return
    if (!validateStep(currentStep)) return
    setStatus('sending')
    try {
      const formData = new FormData()
      formData.append(
        'payload',
        JSON.stringify({
          locale,
          project: projectId,
          firstName,
          lastName,
          age: Number(age),
          email,
          countryOfResidence,
          nationality,
          phoneCountryCode,
          phone,
          selectedRoles: selectedRoleIds,
          relevantWorkAcademicExperience,
          medicalGraduationDate: showMedicalGraduation
            ? medicalGraduationDate || undefined
            : undefined,
          preferredStartDate: preferredStartDate || undefined,
          preferredEndDate: preferredEndDate || undefined,
          datesFlexible: datesFlexible || undefined,
          flexibleFromDate:
            datesFlexible === 'yes' && flexibleFromDate ? flexibleFromDate : undefined,
          flexibleToDate: datesFlexible === 'yes' && flexibleToDate ? flexibleToDate : undefined,
          motivation,
          happyStressfulEnvironment: happyStressfulEnvironment || undefined,
          goodEnglishLevel: goodEnglishLevel || undefined,
          euSchengenResident: euSchengenResident || undefined,
          greeceVisa: showVisaFields ? greeceVisa || undefined : undefined,
          greeceVisaComments: showVisaFields ? greeceVisaComments : undefined,
          visaExpiryDate: showVisaFields && visaExpiryDate ? visaExpiryDate : undefined,
          languageGreek: languageGreek || undefined,
          languageArabic: languageArabic || undefined,
          languageFarsi: languageFarsi || undefined,
          drivingLicence: drivingLicence || undefined,
          drivingLicenceOther,
          comfortableDriving9SeatVan: comfortableDriving9SeatVan || undefined,
          howDidYouHearAboutUs,
        }),
      )
      if (cvFile) formData.append('cv', cvFile)

      const res = await fetch('/api/volunteer-application', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('bad response')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (currentStep < STEP_COUNT - 1) {
      goNext()
      return
    }
    void submitApplication()
  }

  const languageOptions: { value: LanguageLevel; label: string }[] = [
    { value: '', label: '—' },
    { value: 'basic', label: locale === 'fr' ? 'Base' : 'Basic' },
    { value: 'intermediate', label: locale === 'fr' ? 'Intermédiaire' : 'Intermediate' },
    { value: 'fluent', label: 'Fluent' },
  ]

  const drivingLabels: Record<DrivingLicence, string> = {
    '': '',
    yes: t.fields.drivingYes,
    no: t.fields.drivingNo,
    other: t.fields.drivingOtherOption,
  }

  return {
    t,
    locale,
    currentStep,
    fieldErrors,
    status,
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
    relevantWorkAcademicExperience,
    setRelevantWorkAcademicExperience,
    cvFile,
    setCvFile,
    cvError,
    setCvError,
    showMedicalGraduation,
    medicalGraduationDate,
    setMedicalGraduationDate,
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
    goNext,
    goPrevious,
    submitApplication,
    handleFormSubmit,
  }
}
