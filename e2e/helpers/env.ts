import { existsSync, readFileSync } from 'fs'
import path from 'path'

/** Load .env.local / .env into process.env for Playwright setup (without adding dotenv). */
export function loadLocalEnv() {
  const candidates = ['.env.local', '.env'].map((file) => path.resolve(process.cwd(), file))
  const envPath = candidates.find((file) => existsSync(file))
  if (!envPath) return

  const content = readFileSync(envPath, 'utf8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  }
}

export function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Missing ${name}. Set it in .env.local or the environment before running Playwright E2E tests.`,
    )
  }
  return value
}
