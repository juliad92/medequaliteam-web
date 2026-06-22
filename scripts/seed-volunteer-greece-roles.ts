import type { Payload } from 'payload'

import { inferVolunteerRoleCategory } from '../src/lib/volunteer/planning-dates'
import { loadLocalEnv, requireEnv } from '../e2e/helpers/env'
import { htmlToLexical } from '../e2e/helpers/lexical'
import {
  scrapeVolunteerGreeceRoles,
  type ScrapedVolunteerRole,
  VOLUNTEER_GREECE_URL,
} from './lib/scrape-volunteer-greece-roles'

const PROJECT_SLUG = 'volunteer_greece'
const PROJECT_TITLE = 'Medical help in Northern Greece'
const PROJECT_LOCATION = 'Thessaloniki, Greece'
const PROJECT_SUMMARY =
  'Free primary health care for refugees and displaced people in Northern Greece.'

async function withPayload<T>(run: (payload: Payload) => Promise<T>): Promise<T> {
  loadLocalEnv()
  requireEnv('DATABASE_URI')
  if (!process.env.PAYLOAD_SECRET?.trim()) {
    process.env.PAYLOAD_SECRET = 'local-payload-secret'
  }

  const [{ getPayload }, { default: config }] = await Promise.all([
    import('payload'),
    import('../payload.config'),
  ])

  const payload = await getPayload({ config })
  try {
    return await run(payload)
  } finally {
    if (payload.db?.destroy) {
      await payload.db.destroy()
    }
  }
}

async function ensureVolunteerGreeceProject(payload: Payload): Promise<string> {
  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: PROJECT_SLUG } },
    limit: 1,
    overrideAccess: true,
  })

  if (docs[0]) {
    const updated = await payload.update({
      collection: 'projects',
      id: docs[0].id,
      data: {
        title: PROJECT_TITLE,
        slug: PROJECT_SLUG,
        status: 'active',
        location: PROJECT_LOCATION,
        summary: PROJECT_SUMMARY,
        _status: 'published',
      },
      locale: 'en',
      overrideAccess: true,
      draft: false,
    })
    return updated.id
  }

  const created = await payload.create({
    collection: 'projects',
    locale: 'en',
    data: {
      title: PROJECT_TITLE,
      slug: PROJECT_SLUG,
      status: 'active',
      location: PROJECT_LOCATION,
      summary: PROJECT_SUMMARY,
      _status: 'published',
    },
    overrideAccess: true,
    draft: false,
  })

  return created.id
}

function roleToPayloadData(role: ScrapedVolunteerRole, projectId: string) {
  return {
    roleName: role.roleName,
    roleCategory: inferVolunteerRoleCategory(role.roleName),
    duration: role.duration,
    jobDescription: htmlToLexical(role.jobDescriptionHtml),
    requiredExperienceAndSkills: htmlToLexical(role.requiredExperienceAndSkillsHtml),
    desiredExperienceAndSkills: role.desiredExperienceAndSkillsHtml
      ? htmlToLexical(role.desiredExperienceAndSkillsHtml)
      : undefined,
    furtherInformation: role.furtherInformationHtml
      ? htmlToLexical(role.furtherInformationHtml)
      : undefined,
    project: projectId,
    _status: 'published' as const,
  }
}

async function upsertVolunteerRole(
  payload: Payload,
  projectId: string,
  role: ScrapedVolunteerRole,
): Promise<'created' | 'updated'> {
  const { docs } = await payload.find({
    collection: 'volunteer-needs',
    where: {
      and: [{ project: { equals: projectId } }, { roleName: { equals: role.roleName } }],
    },
    limit: 1,
    overrideAccess: true,
  })

  const data = roleToPayloadData(role, projectId)

  if (docs[0]) {
    await payload.update({
      collection: 'volunteer-needs',
      id: docs[0].id,
      locale: 'en',
      data,
      overrideAccess: true,
      draft: false,
    })
    return 'updated'
  }

  await payload.create({
    collection: 'volunteer-needs',
    locale: 'en',
    data,
    overrideAccess: true,
    draft: false,
  })
  return 'created'
}

export async function seedVolunteerGreeceRoles(sourceUrl: string = VOLUNTEER_GREECE_URL) {
  const roles = await scrapeVolunteerGreeceRoles(sourceUrl)

  return withPayload(async (payload) => {
    const projectId = await ensureVolunteerGreeceProject(payload)

    let created = 0
    let updated = 0

    for (const role of roles) {
      const result = await upsertVolunteerRole(payload, projectId, role)
      if (result === 'created') created += 1
      else updated += 1
    }

    return { projectId, projectSlug: PROJECT_SLUG, roles: roles.length, created, updated }
  })
}

async function main() {
  const sourceUrl = process.argv[2] ?? VOLUNTEER_GREECE_URL
  console.log(`Scraping volunteer roles from ${sourceUrl}...`)

  const result = await seedVolunteerGreeceRoles(sourceUrl)

  console.log(
    `Seed volunteer Greece: ${result.created} created, ${result.updated} updated (${result.roles} roles for project "${result.projectSlug}").`,
  )
}

if (process.argv[1]?.includes('seed-volunteer-greece-roles')) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
