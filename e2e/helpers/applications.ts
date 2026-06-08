import { expect, type Page } from '@playwright/test'

export type VolunteerApplicant = {
  firstName: string
  lastName: string
  email: string
}

export async function expectVolunteerApplicationInAdmin(
  page: Page,
  applicant: VolunteerApplicant,
) {
  await expect(page).toHaveURL(/\/admin\/collections\/volunteer-applications/)

  const row = page.locator('tbody tr').filter({ hasText: applicant.email })
  await expect(row).toBeVisible({ timeout: 30_000 })
  await expect(row).toContainText(applicant.firstName)
  await expect(row).toContainText(applicant.lastName)
  await expect(row).toContainText(applicant.email)

  // Payload links the first visible column (first name), not the email field.
  await row.getByRole('link', { name: applicant.firstName, exact: true }).click()
  await expect(page).toHaveURL(/\/admin\/collections\/volunteer-applications\/[^/]+$/)
  await expect(page.getByRole('heading', { name: applicant.email })).toBeVisible()
}
