export type AvailableRole = { id: string; roleName: string }

export type YesNo = '' | 'yes' | 'no'
export type LanguageLevel = '' | 'basic' | 'intermediate' | 'fluent'
export type DrivingLicence = '' | 'yes' | 'no' | 'other'

export const STEP_COUNT = 4

export type FieldName =
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

export type FieldErrors = Partial<Record<FieldName, string>>

export const STEP_FIELD_ORDER: Record<number, FieldName[]> = {
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

export type FormStatus = 'idle' | 'sending' | 'success' | 'error'

export type VolunteerApplicationFormProps = {
  locale: string
  projectId: string
  availableRoles?: AvailableRole[]
  selectedRoleIds: string[]
  onSelectedRoleIdsChange: (ids: string[]) => void
}
