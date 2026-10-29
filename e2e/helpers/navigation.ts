import { expect, type Page } from '@playwright/test'

export async function openVolunteerNavDropdown(page: Page) {
  const nav = page.getByRole('navigation')
  const volunteerLink = nav.getByRole('link', { name: /Volunteer with us/i })
  await volunteerLink.hover()
  // Always present once the dropdown is open (independent of seeded projects).
  await expect(nav.getByRole('link', { name: /Volunteer stories/i })).toBeVisible()
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
