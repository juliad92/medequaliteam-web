import { getPayload } from 'payload'
import config from '@payload-config'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { defaultVolunteerApplicationStatus } from '@/lib/volunteer/application-status'
import { isAllowedCvFile, mimeTypeForCv, sanitizeCvFilename } from '@/lib/volunteer/cv-upload'

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

async function readApplicationRequest(req: Request): Promise<{
  body: Record<string, unknown>
  cvFile: File | null
}> {
  const contentType = req.headers.get('content-type') || ''
  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData()
    const payloadField = formData.get('payload')
    const cv = formData.get('cv')
    const cvFile = cv instanceof File && cv.size > 0 ? cv : null

    if (typeof payloadField === 'string' && payloadField.trim()) {
      const parsed: unknown = JSON.parse(payloadField)
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('invalid_payload')
      }
      return { body: parsed as Record<string, unknown>, cvFile }
    }

    const body: Record<string, unknown> = {}
    for (const [key, value] of formData.entries()) {
      if (key === 'cv') continue
      body[key] = typeof value === 'string' ? value : undefined
    }
    return { body, cvFile }
  }

  const parsed: unknown = await req.json()
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('invalid_payload')
  }
  return { body: parsed as Record<string, unknown>, cvFile: null }
}

export async function POST(req: Request) {
  const rateLimited = checkRateLimit(req, 'volunteer-application', RATE_LIMITS.volunteerApplication)
  if (rateLimited) return rateLimited

  try {
    let body: Record<string, unknown>
    let cvFile: File | null
    try {
      ;({ body, cvFile } = await readApplicationRequest(req))
    } catch {
      return Response.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
    }

    const firstName = str(body.firstName)
    const lastName = str(body.lastName)
    const email = str(body.email)
    const motivation = str(body.motivation)
    const project = str(body.project)
    const countryOfResidence = str(body.countryOfResidence)
    const nationality = str(body.nationality)
    const phoneCountryCode = str(body.phoneCountryCode)
    const phone = str(body.phone)
    const howDidYouHearAboutUs = str(body.howDidYouHearAboutUs)
    const locale = body.locale === 'fr' ? 'fr' : 'en'
    const age = Number(body.age)

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

    if (cvFile && !isAllowedCvFile(cvFile.name, cvFile.type, cvFile.size)) {
      return Response.json({ ok: false, error: 'Invalid CV file.' }, { status: 400 })
    }

    const selectedRoles = Array.isArray(body.selectedRoles)
      ? body.selectedRoles.filter((id: unknown) => typeof id === 'string' && id.length > 0)
      : []

    const payload = await getPayload({ config })
    let cvId: string | undefined

    if (cvFile) {
      const buffer = Buffer.from(await cvFile.arrayBuffer())
      const cvDoc = await payload.create({
        collection: 'volunteer-cvs',
        data: {},
        file: {
          data: buffer,
          mimetype: mimeTypeForCv(cvFile.name, cvFile.type),
          name: sanitizeCvFilename(cvFile.name),
          size: buffer.length,
        },
      })
      cvId = cvDoc.id
    }

    const datesFlexible = yesNo(body.datesFlexible)

    try {
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
          relevantWorkAcademicExperience: str(body.relevantWorkAcademicExperience),
          cv: cvId,
          medicalGraduationDate: str(body.medicalGraduationDate),
          preferredStartDate: str(body.preferredStartDate),
          preferredEndDate: str(body.preferredEndDate),
          datesFlexible,
          flexibleFromDate: datesFlexible === 'yes' ? str(body.flexibleFromDate) : undefined,
          flexibleToDate: datesFlexible === 'yes' ? str(body.flexibleToDate) : undefined,
          motivation,
          happyStressfulEnvironment: yesNo(body.happyStressfulEnvironment),
          goodEnglishLevel: yesNo(body.goodEnglishLevel),
          euSchengenResident: yesNo(body.euSchengenResident),
          greeceVisa: yesNo(body.greeceVisa),
          greeceVisaComments: str(body.greeceVisaComments),
          visaExpiryDate: str(body.visaExpiryDate),
          languageGreek: languageLevel(body.languageGreek),
          languageArabic: languageLevel(body.languageArabic),
          languageFarsi: languageLevel(body.languageFarsi),
          drivingLicence: drivingLicence(body.drivingLicence),
          drivingLicenceOther: str(body.drivingLicenceOther),
          comfortableDriving9SeatVan: yesNo(body.comfortableDriving9SeatVan),
          howDidYouHearAboutUs,
          project,
          locale,
          applicationStatus: defaultVolunteerApplicationStatus,
        },
      })
    } catch (error) {
      if (cvId) {
        await payload.delete({ collection: 'volunteer-cvs', id: cvId }).catch(() => undefined)
      }
      throw error
    }

    return Response.json({ ok: true })
  } catch {
    return Response.json({ ok: false, error: 'Server error.' }, { status: 500 })
  }
}
