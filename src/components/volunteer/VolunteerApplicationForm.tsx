'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'

import PhoneCountryCodeSelect from '@/components/volunteer/PhoneCountryCodeSelect'
import { isMedicalVolunteerRole } from '@/lib/volunteer'

type AvailableRole = { id: string; roleName: string }

type YesNo = '' | 'yes' | 'no'
type LanguageLevel = '' | 'basic' | 'intermediate' | 'fluent'
type DrivingLicence = '' | 'yes' | 'no' | 'other'

const STEP_COUNT = 4

type FieldName =
  | 'firstName'
  | 'lastName'
  | 'age'
  | 'email'
  | 'countryOfResidence'
  | 'nationality'
  | 'phoneCountryCode'
  | 'phone'
  | 'selectedRoles'
  | 'motivation'
  | 'howDidYouHearAboutUs'

type FieldErrors = Partial<Record<FieldName, string>>

const STEP_FIELD_ORDER: Record<number, FieldName[]> = {
  0: [
    'firstName',
    'lastName',
    'age',
    'email',
    'countryOfResidence',
    'nationality',
    'phoneCountryCode',
    'phone',
    'selectedRoles',
  ],
  2: ['motivation'],
  3: ['howDidYouHearAboutUs'],
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const inputClass =
  'h-11 rounded-lg border border-[var(--border)] bg-white px-4 text-[15px] text-[var(--charcoal)] outline-none focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/20'
const textareaClass =
  'rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-[15px] text-[var(--charcoal)] outline-none focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/20'
const inputErrorClass =
  'h-11 rounded-lg border border-red-500 bg-white px-4 text-[15px] text-[var(--charcoal)] outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
const textareaErrorClass =
  'rounded-lg border border-red-500 bg-white px-4 py-3 text-[15px] text-[var(--charcoal)] outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20'

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="text-[14px] text-red-700" role="alert">
      {message}
    </p>
  )
}

