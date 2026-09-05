import { isValidEmail } from '@/lib/validation'

import type { FormTranslations } from './translations'
import type { FieldErrors } from './types'

type StepValidationInput = {
  step: number
  t: FormTranslations
  firstName: string
  lastName: string
  age: string
  email: string
  countryOfResidence: string
  nationality: string
  phoneCountryCode: string
  phone: string
  motivation: string
  howDidYouHearAboutUs: string
  availableRolesCount: number
  selectedRoleIdsCount: number
}

export function getStepErrors(input: StepValidationInput): FieldErrors {
  const errors: FieldErrors = {}

  if (input.step === 0) {
    if (!input.firstName.trim()) errors.firstName = input.t.fieldErrors.required
    if (!input.lastName.trim()) errors.lastName = input.t.fieldErrors.required
    if (!input.age.trim()) {
      errors.age = input.t.fieldErrors.required
    } else {
      const ageNum = Number(input.age)
      if (!Number.isFinite(ageNum) || ageNum < 16 || ageNum > 99) {
        errors.age = input.t.fieldErrors.invalidAge
      }
    }
    if (!input.email.trim()) {
      errors.email = input.t.fieldErrors.required
    } else if (!isValidEmail(input.email)) {
      errors.email = input.t.fieldErrors.invalidEmail
    }
    if (!input.countryOfResidence.trim()) errors.countryOfResidence = input.t.fieldErrors.required
    if (!input.nationality.trim()) errors.nationality = input.t.fieldErrors.required
    if (!input.phoneCountryCode.trim()) errors.phoneCountryCode = input.t.fieldErrors.required
    if (!input.phone.trim()) errors.phone = input.t.fieldErrors.required
    if (input.availableRolesCount > 0 && input.selectedRoleIdsCount === 0) {
      errors.selectedRoles = input.t.selectRole
    }
  }

  if (input.step === 2 && !input.motivation.trim()) {
    errors.motivation = input.t.fieldErrors.required
  }

  if (input.step === 3 && !input.howDidYouHearAboutUs.trim()) {
    errors.howDidYouHearAboutUs = input.t.fieldErrors.required
  }

  return errors
}

export function scrollToFirstError(
  errors: FieldErrors,
  step: number,
  fieldRefs: Partial<Record<string, HTMLElement>>,
  stepFieldOrder: Record<number, string[]>,
) {
  const order = stepFieldOrder[step] ?? Object.keys(errors)
  const firstField = order.find((name) => errors[name as keyof FieldErrors])
  if (!firstField) return

  const el = fieldRefs[firstField]
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
