import { spawnSync } from 'node:child_process'

import { applyE2EDatabaseEnv } from './helpers/database'

export default async function globalTeardown() {
  applyE2EDatabaseEnv()

  spawnSync('pnpm', ['exec', 'tsx', 'e2e/scripts/seed.ts', 'cleanup'], {
    stdio: 'inherit',
    env: process.env,
    cwd: process.cwd(),
  })
}