function FieldLabel({
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

function SectionTitle({
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

function YesNoField({
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

function ProgressBar({
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

export default function VolunteerApplicationForm({
  locale,
  projectId,
  availableRoles = [],
  selectedRoleIds,
  onSelectedRoleIdsChange,
}: {
  locale: string
  projectId: string
  availableRoles?: AvailableRole[]
  selectedRoleIds: string[]
  onSelectedRoleIdsChange: (ids: string[]) => void
}) {
  const t = useMemo(() => {
    const fr = locale === 'fr'
    return {
      eyebrow: fr ? 'Candidature' : 'Application',
      title: fr ? 'Formulaire de recrutement' : 'Volunteer application form',
      body: fr
        ? 'Remplis ce formulaire et nous reviendrons vers toi dès que possible.'
        : 'Fill in this form and we will get back to you as soon as possible.',
      estimatedTime: fr ? 'Durée estimée : 8 minutes' : 'Estimated time: 8 minutes',
      sections: {
        personal: fr ? 'Informations personnelles' : 'Personal information',
        roles: fr ? 'Rôles souhaités' : 'Preferred roles',
        rolesHint: fr
          ? 'Sélectionne un ou plusieurs rôles pour lesquels tu souhaites postuler.'
          : 'Select one or more roles you would like to apply for.',
        emergency: fr ? 'Contact d’urgence' : 'Emergency contact',
        experience: fr ? 'Expérience' : 'Experience',
        availability: fr ? 'Disponibilités' : 'Availability',
        workEnv: fr ? 'Environnement de travail' : 'Work environment',
        qualities: fr ? 'Qualités personnelles' : 'Personal qualities',
        languages: fr ? 'Langues parlées' : 'Languages spoken',
        driving: fr ? 'Permis de conduire' : 'Driving licence',
        referral: fr ? 'Comment nous as-tu connu ?' : 'How did you hear about us?',
      },
      stepLabels: fr
        ? ['Profil', 'Expérience', 'Disponibilités', 'Finalisation']
        : ['Profile', 'Experience', 'Availability', 'Final details'],
      nav: {
        previous: fr ? 'Précédent' : 'Previous',
        next: fr ? 'Suivant' : 'Next',
      },
      fields: {
        firstName: fr ? 'Prénom' : 'First name',
        lastName: fr ? 'Nom' : 'Last name',
        age: fr ? 'Âge' : 'Age',
        email: 'Email',
        countryOfResidence: fr ? 'Pays de domiciliation' : 'Country of residence',
        nationality: fr ? 'Nationalité' : 'Nationality',
        phoneCountryCode: fr ? 'Indicatif téléphonique' : 'Phone country code',
        phone: fr ? 'Numéro de téléphone' : 'Phone number',
        emergencyFirstName: fr ? 'Prénom' : 'First name',
        emergencyLastName: fr ? 'Nom' : 'Last name',
        emergencyRelation: fr ? 'Relation' : 'Relationship',
        emergencyPhoneCountryCode: fr ? 'Indicatif téléphonique' : 'Phone country code',
        emergencyPhone: fr ? 'Numéro de téléphone' : 'Phone number',
        relevantWorkAcademicExperience: fr
          ? 'Expérience professionnelle et académique pertinente'
          : 'Relevant work and academic experience',
        volunteerExperience: fr ? 'Expérience bénévole' : 'Volunteer experience',
        experienceWithRefugees: fr
          ? 'Expérience avec les réfugié·e·s'
          : 'Experience working with refugees',
        otherExperience: fr ? 'Autre expérience' : 'Other experience',
        medicalGraduationDate: fr
          ? 'Date de diplôme (personnel médical)'
          : 'Graduation date (medical staff)',
        preferredStartDate: fr ? 'Date de début souhaitée' : 'Preferred start date',
        preferredEndDate: fr ? 'Date de fin souhaitée' : 'Preferred end date',
        motivation: fr ? 'Motivation' : 'Motivation',
        happyStressfulEnvironment: fr
          ? 'Je suis à l’aise dans un environnement stressant, chaotique et émotionnellement exigeant'
          : 'I am happy working in a stressful, chaotic and emotionally demanding environment',
        goodEnglishLevel: fr
          ? 'J’ai un bon niveau d’anglais oral'
          : 'I have a good level of spoken English',
        euSchengenResident: fr ? 'Résident·e UE / Schengen' : 'Are you an EU / Schengen resident',
        greeceVisa: fr
          ? 'Possèdes-tu un visa te permettant de faire du bénévolat en Grèce ?'
          : 'Do you possess a visa allowing you to volunteer in Greece?',
        greeceVisaComments: fr ? 'Commentaires (visa)' : 'Visa comments',
        visaExpiryDate: fr ? 'Date d’expiration du visa' : 'Visa expiry date',
        experienceWorkingAbroad: fr ? 'Expérience à l’étranger' : 'Experience working abroad',
        languageLevel: fr
          ? 'Niveau (base / intermédiaire / fluent)'
          : 'Level (basic / intermediate / fluent)',
        greek: 'Greek',
        arabic: 'Arabic',
        farsi: 'Farsi',
        drivingLicence: fr ? 'Permis de conduire catégorie B' : 'Do you hold a B-Driving licence?',
        drivingOther: fr ? 'Précise (autre)' : 'Please specify (other)',
        howDidYouHearAboutUs: fr ? 'Comment nous as-tu connu ?' : 'How did you hear about us?',
        drivingYes: fr ? 'Oui' : 'Yes',
        drivingNo: fr ? 'Non' : 'No',
        drivingOtherOption: fr ? 'Autre' : 'Other',
      },
      submit: fr ? 'Envoyer ma candidature' : 'Submit application',
      sending: fr ? 'Envoi…' : 'Sending…',
      successTitle: fr ? 'Candidature envoyée' : 'Application submitted',
      successBody: fr
        ? 'Merci ! Nous avons bien reçu ta candidature. Si tu as des questions, écris à volunteer@medequali.team.'
        : 'Thank you! We received your application. If you have questions, email volunteer@medequali.team.',
      error: fr
        ? 'Une erreur est survenue. Vérifie les champs et réessaie.'
        : 'Something went wrong. Please check the fields and try again.',
      selectRole: fr ? 'Sélectionne au moins un rôle.' : 'Please select at least one role.',
      requiredLegend: fr ? '* Champs obligatoires' : '* Required fields',
      fieldErrors: {
        required: fr ? 'Ce champ est obligatoire.' : 'This field is required.',
        invalidEmail: fr ? 'Adresse e-mail invalide.' : 'Invalid email address.',
        invalidAge: fr
          ? 'Indique un âge entre 16 et 99 ans.'
          : 'Please enter an age between 16 and 99.',
      },
    }
  }, [locale])

  const [currentStep, setCurrentStep] = useState(0)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const fieldRefs = useRef<Partial<Record<FieldName, HTMLElement>>>({})

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [age, setAge] = useState('')
  const [email, setEmail] = useState('')
  const [countryOfResidence, setCountryOfResidence] = useState('')
  const [nationality, setNationality] = useState('')
  const [phoneCountryCode, setPhoneCountryCode] = useState('')
  const [phone, setPhone] = useState('')

  const [emergencyFirstName, setEmergencyFirstName] = useState('')
  const [emergencyLastName, setEmergencyLastName] = useState('')
  const [emergencyRelation, setEmergencyRelation] = useState('')
  const [emergencyPhoneCountryCode, setEmergencyPhoneCountryCode] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')

  const [relevantWorkAcademicExperience, setRelevantWorkAcademicExperience] = useState('')
  const [volunteerExperience, setVolunteerExperience] = useState('')
  const [experienceWithRefugees, setExperienceWithRefugees] = useState('')
  const [otherExperience, setOtherExperience] = useState('')
  const [medicalGraduationDate, setMedicalGraduationDate] = useState('')

  const [preferredStartDate, setPreferredStartDate] = useState('')
  const [preferredEndDate, setPreferredEndDate] = useState('')
  const [motivation, setMotivation] = useState('')

  const [happyStressfulEnvironment, setHappyStressfulEnvironment] = useState<YesNo>('')
  const [goodEnglishLevel, setGoodEnglishLevel] = useState<YesNo>('')
  const [euSchengenResident, setEuSchengenResident] = useState<YesNo>('')
  const [greeceVisa, setGreeceVisa] = useState<YesNo>('')
  const [greeceVisaComments, setGreeceVisaComments] = useState('')
  const [visaExpiryDate, setVisaExpiryDate] = useState('')
  const [experienceWorkingAbroad, setExperienceWorkingAbroad] = useState('')

  const [languageGreek, setLanguageGreek] = useState<LanguageLevel>('')
  const [languageArabic, setLanguageArabic] = useState<LanguageLevel>('')
  const [languageFarsi, setLanguageFarsi] = useState<LanguageLevel>('')

  const [drivingLicence, setDrivingLicence] = useState<DrivingLicence>('')
  const [drivingLicenceOther, setDrivingLicenceOther] = useState('')

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

  const getStepErrors = (step: number): FieldErrors => {
    const errors: FieldErrors = {}

    if (step === 0) {
      if (!firstName.trim()) errors.firstName = t.fieldErrors.required
      if (!lastName.trim()) errors.lastName = t.fieldErrors.required
      if (!age.trim()) {
        errors.age = t.fieldErrors.required
      } else {
        const ageNum = Number(age)
        if (!Number.isFinite(ageNum) || ageNum < 16 || ageNum > 99) {
          errors.age = t.fieldErrors.invalidAge
        }
      }
      if (!email.trim()) {
        errors.email = t.fieldErrors.required
      } else if (!EMAIL_PATTERN.test(email.trim())) {
        errors.email = t.fieldErrors.invalidEmail
      }
      if (!countryOfResidence.trim()) errors.countryOfResidence = t.fieldErrors.required
      if (!nationality.trim()) errors.nationality = t.fieldErrors.required
      if (!phoneCountryCode.trim()) errors.phoneCountryCode = t.fieldErrors.required
      if (!phone.trim()) errors.phone = t.fieldErrors.required
      if (availableRoles.length > 0 && selectedRoleIds.length === 0) {
        errors.selectedRoles = t.selectRole
      }
    }

    if (step === 2 && !motivation.trim()) {
      errors.motivation = t.fieldErrors.required
    }

    if (step === 3 && !howDidYouHearAboutUs.trim()) {
      errors.howDidYouHearAboutUs = t.fieldErrors.required
    }

    return errors
  }

  const scrollToFirstError = (errors: FieldErrors, step: number) => {
    const order = STEP_FIELD_ORDER[step] ?? (Object.keys(errors) as FieldName[])
    const firstField = order.find((name) => errors[name])
    if (!firstField) return

    const el = fieldRefs.current[firstField]
    if (!el) return

    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    if (
      el instanceof HTMLInputElement ||
      el instanceof HTMLTextAreaElement ||
      el instanceof HTMLSelectElement
    ) {
      el.focus()
    }
  }

  const validateStep = (step: number): boolean => {
    const errors = getStepErrors(step)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      scrollToFirstError(errors, step)
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
      const res = await fetch('/api/volunteer-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
          emergencyFirstName,
          emergencyLastName,
          emergencyRelation,
          emergencyPhoneCountryCode,
          emergencyPhone,
          relevantWorkAcademicExperience,
          volunteerExperience,
          experienceWithRefugees,
          otherExperience,
          medicalGraduationDate: showMedicalGraduation
            ? medicalGraduationDate || undefined
            : undefined,
          preferredStartDate: preferredStartDate || undefined,
          preferredEndDate: preferredEndDate || undefined,
          motivation,
          happyStressfulEnvironment: happyStressfulEnvironment || undefined,
          goodEnglishLevel: goodEnglishLevel || undefined,
          euSchengenResident: euSchengenResident || undefined,
          greeceVisa: showVisaFields ? greeceVisa || undefined : undefined,
          greeceVisaComments: showVisaFields ? greeceVisaComments : undefined,
          visaExpiryDate: showVisaFields && visaExpiryDate ? visaExpiryDate : undefined,
          experienceWorkingAbroad,
          languageGreek: languageGreek || undefined,
          languageArabic: languageArabic || undefined,
          languageFarsi: languageFarsi || undefined,
          drivingLicence: drivingLicence || undefined,
          drivingLicenceOther,
          howDidYouHearAboutUs,
        }),
      })
      if (!res.ok) throw new Error('bad response')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
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

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-white p-7">
      <p className="text-[13px] font-medium tracking-[0.14em] text-[var(--green)] uppercase">
        {t.eyebrow}
      </p>
      <h2 className="mt-2 font-serif text-2xl font-normal text-[var(--charcoal)]">{t.title}</h2>
      <p className="mt-2 max-w-2xl text-[16px] leading-relaxed text-[var(--muted)]">{t.body}</p>
      <p className="mt-1 text-[14px] text-[var(--muted)]">{t.estimatedTime}</p>

      {status === 'success' ? (
        <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--green-pale)] p-5">
          <p className="text-base font-medium text-[var(--charcoal)]">{t.successTitle}</p>
          <p className="mt-1 text-[16px] leading-relaxed text-[var(--muted)]">{t.successBody}</p>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="mt-7 grid gap-5">
          <p className="text-[14px] text-[var(--muted)]">{t.requiredLegend}</p>

          <ProgressBar currentStep={currentStep} stepLabels={t.stepLabels} locale={locale} />

          {currentStep === 0 ? (
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
                    aria-describedby={
                      fieldErrors.countryOfResidence ? 'countryOfResidence-error' : undefined
                    }
                    className={fieldErrors.countryOfResidence ? inputErrorClass : inputClass}
                  />
                  <FieldError
                    id="countryOfResidence-error"
                    message={fieldErrors.countryOfResidence}
                  />
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
          ) : null}

          {currentStep === 1 ? (
            <>
              <SectionTitle>{t.sections.emergency}</SectionTitle>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <FieldLabel>{t.fields.emergencyFirstName}</FieldLabel>
                  <input
                    value={emergencyFirstName}
                    onChange={(e) => setEmergencyFirstName(e.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="grid gap-2">
                  <FieldLabel>{t.fields.emergencyLastName}</FieldLabel>
                  <input
                    value={emergencyLastName}
                    onChange={(e) => setEmergencyLastName(e.target.value)}
                    className={inputClass}
                  />
                </label>
              </div>
              <label className="grid gap-2">
                <FieldLabel>{t.fields.emergencyRelation}</FieldLabel>
                <input
                  value={emergencyRelation}
                  onChange={(e) => setEmergencyRelation(e.target.value)}
                  className={inputClass}
                />
              </label>
              <div className="grid gap-4 md:grid-cols-[minmax(160px,0.45fr)_1fr]">
                <label className="grid gap-2">
                  <FieldLabel>{t.fields.emergencyPhoneCountryCode}</FieldLabel>
                  <PhoneCountryCodeSelect
                    value={emergencyPhoneCountryCode}
                    onChange={setEmergencyPhoneCountryCode}
                    locale={locale}
                  />
                </label>
                <label className="grid gap-2">
                  <FieldLabel>{t.fields.emergencyPhone}</FieldLabel>
                  <input
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className={inputClass}
                  />
                </label>
              </div>

              <SectionTitle>{t.sections.experience}</SectionTitle>
              {(
                [
                  [
                    t.fields.relevantWorkAcademicExperience,
                    relevantWorkAcademicExperience,
                    setRelevantWorkAcademicExperience,
                  ],
                  [t.fields.volunteerExperience, volunteerExperience, setVolunteerExperience],
                  [
                    t.fields.experienceWithRefugees,
                    experienceWithRefugees,
                    setExperienceWithRefugees,
                  ],
                  [t.fields.otherExperience, otherExperience, setOtherExperience],
                ] as const
              ).map(([label, value, setter]) => (
                <label key={label} className="grid gap-2">
                  <FieldLabel>{label}</FieldLabel>
                  <textarea
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    rows={3}
                    className={textareaClass}
                  />
                </label>
              ))}
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
          ) : null}

          {currentStep === 2 ? (
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
              <label className="grid gap-2">
                <FieldLabel>{t.fields.experienceWorkingAbroad}</FieldLabel>
                <textarea
                  value={experienceWorkingAbroad}
                  onChange={(e) => setExperienceWorkingAbroad(e.target.value)}
                  rows={3}
                  className={textareaClass}
                />
              </label>
            </>
          ) : null}

          {currentStep === 3 ? (
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
                    <label
                      key={opt}
                      className="flex items-center gap-2 text-[15px] text-[var(--muted)]"
                    >
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
                  className={
                    fieldErrors.howDidYouHearAboutUs ? textareaErrorClass : textareaClass
                  }
                />
                <FieldError
                  id="howDidYouHearAboutUs-error"
                  message={fieldErrors.howDidYouHearAboutUs}
                />
              </label>
            </>
          ) : null}

          {status === 'error' ? <p className="text-[15px] text-red-700">{t.error}</p> : null}

          <div className="mt-2 flex flex-wrap gap-3">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={goPrevious}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-[var(--border)] bg-white px-6 text-base font-medium text-[var(--charcoal)] transition-colors hover:bg-[var(--cream)]"
              >
                {t.nav.previous}
              </button>
            ) : null}
            {currentStep < STEP_COUNT - 1 ? (
              <button
                type="button"
                onClick={goNext}
                onMouseDown={(e) => e.preventDefault()}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-[var(--green)] px-8 text-base font-medium text-white transition-colors hover:bg-[var(--green-dark)]"
              >
                {t.nav.next}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void submitApplication()}
                disabled={status === 'sending'}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-[var(--green)] px-8 text-base font-medium text-white transition-colors hover:bg-[var(--green-dark)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === 'sending' ? t.sending : t.submit}
              </button>
            )}
          </div>
        </form>
      )}
    </section>
  )
}
