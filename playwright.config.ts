import { defineConfig, devices } from '@playwright/test'

import { applyE2EDatabaseEnv } from './e2e/helpers/database'

applyE2EDatabaseEnv()

const e2ePort = process.env.E2E_PORT ?? '3100'
const e2eBaseUrl = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${e2ePort}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : [['list'], ['html', { open: 'never' }]],
  globalSetup: './e2e/global-setup.ts',
  globalTeardown: './e2e/global-teardown.ts',
  timeout: 60_000,
  use: {
    baseURL: e2eBaseUrl,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'admin-warmup',
      testMatch: /admin-warmup\.setup\.ts/,
    },
    {
      name: 'chromium',
      dependencies: ['admin-warmup'],
      testIgnore: /admin-warmup\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `pnpm exec next dev --port ${e2ePort}`,
    url: e2eBaseUrl,
    // Start a dedicated server on the E2E port/database; opt in to reuse with E2E_REUSE_SERVER=true.
    reuseExistingServer: process.env.E2E_REUSE_SERVER === 'true' && !process.env.CI,
    timeout: 180_000,
    env: {
      DATABASE_URI: process.env.DATABASE_URI ?? '',
      PAYLOAD_SECRET: process.env.PAYLOAD_SECRET ?? 'e2e-payload-secret',
    },
  },
})
