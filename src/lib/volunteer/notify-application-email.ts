export type VolunteerApplicationEmailPayload = {
  applicationId: string
  firstName: string
  lastName: string
  age: number
  email: string
  countryOfResidence: string
  nationality: string
  phone: string
  selectedRoles: string
  relevantExperience: string
  cvUploaded: boolean
  medicalGraduationDate: string
  preferredStartDate: string
  preferredEndDate: string
  datesFlexible: string
  flexibleFromDate: string
  flexibleToDate: string
  motivation: string
  happyStressfulEnvironment: string
  goodEnglishLevel: string
  euSchengenResident: string
  greeceVisa: string
  greeceVisaComments: string
  visaExpiryDate: string
  languageGreek: string
  languageArabic: string
  languageFarsi: string
  drivingLicence: string
  drivingLicenceOther: string
  comfortableDriving9SeatVan: string
  howDidYouHearAboutUs: string
  project: string
  locale: string
}

function line(label: string, value: string | number | boolean | undefined): string | null {
  if (value === undefined || value === '') return null
  if (typeof value === 'boolean') return `${label}: ${value ? 'yes' : 'no'}`
  return `${label}: ${value}`
}

function applicationEmailText(data: VolunteerApplicationEmailPayload): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '') || 'https://medequali.team'
  const adminUrl = `${siteUrl}/admin/collections/volunteer-applications/${data.applicationId}`

  const sections = [
    'New volunteer application submitted via medequali.team',
    '',
    `Admin: ${adminUrl}`,
    '',
    'Identity',
    line('Name', `${data.firstName} ${data.lastName}`),
    line('Age', data.age),
    line('Email', data.email),
    line('Phone', data.phone),
    line('Country of residence', data.countryOfResidence),
    line('Nationality', data.nationality),
    line('Locale', data.locale),
    '',
    'Application',
    line('Project', data.project),
    line('Selected roles', data.selectedRoles),
    line('Preferred start date', data.preferredStartDate),
    line('Preferred end date', data.preferredEndDate),
    line('Dates flexible', data.datesFlexible),
    line('Flexible from', data.flexibleFromDate),
    line('Flexible to', data.flexibleToDate),
    line('CV uploaded', data.cvUploaded),
    line('Medical graduation date', data.medicalGraduationDate),
    '',
    'Motivation',
    data.motivation,
    '',
    'Experience',
    data.relevantExperience || '—',
    '',
    'Other details',
    line('Happy in stressful environment', data.happyStressfulEnvironment),
    line('Good English level', data.goodEnglishLevel),
    line('EU / Schengen resident', data.euSchengenResident),
    line('Greece visa', data.greeceVisa),
    line('Visa comments', data.greeceVisaComments),
    line('Visa expiry date', data.visaExpiryDate),
    line('Greek', data.languageGreek),
    line('Arabic', data.languageArabic),
    line('Farsi', data.languageFarsi),
    line('Driving licence', data.drivingLicence),
    line('Driving licence (other)', data.drivingLicenceOther),
    line('Comfortable driving 9-seat van', data.comfortableDriving9SeatVan),
    line('How did you hear about us', data.howDidYouHearAboutUs),
  ]

  return sections.filter((item): item is string => item !== null).join('\n')
}

/**
 * Notifies the volunteer team of a new application via Resend.
 * No-ops when RESEND_API_KEY is not configured.
 */
export async function notifyVolunteerApplicationEmail(
  data: VolunteerApplicationEmailPayload,
): Promise<'sent' | 'skipped'> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) return 'skipped'

  const recipient =
    process.env.VOLUNTEER_APPLICATIONS_RECIPIENT?.trim() || 'volunteer@medequali.team'
  const from =
    process.env.VOLUNTEER_APPLICATIONS_FROM_EMAIL?.trim() ||
    `Med'EqualiTeam volunteers <${recipient}>`

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [recipient],
      reply_to: data.email,
      subject: `New volunteer application — ${data.firstName} ${data.lastName}`,
      text: applicationEmailText(data),
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Resend failed (${response.status}): ${body}`)
  }

  return 'sent'
}
