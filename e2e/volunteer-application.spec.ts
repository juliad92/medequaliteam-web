import { readFileSync } from 'fs'

import { expect, test } from '@playwright/test'

import { SEED_STATE_PATH } from './constants'
import { loginToPayloadAdmin } from './helpers/admin'
import { expectVolunteerApplicationInAdmin } from './helpers/applications'
import { fillAndSubmitVolunteerApplication } from './helpers/form'
import { expectVolunteerProjectInNav } from './helpers/navigation'

type SeedState = {
  projectSlug: string
  emptyProjectSlug: string
  roleName: string
  adminEmail: string
}

const seedState = JSON.parse(readFileSync(SEED_STATE_PATH, 'utf8')) as SeedState

test.describe.configure({ mode: 'serial' })

test.describe('Volunteer recruitment', () => {
  test('lists the project in the volunteer menu when needs are published', async ({ page }) => {
    await page.goto('/en')

    await expectVolunteerProjectInNav(
      page,
      'E2E Volunteer Project',
      `/en/volunteer/${seedState.projectSlug}`,
    )
  })

  test('shows open roles and the application form when volunteer needs are published', async ({
    page,
  }) => {
    await page.goto(`/en/volunteer/${seedState.projectSlug}`)

    const rolesSection = page.locator('#volunteer-roles')
    const applicationSection = page.locator('#volunteer-application')

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Volunteer')
    await expect(rolesSection.getByRole('heading', { name: /Open roles/i })).toBeVisible()
    await expect(rolesSection.getByRole('button', { name: seedState.roleName })).toBeVisible()
    await expect(rolesSection.getByRole('button', { name: 'Apply for this role' })).toBeVisible()

    await expect(
      applicationSection.getByRole('heading', { name: 'Volunteer application form' }),
    ).toBeVisible()
    await expect(applicationSection.getByText('Step 1 of 4 — Profile')).toBeVisible()
    await expect(
      applicationSection.getByRole('button', { name: 'Submit application' }),
    ).toBeHidden()
    await expect(applicationSection.getByRole('button', { name: 'Next' })).toBeVisible()
  })

  test('returns 404 when the project has no published volunteer needs', async ({ page }) => {
    const response = await page.goto(`/en/volunteer/${seedState.emptyProjectSlug}`)
    expect(response?.status()).toBe(404)
  })

  test('submits an application and shows it in Volunteer applications admin', async ({ page }) => {
    test.setTimeout(180_000)
    const uniqueEmail = `e2e-applicant-${Date.now()}@example.com`
    const applicant = {
      firstName: 'E2E',
      lastName: 'Applicant',
      email: uniqueEmail,
      roleName: seedState.roleName,
    }

    await page.goto(`/en/volunteer/${seedState.projectSlug}`)
    await fillAndSubmitVolunteerApplication(page, applicant)

    await expect(page.getByText('Application submitted')).toBeVisible({ timeout: 15_000 })
    await expect(page.getByText(uniqueEmail)).not.toBeVisible()

    await loginToPayloadAdmin(page)
    await expectVolunteerApplicationInAdmin(page, applicant)
  })
})
