import { getPayload } from 'payload'
import config from '@payload-config'

function str(value: unknown): string | undefined {
  const s = String(value ?? '').trim()
  return s || undefined
}

function yesNo(value: unknown): 'yes' | 'no' | undefined {
  return value === 'yes' || value === 'no' ? value : undefined
}

function languageLevel(value: unknown): 'basic' | 'intermediate' | 'fluent' | undefined {
  if (value === 'basic' || value === 'intermediate' || value === 'fluent') return value
  return undefined
}

function drivingLicence(value: unknown): 'yes' | 'no' | 'other' | undefined {
  if (value === 'yes' || value === 'no' || value === 'other') return value
  return undefined
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const firstName = str(body?.firstName)
    const lastName = str(body?.lastName)
    const email = str(body?.email)
    const motivation = str(body?.motivation)
    const project = str(body?.project)
    const countryOfResidence = str(body?.countryOfResidence)
    const nationality = str(body?.nationality)
    const phoneCountryCode = str(body?.phoneCountryCode)
    const phone = str(body?.phone)
    const howDidYouHearAboutUs = str(body?.howDidYouHearAboutUs)
    const locale = body?.locale === 'fr' ? 'fr' : 'en'
    const age = Number(body?.age)

    if (
      !firstName ||
      !lastName ||
      !email ||
      !motivation ||
      !project ||
      !countryOfResidence ||
      !nationality ||
      !phoneCountryCode ||
      !phone ||
      !howDidYouHearAboutUs ||
      !Number.isFinite(age) ||
      age < 16
    ) {
      return Response.json({ ok: false, error: 'Missing required fields.' }, { status: 400 })
    }

    const selectedRoles = Array.isArray(body?.selectedRoles)
      ? body.selectedRoles.filter((id: unknown) => typeof id === 'string' && id.length > 0)
      : []

    const payload = await getPayload({ config })

    await payload.create({
      collection: 'volunteer-applications',
      data: {
        firstName,
        lastName,
        age,
        email,
        countryOfResidence,
        nationality,
        phoneCountryCode,
        phone,
        selectedRoles: selectedRoles.length > 0 ? selectedRoles : undefined,
        emergencyFirstName: str(body?.emergencyFirstName),
        emergencyLastName: str(body?.emergencyLastName),
        emergencyRelation: str(body?.emergencyRelation),
        emergencyPhoneCountryCode: str(body?.emergencyPhoneCountryCode),
        emergencyPhone: str(body?.emergencyPhone),
        relevantWorkAcademicExperience: str(body?.relevantWorkAcademicExperience),
        volunteerExperience: str(body?.volunteerExperience),
        experienceWithRefugees: str(body?.experienceWithRefugees),
        otherExperience: str(body?.otherExperience),
        medicalGraduationDate: str(body?.medicalGraduationDate),
        preferredStartDate: str(body?.preferredStartDate),
        preferredEndDate: str(body?.preferredEndDate),
        motivation,
        happyStressfulEnvironment: yesNo(body?.happyStressfulEnvironment),
        goodEnglishLevel: yesNo(body?.goodEnglishLevel),
        euSchengenResident: yesNo(body?.euSchengenResident),
        greeceVisa: yesNo(body?.greeceVisa),
        greeceVisaComments: str(body?.greeceVisaComments),
        visaExpiryDate: str(body?.visaExpiryDate),
        experienceWorkingAbroad: str(body?.experienceWorkingAbroad),
        languageGreek: languageLevel(body?.languageGreek),
        languageArabic: languageLevel(body?.languageArabic),
        languageFarsi: languageLevel(body?.languageFarsi),
        drivingLicence: drivingLicence(body?.drivingLicence),
        drivingLicenceOther: str(body?.drivingLicenceOther),
        howDidYouHearAboutUs,
        project,
        locale,
      },
    })

    return Response.json({ ok: true })
  } catch {
    return Response.json({ ok: false, error: 'Server error.' }, { status: 500 })
  }
}
