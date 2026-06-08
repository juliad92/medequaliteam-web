import { expect, type Page } from '@playwright/test'

export type VolunteerApplicationInput = {
  firstName: string
  lastName: string
  email: string
  roleName: string
}

function applicationForm(page: Page) {
  return page.locator('#volunteer-application form')
}

export async function fillAndSubmitVolunteerApplication(
  page: Page,
  input: VolunteerApplicationInput,
) {
  const section = page.locator('#volunteer-application')
  await expect(section.getByRole('heading', { name: 'Volunteer application form' })).toBeVisible()

  const form = applicationForm(page)
  await expect(form.getByText('Step 1 of 4 — Profile')).toBeVisible()

  // Step 1 — Profile
  await form.getByLabel(/^First name/).fill(input.firstName)
  await form.getByLabel(/^Last name/).fill(input.lastName)
  await form.getByLabel(/^Age/).fill('28')
  await form.getByLabel(/^Email/).fill(input.email)
  await form.getByLabel(/^Country of residence/).fill('France')
  await form.getByLabel(/^Nationality/).fill('French')
  await form.locator('#phoneCountryCode').selectOption('+33')
  await form.getByLabel(/^Phone number/).fill('612345678')
  await form.getByRole('checkbox', { name: input.roleName }).check()
  await form.getByRole('button', { name: 'Next' }).click()

  // Step 2 — Experience (optional fields)
  await expect(form.getByText('Step 2 of 4 — Experience')).toBeVisible()
  await form.getByRole('button', { name: 'Next' }).click()

  // Step 3 — Availability
  await expect(form.getByText('Step 3 of 4 — Availability')).toBeVisible()
  await form.getByLabel(/^Motivation/).fill(
    'I want to contribute my medical skills to support displaced people.',
  )
  await form.getByRole('button', { name: 'Next' }).click()

  // Step 4 — Final details
  await expect(form.getByText('Step 4 of 4 — Final details')).toBeVisible()
  await form.getByLabel(/^How did you hear about us/).fill('E2E test')

  const [response] = await Promise.all([
    page.waitForResponse(
      (res) =>
        res.url().includes('/api/volunteer-application') && res.request().method() === 'POST',
      { timeout: 60_000 },
    ),
    form.getByRole('button', { name: 'Submit application' }).click(),
  ])

  expect(response.ok(), `Volunteer application API failed: ${await response.text()}`).toBeTruthy()
}
