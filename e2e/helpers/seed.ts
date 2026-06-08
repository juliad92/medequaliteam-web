import { mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import type { Payload } from 'payload'

import { E2E, SEED_STATE_PATH } from '../constants'
import { lexicalParagraph } from './lexical'
import { loadLocalEnv, requireEnv } from './env'

type SeedState = {
  projectSlug: string
  emptyProjectSlug: string
  roleName: string
  adminEmail: string
}

async function deleteVolunteerNeedsForProject(payload: Payload, projectId: string) {
  const { docs } = await payload.find({
    collection: 'volunteer-needs',
    where: { project: { equals: projectId } },
    limit: 100,
    overrideAccess: true,
  })
  for (const doc of docs) {
    await payload.delete({ collection: 'volunteer-needs', id: doc.id, overrideAccess: true })
  }
}

async function ensureAdminUser(payload: Payload) {
  const { docs } = await payload.find({
    collection: 'users',
    where: { email: { equals: E2E.adminEmail } },
    limit: 1,
    overrideAccess: true,
  })

  if (docs[0]) return docs[0]

  return payload.create({
    collection: 'users',
    data: {
      email: E2E.adminEmail,
      password: E2E.adminPassword,
    },
    overrideAccess: true,
  })
}

async function ensureProject(
  payload: Payload,
  slug: string,
  title: string,
) {
  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  })

  if (docs[0]) {
    return payload.update({
      collection: 'projects',
      id: docs[0].id,
      data: {
        title,
        slug,
        status: 'active',
        location: 'Thessaloniki, Greece',
        summary: 'E2E test project for volunteer application flows.',
        _status: 'published',
      },
      locale: 'en',
      overrideAccess: true,
      draft: false,
    })
  }

  return payload.create({
    collection: 'projects',
    locale: 'en',
    data: {
      title,
      slug,
      status: 'active',
      location: 'Thessaloniki, Greece',
      summary: 'E2E test project for volunteer application flows.',
      _status: 'published',
    },
    overrideAccess: true,
    draft: false,
  })
}

async function ensurePublishedVolunteerNeed(payload: Payload, projectId: string) {
  const { docs } = await payload.find({
    collection: 'volunteer-needs',
    where: {
      and: [
        { project: { equals: projectId } },
        { roleName: { equals: E2E.roleName } },
      ],
    },
    limit: 1,
    overrideAccess: true,
  })

  if (docs[0]) {
    await payload.delete({
      collection: 'volunteer-needs',
      id: docs[0].id,
      overrideAccess: true,
    })
  }

  return payload.create({
    collection: 'volunteer-needs',
    locale: 'en',
    data: {
      roleName: E2E.roleName,
      duration: '4 weeks',
      jobDescription: lexicalParagraph('Support daily clinic operations during E2E tests.'),
      requiredExperienceAndSkills: lexicalParagraph('Nursing background or medical training.'),
      project: projectId,
      _status: 'published',
    },
    overrideAccess: true,
    draft: false,
  })
}

async function withPayload<T>(run: (payload: Payload) => Promise<T>): Promise<T> {
  loadLocalEnv()
  requireEnv('DATABASE_URI')
  if (!process.env.PAYLOAD_SECRET?.trim()) {
    process.env.PAYLOAD_SECRET = 'e2e-payload-secret'
  }

  const [{ getPayload }, { default: config }] = await Promise.all([
    import('payload'),
    import('../../payload.config'),
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

export async function seedVolunteerE2EFixtures(): Promise<SeedState> {
  return withPayload(async (payload) => {
  await ensureAdminUser(payload)

  const project = await ensureProject(
    payload,
    E2E.projectSlug,
    'E2E Volunteer Project',
  )

  await deleteVolunteerNeedsForProject(payload, project.id)
  await ensurePublishedVolunteerNeed(payload, project.id)

  const emptyExisting = await payload.find({
    collection: 'projects',
    where: { slug: { equals: E2E.emptyProjectSlug } },
    limit: 1,
    overrideAccess: true,
  })

  if (!emptyExisting.docs[0]) {
    await ensureProject(payload, E2E.emptyProjectSlug, 'E2E Empty Volunteer Project')
  } else {
    await deleteVolunteerNeedsForProject(payload, emptyExisting.docs[0].id)
  }

  const seedState: SeedState = {
    projectSlug: E2E.projectSlug,
    emptyProjectSlug: E2E.emptyProjectSlug,
    roleName: E2E.roleName,
    adminEmail: E2E.adminEmail,
  }

  const dir = path.dirname(SEED_STATE_PATH)
  mkdirSync(dir, { recursive: true })
  writeFileSync(SEED_STATE_PATH, JSON.stringify(seedState, null, 2))

  return seedState
  })
}

export async function cleanupVolunteerE2EApplications() {
  await withPayload(async (payload) => {
    const { docs } = await payload.find({
      collection: 'volunteer-applications',
      where: { email: { contains: 'e2e-applicant-' } },
      limit: 100,
      overrideAccess: true,
    })

    for (const doc of docs) {
      await payload.delete({
        collection: 'volunteer-applications',
        id: doc.id,
        overrideAccess: true,
      })
    }
  })
}
