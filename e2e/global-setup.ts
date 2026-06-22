import { spawnSync } from 'node:child_process'

import { applyE2EDatabaseEnv } from './helpers/database'

export default async function globalSetup() {
  applyE2EDatabaseEnv()

  const result = spawnSync('pnpm', ['exec', 'tsx', 'e2e/scripts/seed.ts'], {
    stdio: 'inherit',
    env: process.env,
    cwd: process.cwd(),
  })

  if (result.status !== 0) {
    throw new Error('Failed to seed volunteer E2E fixtures')
  }
}
