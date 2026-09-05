'use client'

import React from 'react'

import { AvailabilityStep } from './AvailabilityStep'
import { ExperienceStep } from './ExperienceStep'
import { FinalDetailsStep } from './FinalDetailsStep'
import { ProgressBar } from './FormFields'
import { ProfileStep } from './ProfileStep'
import { STEP_COUNT } from './types'
import type { VolunteerApplicationFormProps } from './types'
import { useVolunteerApplicationForm } from './useVolunteerApplicationForm'

export default function VolunteerApplicationForm(props: VolunteerApplicationFormProps) {
  const form = useVolunteerApplicationForm(props)

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-white p-7">
      <p className="text-[13px] font-medium tracking-[0.14em] text-[var(--green)] uppercase">
        {form.t.eyebrow}
      </p>
      <h2 className="mt-2 font-serif text-2xl font-normal text-[var(--charcoal)]">{form.t.title}</h2>
      <p className="mt-2 max-w-2xl text-[16px] leading-relaxed text-[var(--muted)]">{form.t.body}</p>
      <p className="mt-1 text-[14px] text-[var(--muted)]">{form.t.estimatedTime}</p>

      {form.status === 'success' ? (
        <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--green-pale)] p-5">
          <p className="text-base font-medium text-[var(--charcoal)]">{form.t.successTitle}</p>
          <p className="mt-1 text-[16px] leading-relaxed text-[var(--muted)]">{form.t.successBody}</p>
        </div>
      ) : (
        <form onSubmit={form.handleFormSubmit} className="mt-7 grid gap-5">
          <p className="text-[14px] text-[var(--muted)]">{form.t.requiredLegend}</p>

          <ProgressBar
            currentStep={form.currentStep}
            stepLabels={form.t.stepLabels}
            locale={form.locale}
          />

          {form.currentStep === 0 ? (
            <ProfileStep
              t={form.t}
              locale={form.locale}
              fieldErrors={form.fieldErrors}
              setFieldRef={form.setFieldRef}
              clearFieldError={form.clearFieldError}
              firstName={form.firstName}
              setFirstName={form.setFirstName}
              lastName={form.lastName}
              setLastName={form.setLastName}
              age={form.age}
              setAge={form.setAge}
              email={form.email}
              setEmail={form.setEmail}
              countryOfResidence={form.countryOfResidence}
              setCountryOfResidence={form.setCountryOfResidence}
              nationality={form.nationality}
              setNationality={form.setNationality}
              phoneCountryCode={form.phoneCountryCode}
              setPhoneCountryCode={form.setPhoneCountryCode}
              phone={form.phone}
              setPhone={form.setPhone}
              availableRoles={form.availableRoles}
              selectedRoleIds={props.selectedRoleIds}
              toggleRole={form.toggleRole}
            />
          ) : null}

          {form.currentStep === 1 ? (
            <ExperienceStep
              t={form.t}
              relevantWorkAcademicExperience={form.relevantWorkAcademicExperience}
              setRelevantWorkAcademicExperience={form.setRelevantWorkAcademicExperience}
              cvFile={form.cvFile}
              setCvFile={form.setCvFile}
              cvError={form.cvError}
              setCvError={form.setCvError}
              showMedicalGraduation={form.showMedicalGraduation}
              medicalGraduationDate={form.medicalGraduationDate}
              setMedicalGraduationDate={form.setMedicalGraduationDate}
            />
          ) : null}

          {form.currentStep === 2 ? (
            <AvailabilityStep
              t={form.t}
              locale={form.locale}
              fieldErrors={form.fieldErrors}
              setFieldRef={form.setFieldRef}
              clearFieldError={form.clearFieldError}
              preferredStartDate={form.preferredStartDate}
              setPreferredStartDate={form.setPreferredStartDate}
              preferredEndDate={form.preferredEndDate}
              setPreferredEndDate={form.setPreferredEndDate}
              datesFlexible={form.datesFlexible}
              setDatesFlexible={form.setDatesFlexible}
              flexibleFromDate={form.flexibleFromDate}
              setFlexibleFromDate={form.setFlexibleFromDate}
              flexibleToDate={form.flexibleToDate}
              setFlexibleToDate={form.setFlexibleToDate}
              motivation={form.motivation}
              setMotivation={form.setMotivation}
              happyStressfulEnvironment={form.happyStressfulEnvironment}
              setHappyStressfulEnvironment={form.setHappyStressfulEnvironment}
              goodEnglishLevel={form.goodEnglishLevel}
              setGoodEnglishLevel={form.setGoodEnglishLevel}
              euSchengenResident={form.euSchengenResident}
              setEuSchengenResident={form.setEuSchengenResident}
              showVisaFields={form.showVisaFields}
              greeceVisa={form.greeceVisa}
              setGreeceVisa={form.setGreeceVisa}
              greeceVisaComments={form.greeceVisaComments}
              setGreeceVisaComments={form.setGreeceVisaComments}
              visaExpiryDate={form.visaExpiryDate}
              setVisaExpiryDate={form.setVisaExpiryDate}
            />
          ) : null}

          {form.currentStep === 3 ? (
            <FinalDetailsStep
              t={form.t}
              locale={form.locale}
              fieldErrors={form.fieldErrors}
              setFieldRef={form.setFieldRef}
              clearFieldError={form.clearFieldError}
              languageOptions={form.languageOptions}
              drivingLabels={form.drivingLabels}
              languageGreek={form.languageGreek}
              setLanguageGreek={form.setLanguageGreek}
              languageArabic={form.languageArabic}
              setLanguageArabic={form.setLanguageArabic}
              languageFarsi={form.languageFarsi}
              setLanguageFarsi={form.setLanguageFarsi}
              drivingLicence={form.drivingLicence}
              setDrivingLicence={form.setDrivingLicence}
              drivingLicenceOther={form.drivingLicenceOther}
              setDrivingLicenceOther={form.setDrivingLicenceOther}
              comfortableDriving9SeatVan={form.comfortableDriving9SeatVan}
              setComfortableDriving9SeatVan={form.setComfortableDriving9SeatVan}
              howDidYouHearAboutUs={form.howDidYouHearAboutUs}
              setHowDidYouHearAboutUs={form.setHowDidYouHearAboutUs}
            />
          ) : null}

          {form.status === 'error' ? (
            <p className="text-[15px] text-red-700">{form.t.error}</p>
          ) : null}

          <div className="mt-2 flex flex-wrap gap-3">
            {form.currentStep > 0 ? (
              <button
                type="button"
                onClick={form.goPrevious}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-[var(--border)] bg-white px-6 text-base font-medium text-[var(--charcoal)] transition-colors hover:bg-[var(--cream)]"
              >
                {form.t.nav.previous}
              </button>
            ) : null}
            {form.currentStep < STEP_COUNT - 1 ? (
              <button
                type="button"
                onClick={form.goNext}
                onMouseDown={(e) => e.preventDefault()}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-[var(--green)] px-8 text-base font-medium text-white transition-colors hover:bg-[var(--green-dark)]"
              >
                {form.t.nav.next}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void form.submitApplication()}
                disabled={form.status === 'sending'}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-[var(--green)] px-8 text-base font-medium text-white transition-colors hover:bg-[var(--green-dark)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {form.status === 'sending' ? form.t.sending : form.t.submit}
              </button>
            )}
          </div>
        </form>
      )}
    </section>
  )
}
