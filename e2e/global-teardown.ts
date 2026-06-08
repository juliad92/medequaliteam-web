import { spawnSync } from 'node:child_process'

export default async function globalTeardown() {
  spawnSync('pnpm', ['exec', 'tsx', 'e2e/scripts/seed.ts', 'cleanup'], {
    stdio: 'inherit',
    env: process.env,
    cwd: process.cwd(),
  })
}
