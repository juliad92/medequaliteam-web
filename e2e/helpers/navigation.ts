import { expect, type Page } from '@playwright/test'

export async function openVolunteerNavDropdown(page: Page) {
  const nav = page.getByRole('navigation')
  await nav.getByRole('link', { name: /^Volunteer/ }).hover()
}

export async function expectVolunteerProjectInNav(
  page: Page,
  projectTitle: string,
  projectHref: string,
) {
  await openVolunteerNavDropdown(page)
  const link = page
    .getByRole('navigation')
    .getByRole('link', { name: projectTitle, exact: true })
  await expect(link).toBeVisible()
  await expect(link).toHaveAttribute('href', projectHref)
}
