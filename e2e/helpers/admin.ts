import { expect, type Page } from '@playwright/test'

import { E2E } from '../constants'

export async function loginToPayloadAdmin(page: Page) {
  const loginResponse = await page.request.post('/api/users/login', {
    data: {
      email: E2E.adminEmail,
      password: E2E.adminPassword,
    },
  })

  expect(loginResponse.ok(), `Admin login failed: ${await loginResponse.text()}`).toBeTruthy()

  await page.goto('/admin/collections/volunteer-applications', {
    waitUntil: 'domcontentloaded',
    timeout: 90_000,
  })
  await expect(page).toHaveURL(/\/admin\/collections\/volunteer-applications/, {
    timeout: 30_000,
  })
  await expect(page.getByRole('heading', { name: /Volunteer applications/i })).toBeVisible({
    timeout: 30_000,
  })
}
