import { getPayload } from 'payload'
import config from '@payload-config'

function str(value: unknown): string | undefined {
  const s = String(value ?? '').trim()
  return s || undefined
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const firstName = str(body?.firstName)
    const lastName = str(body?.lastName)
    const email = str(body?.email)
    const country = str(body?.country)
    const locale = body?.locale === 'fr' ? 'fr' : 'en'

    if (!firstName || !lastName || !email || !country) {
      return Response.json({ ok: false, error: 'Missing required fields.' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    await payload.create({
      collection: 'donation-inquiries',
      data: { firstName, lastName, email, country, locale },
    })

    return Response.json({ ok: true })
  } catch {
    return Response.json({ ok: false, error: 'Server error.' }, { status: 500 })
  }
}
