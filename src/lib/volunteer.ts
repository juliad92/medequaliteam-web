import type { Payload } from 'payload'
import type { Project } from '@/payload/payload-types'

export type VolunteerProjectNavItem = {
  slug: string
  title: string
  location: string
}

const MEDICAL_ROLE_PATTERN =
  /\b(medical|nurse|doctor|physician|midwife|clinical|médecin|infirmier|soignant|soignante|médecine)\b/i

export function isMedicalVolunteerRole(roleName: string): boolean {
  return MEDICAL_ROLE_PATTERN.test(roleName)
}

type Locale = 'en' | 'fr'

export async function getProjectsWithVolunteerNeeds(
  payload: Payload,
  locale: Locale,
): Promise<VolunteerProjectNavItem[]> {
  const { docs: needs } = await payload.find({
    collection: 'volunteer-needs',
    where: { _status: { equals: 'published' } },
    locale,
    fallbackLocale: 'en',
    depth: 1,
    limit: 500,
  })

  const byId = new Map<string, VolunteerProjectNavItem>()

  for (const need of needs) {
    const project = need.project
    if (!project || typeof project === 'string') continue

    const p = project as Project
    if (!p.slug || !p.title) continue

    byId.set(p.id, {
      slug: p.slug,
      title: p.title,
      location: p.location ?? '',
    })
  }

  return Array.from(byId.values()).sort((a, b) => a.title.localeCompare(b.title))
}

export async function getVolunteerNeedsForProject(
  payload: Payload,
  projectId: string,
  locale: Locale,
) {
  const { docs } = await payload.find({
    collection: 'volunteer-needs',
    where: {
      project: { equals: projectId },
      _status: { equals: 'published' },
    },
    locale,
    fallbackLocale: 'en',
    sort: 'roleName',
    limit: 100,
  })

  return docs
}
