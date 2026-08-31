const COMPLAINTS_RECIPIENT = 'safeguarding@medequali.team'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function requiredString(value: unknown): string | undefined {
  const result = typeof value === 'string' ? value.trim() : ''
  return result || undefined
}

function isValidComplaint(body: Record<string, unknown>): boolean {
  const email = requiredString(body.email)

  return (
    (body.isSensitive === 'yes' || body.isSensitive === 'no') &&
    Boolean(requiredString(body.firstName)) &&
    Boolean(requiredString(body.lastName)) &&
    Boolean(email && EMAIL_PATTERN.test(email)) &&
    Boolean(requiredString(body.phoneCountryCode)) &&
    Boolean(requiredString(body.phone)) &&
    Boolean(requiredString(body.details))
  )
}

function complaintEmailText(body: Record<string, unknown>): string {
  const isSensitive = body.isSensitive === 'yes' ? 'Yes' : 'No'
  const firstName = requiredString(body.firstName) ?? ''
  const lastName = requiredString(body.lastName) ?? ''
  const email = requiredString(body.email) ?? ''
  const phoneCountryCode = requiredString(body.phoneCountryCode) ?? ''
  const phone = requiredString(body.phone) ?? ''
  const details = requiredString(body.details) ?? ''

  return [
    'New complaint submitted via medequali.team',
    '',
    `Concerns coordination team: ${isSensitive}`,
    '',
    'Contact details',
    `Name: ${firstName} ${lastName}`,
    `Email: ${email}`,
    `Phone: ${phoneCountryCode} ${phone}`,
    '',
    'Complaint details',
    details,
  ].join('\n')
}

export async function POST(req: Request) {
  let body: unknown

  try {
    body = await req.json()
  } catch {
    return Response.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return Response.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  const complaint = body as Record<string, unknown>
  if (!isValidComplaint(complaint)) {
    return Response.json(
      { ok: false, error: 'Missing or invalid required fields.' },
      { status: 400 },
    )
  }

  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) {
    return Response.json({ ok: false, error: 'Email service is not configured.' }, { status: 503 })
  }

  const from =
    process.env.COMPLAINTS_FROM_EMAIL?.trim() ||
    `Med'EqualiTeam complaints <${COMPLAINTS_RECIPIENT}>`
  const email = requiredString(complaint.email) as string

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [COMPLAINTS_RECIPIENT],
        reply_to: email,
        subject: 'New complaint submitted via medequali.team',
        text: complaintEmailText(complaint),
      }),
    })

    if (!response.ok) {
      return Response.json({ ok: false, error: 'Unable to send complaint.' }, { status: 502 })
    }

    return Response.json({ ok: true })
  } catch {
    return Response.json({ ok: false, error: 'Unable to send complaint.' }, { status: 502 })
  }
}
