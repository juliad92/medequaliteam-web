import { getPayload } from 'payload'
import config from '@payload-config'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function str(value: unknown): string | undefined {
  const s = String(value ?? '').trim()
  return s || undefined
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const firstName = str(body?.firstName)
    const email = str(body?.email)?.toLowerCase()
    const locale = body?.locale === 'fr' ? 'fr' : 'en'
    const pixelTrackingConsent = Boolean(body?.pixelTrackingConsent)

    if (!firstName || !email) {
      return Response.json({ ok: false, error: 'Missing required fields.' }, { status: 400 })
    }

    if (!EMAIL_PATTERN.test(email)) {
      return Response.json({ ok: false, error: 'Invalid email address.' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const existing = await payload.find({
      collection: 'newsletter-subscribers',
      where: { email: { equals: email } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs.length > 0) {
      return Response.json({ ok: true, alreadySubscribed: true })
    }

    await payload.create({
      collection: 'newsletter-subscribers',
      data: {
        firstName,
        email,
        locale,
        pixelTrackingConsent,
      },
    })

    return Response.json({ ok: true })
  } catch {
    return Response.json({ ok: false, error: 'Server error.' }, { status: 500 })
  }
}
