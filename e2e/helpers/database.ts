import { loadLocalEnv, requireEnv } from './env'

/**
 * Resolves the MongoDB URI used exclusively for Playwright E2E runs.
 *
 * Prefer `E2E_DATABASE_URI` when set. Otherwise derive `{database}-e2e` from
 * `DATABASE_URI` so local dev data stays untouched.
 */
export function resolveE2EDatabaseUri(): string {
  const explicit = process.env.E2E_DATABASE_URI?.trim()
  if (explicit) return explicit

  const databaseUri = requireEnv('DATABASE_URI')
  const match = databaseUri.match(/^(mongodb(?:\+srv)?:\/\/[^/]+\/)([^/?]+)(\?.*)?$/)
  if (!match) {
    throw new Error(
      'Cannot derive E2E database URI from DATABASE_URI. Set E2E_DATABASE_URI explicitly.',
    )
  }

  const [, prefix, databaseName, query = ''] = match
  const e2eDatabaseName = databaseName.endsWith('-e2e') ? databaseName : `${databaseName}-e2e`
  return `${prefix}${e2eDatabaseName}${query}`
}

/** Point Payload / Next at the isolated E2E database for the current process. */
export function applyE2EDatabaseEnv() {
  loadLocalEnv()
  process.env.DATABASE_URI = resolveE2EDatabaseUri()
}
