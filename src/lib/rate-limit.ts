type RateLimitConfig = {
  limit: number
  windowMs: number
}

type RateLimitRecord = {
  count: number
  resetTime: number
}

const stores = new Map<string, Map<string, RateLimitRecord>>()

const HOUR_MS = 60 * 60 * 1000

export const RATE_LIMITS = {
  volunteerApplication: { limit: 5, windowMs: HOUR_MS },
  newsletter: { limit: 10, windowMs: HOUR_MS },
  complaints: { limit: 5, windowMs: HOUR_MS },
} as const satisfies Record<string, RateLimitConfig>

function getStore(namespace: string): Map<string, RateLimitRecord> {
  let store = stores.get(namespace)
  if (!store) {
    store = new Map()
    stores.set(namespace, store)
  }
  return store
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() ?? 'unknown'
  }
  return req.headers.get('x-real-ip')?.trim() ?? 'unknown'
}

function rateLimitResponse(retryAfterSeconds: number): Response {
  return Response.json(
    { ok: false, error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: { 'Retry-After': String(retryAfterSeconds) },
    },
  )
}

/** Returns a 429 response when the limit is exceeded, otherwise null. */
export function checkRateLimit(
  req: Request,
  namespace: string,
  config: RateLimitConfig,
): Response | null {
  const ip = getClientIp(req)
  const store = getStore(namespace)
  const now = Date.now()
  const record = store.get(ip)

  if (!record || now >= record.resetTime) {
    store.set(ip, { count: 1, resetTime: now + config.windowMs })
    return null
  }

  if (record.count >= config.limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((record.resetTime - now) / 1000))
    return rateLimitResponse(retryAfterSeconds)
  }

  record.count++
  return null
}
