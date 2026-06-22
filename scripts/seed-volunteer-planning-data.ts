import type { Payload } from 'payload'

import { loadLocalEnv, requireEnv } from '../e2e/helpers/env'
import type { VolunteerApplicationStatus } from '../src/lib/volunteer/application-status'

const SEED_EMAIL_PREFIX = 'seed-demo-applicant-'
const SEED_EMAIL_DOMAIN = '@medequaliteam.test'
const TARGET_COUNT = 30

type VolunteerNeedRef = {
  id: string
  roleName: string
  projectId: string
}

type SeedApplicant = {
  firstName: string
  lastName: string
  age: number
  countryOfResidence: string
  nationality: string
  locale: 'en' | 'fr'
  motivation: string
  applicationStatus: VolunteerApplicationStatus
  preferredStartDate?: string
  preferredEndDate?: string
  confirmedStartDate?: string
  confirmedEndDate?: string
  submittedDaysAgo: number
  roleCount: 1 | 2
}

const applicants: SeedApplicant[] = [
  {
    firstName: 'Marie',
    lastName: 'Dupont',
    age: 28,
    countryOfResidence: 'France',
    nationality: 'French',
    locale: 'fr',
    motivation: 'Souhaite mettre mes compétences infirmières au service des personnes déplacées.',
    applicationStatus: 'confirmed',
    preferredStartDate: '2025-03-01',
    preferredEndDate: '2025-05-31',
    confirmedStartDate: '2025-03-05',
    confirmedEndDate: '2025-05-28',
    submittedDaysAgo: 120,
    roleCount: 1,
  },
  {
    firstName: 'Thomas',
    lastName: 'Bernard',
    age: 32,
    countryOfResidence: 'Belgium',
    nationality: 'Belgian',
    locale: 'fr',
    motivation: 'Expérience en médecine humanitaire, disponible pour un engagement de 3 mois.',
    applicationStatus: 'confirmed',
    preferredStartDate: '2025-04-15',
    preferredEndDate: '2025-07-15',
    confirmedStartDate: '2025-04-15',
    confirmedEndDate: '2025-07-10',
    submittedDaysAgo: 105,
    roleCount: 1,
  },
  {
    firstName: 'Sophie',
    lastName: 'Martin',
    age: 26,
    countryOfResidence: 'France',
    nationality: 'French',
    locale: 'fr',
    motivation: 'Coordinateur·rice bénévole motivé·e par le travail de terrain.',
    applicationStatus: 'in_discussion',
    preferredStartDate: '2025-05-01',
    preferredEndDate: '2025-08-31',
    submittedDaysAgo: 90,
    roleCount: 2,
  },
  {
    firstName: 'Lucas',
    lastName: 'Moreau',
    age: 29,
    countryOfResidence: 'Switzerland',
    nationality: 'Swiss',
    locale: 'fr',
    motivation: 'Médecin généraliste, souhaite rejoindre une équipe pluridisciplinaire.',
    applicationStatus: 'confirmed',
    preferredStartDate: '2025-06-01',
    preferredEndDate: '2025-09-30',
    confirmedStartDate: '2025-06-01',
    confirmedEndDate: '2025-09-30',
    submittedDaysAgo: 75,
    roleCount: 1,
  },
  {
    firstName: 'Emma',
    lastName: 'Lefebvre',
    age: 24,
    countryOfResidence: 'France',
    nationality: 'French',
    locale: 'fr',
    motivation: 'Étudiante en soins infirmiers, stage humanitaire envisagé.',
    applicationStatus: 'not_confirmed',
    preferredStartDate: '2025-07-01',
    preferredEndDate: '2025-08-31',
    submittedDaysAgo: 60,
    roleCount: 1,
  },
  {
    firstName: 'James',
    lastName: 'Wilson',
    age: 35,
    countryOfResidence: 'United Kingdom',
    nationality: 'British',
    locale: 'en',
    motivation: 'Experienced nurse seeking a meaningful field placement.',
    applicationStatus: 'in_discussion',
    preferredStartDate: '2025-07-15',
    preferredEndDate: '2025-10-15',
    submittedDaysAgo: 55,
    roleCount: 2,
  },
  {
    firstName: 'Clara',
    lastName: 'Rossi',
    age: 31,
    countryOfResidence: 'Italy',
    nationality: 'Italian',
    locale: 'en',
    motivation: 'Psychologist with refugee camp experience.',
    applicationStatus: 'confirmed',
    preferredStartDate: '2025-08-01',
    preferredEndDate: '2025-11-30',
    confirmedStartDate: '2025-08-05',
    confirmedEndDate: '2025-11-25',
    submittedDaysAgo: 50,
    roleCount: 1,
  },
  {
    firstName: 'Hugo',
    lastName: 'Petit',
    age: 27,
    countryOfResidence: 'France',
    nationality: 'French',
    locale: 'fr',
    motivation: 'Logisticien, habitué aux environnements contraints.',
    applicationStatus: 'not_confirmed',
    preferredStartDate: '2025-09-01',
    preferredEndDate: '2025-12-15',
    submittedDaysAgo: 45,
    roleCount: 1,
  },
  {
    firstName: 'Anna',
    lastName: 'Schmidt',
    age: 33,
    countryOfResidence: 'Germany',
    nationality: 'German',
    locale: 'en',
    motivation: 'Midwife available for a 4-month mission.',
    applicationStatus: 'in_discussion',
    preferredStartDate: '2025-09-15',
    preferredEndDate: '2026-01-15',
    submittedDaysAgo: 40,
    roleCount: 1,
  },
  {
    firstName: 'Julien',
    lastName: 'Garcia',
    age: 30,
    countryOfResidence: 'Spain',
    nationality: 'Spanish',
    locale: 'fr',
    motivation: 'Médecin urgentiste, anglais et espagnol courants.',
    applicationStatus: 'confirmed',
    preferredStartDate: '2025-10-01',
    preferredEndDate: '2026-01-31',
    confirmedStartDate: '2025-10-01',
    confirmedEndDate: '2026-01-31',
    submittedDaysAgo: 35,
    roleCount: 1,
  },
  {
    firstName: 'Léa',
    lastName: 'Fontaine',
    age: 25,
    countryOfResidence: 'France',
    nationality: 'French',
    locale: 'fr',
    motivation: 'Première expérience humanitaire, très motivée.',
    applicationStatus: 'not_confirmed',
    submittedDaysAgo: 30,
    roleCount: 1,
  },
  {
    firstName: 'Oliver',
    lastName: 'Brown',
    age: 38,
    countryOfResidence: 'Ireland',
    nationality: 'Irish',
    locale: 'en',
    motivation: 'GP with prior volunteering in Greece.',
    applicationStatus: 'in_discussion',
    preferredStartDate: '2025-11-01',
    preferredEndDate: '2026-02-28',
    submittedDaysAgo: 28,
    roleCount: 2,
  },
  {
    firstName: 'Camille',
    lastName: 'Durand',
    age: 29,
    countryOfResidence: 'France',
    nationality: 'French',
    locale: 'fr',
    motivation: 'Infirmière diplômée, disponible dès novembre.',
    applicationStatus: 'confirmed',
    preferredStartDate: '2025-11-15',
    preferredEndDate: '2026-03-15',
    confirmedStartDate: '2025-11-15',
    confirmedEndDate: '2026-03-01',
    submittedDaysAgo: 25,
    roleCount: 1,
  },
  {
    firstName: 'Nina',
    lastName: 'Kowalski',
    age: 27,
    countryOfResidence: 'Poland',
    nationality: 'Polish',
    locale: 'en',
    motivation: 'Public health background, fluent in English and French.',
    applicationStatus: 'not_confirmed',
    preferredStartDate: '2025-12-01',
    preferredEndDate: '2026-03-31',
    submittedDaysAgo: 22,
    roleCount: 1,
  },
  {
    firstName: 'Antoine',
    lastName: 'Leroy',
    age: 34,
    countryOfResidence: 'France',
    nationality: 'French',
    locale: 'fr',
    motivation: 'Pharmacien bénévole, expérience en ONG.',
    applicationStatus: 'in_discussion',
    preferredStartDate: '2026-01-10',
    preferredEndDate: '2026-04-10',
    submittedDaysAgo: 20,
    roleCount: 1,
  },
  {
    firstName: 'Sarah',
    lastName: 'Miller',
    age: 28,
    countryOfResidence: 'Canada',
    nationality: 'Canadian',
    locale: 'en',
    motivation: 'Nurse practitioner interested in refugee health.',
    applicationStatus: 'confirmed',
    preferredStartDate: '2026-01-15',
    preferredEndDate: '2026-05-15',
    confirmedStartDate: '2026-01-20',
    confirmedEndDate: '2026-05-10',
    submittedDaysAgo: 18,
    roleCount: 1,
  },
  {
    firstName: 'Paul',
    lastName: 'Renard',
    age: 31,
    countryOfResidence: 'France',
    nationality: 'French',
    locale: 'fr',
    motivation: 'Coordinateur logistique, permis B.',
    applicationStatus: 'not_confirmed',
    preferredStartDate: '2026-02-01',
    preferredEndDate: '2026-06-30',
    submittedDaysAgo: 16,
    roleCount: 2,
  },
  {
    firstName: 'Elena',
    lastName: 'Vasquez',
    age: 26,
    countryOfResidence: 'Portugal',
    nationality: 'Portuguese',
    locale: 'en',
    motivation: 'Medical student, final year.',
    applicationStatus: 'in_discussion',
    preferredStartDate: '2026-02-15',
    preferredEndDate: '2026-05-15',
    submittedDaysAgo: 14,
    roleCount: 1,
  },
  {
    firstName: 'Maxime',
    lastName: 'Blanc',
    age: 36,
    countryOfResidence: 'France',
    nationality: 'French',
    locale: 'fr',
    motivation: 'Médecin avec expérience en contexte migratoire.',
    applicationStatus: 'confirmed',
    preferredStartDate: '2026-03-01',
    preferredEndDate: '2026-07-31',
    confirmedStartDate: '2026-03-01',
    confirmedEndDate: '2026-07-31',
    submittedDaysAgo: 12,
    roleCount: 1,
  },
  {
    firstName: 'Laura',
    lastName: 'Jansen',
    age: 30,
    countryOfResidence: 'Netherlands',
    nationality: 'Dutch',
    locale: 'en',
    motivation: 'Social worker, Arabic basic level.',
    applicationStatus: 'not_confirmed',
    submittedDaysAgo: 10,
    roleCount: 1,
  },
  {
    firstName: 'Baptiste',
    lastName: 'Chevalier',
    age: 29,
    countryOfResidence: 'France',
    nationality: 'French',
    locale: 'fr',
    motivation: 'Infirmier anesthésiste, mission de 2 mois possible.',
    applicationStatus: 'in_discussion',
    preferredStartDate: '2026-04-01',
    preferredEndDate: '2026-06-01',
    submittedDaysAgo: 9,
    roleCount: 1,
  },
  {
    firstName: 'Isabelle',
    lastName: 'Marchand',
    age: 32,
    countryOfResidence: 'Belgium',
    nationality: 'Belgian',
    locale: 'fr',
    motivation: 'Gynécologue, plusieurs missions MSF.',
    applicationStatus: 'confirmed',
    preferredStartDate: '2026-04-15',
    preferredEndDate: '2026-08-15',
    confirmedStartDate: '2026-04-15',
    confirmedEndDate: '2026-08-01',
    submittedDaysAgo: 8,
    roleCount: 1,
  },
  {
    firstName: 'David',
    lastName: 'Taylor',
    age: 37,
    countryOfResidence: 'United States',
    nationality: 'American',
    locale: 'en',
    motivation: 'Emergency physician, EU work authorization.',
    applicationStatus: 'not_confirmed',
    preferredStartDate: '2026-05-01',
    preferredEndDate: '2026-08-31',
    submittedDaysAgo: 7,
    roleCount: 2,
  },
  {
    firstName: 'Chloé',
    lastName: 'Girard',
    age: 24,
    countryOfResidence: 'France',
    nationality: 'French',
    locale: 'fr',
    motivation: 'Étudiante en médecine, stage de terrain souhaité.',
    applicationStatus: 'in_discussion',
    preferredStartDate: '2026-05-15',
    preferredEndDate: '2026-09-15',
    submittedDaysAgo: 6,
    roleCount: 1,
  },
  {
    firstName: 'Marc',
    lastName: 'Weber',
    age: 41,
    countryOfResidence: 'Austria',
    nationality: 'Austrian',
    locale: 'en',
    motivation: 'Surgeon with humanitarian experience.',
    applicationStatus: 'confirmed',
    preferredStartDate: '2026-06-01',
    preferredEndDate: '2026-09-30',
    confirmedStartDate: '2026-06-05',
    confirmedEndDate: '2026-09-25',
    submittedDaysAgo: 5,
    roleCount: 1,
  },
  {
    firstName: 'Amélie',
    lastName: 'Robin',
    age: 27,
    countryOfResidence: 'France',
    nationality: 'French',
    locale: 'fr',
    motivation: 'Infirmière puéricultrice, grec débutant.',
    applicationStatus: 'not_confirmed',
    preferredStartDate: '2026-06-15',
    preferredEndDate: '2026-10-15',
    submittedDaysAgo: 4,
    roleCount: 1,
  },
  {
    firstName: 'Felix',
    lastName: 'Hoffman',
    age: 33,
    countryOfResidence: 'Germany',
    nationality: 'German',
    locale: 'en',
    motivation: 'Paramedic, available for summer deployment.',
    applicationStatus: 'in_discussion',
    preferredStartDate: '2026-07-01',
    preferredEndDate: '2026-10-31',
    submittedDaysAgo: 3,
    roleCount: 2,
  },
  {
    firstName: 'Élise',
    lastName: 'Bonnet',
    age: 28,
    countryOfResidence: 'France',
    nationality: 'French',
    locale: 'fr',
    motivation: 'Médecin généraliste, expérience en camp de réfugiés.',
    applicationStatus: 'confirmed',
    preferredStartDate: '2026-07-15',
    preferredEndDate: '2026-11-15',
    confirmedStartDate: '2026-07-15',
    confirmedEndDate: '2026-11-15',
    submittedDaysAgo: 2,
    roleCount: 1,
  },
  {
    firstName: 'Raphaël',
    lastName: 'Mercier',
    age: 30,
    countryOfResidence: 'France',
    nationality: 'French',
    locale: 'fr',
    motivation: 'Coordinateur médical, anglais courant.',
    applicationStatus: 'not_confirmed',
    preferredStartDate: '2026-08-01',
    preferredEndDate: '2026-12-31',
    submittedDaysAgo: 1,
    roleCount: 1,
  },
  {
    firstName: 'Victoria',
    lastName: 'Clark',
    age: 29,
    countryOfResidence: 'United Kingdom',
    nationality: 'British',
    locale: 'en',
    motivation: 'Nurse with pediatric specialization.',
    applicationStatus: 'in_discussion',
    preferredStartDate: '2026-08-15',
    preferredEndDate: '2026-12-15',
    submittedDaysAgo: 0,
    roleCount: 1,
  },
]

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

function daysAgoDate(daysAgo: number): string {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  date.setHours(12, 0, 0, 0)
  return date.toISOString()
}

async function loadVolunteerNeedsByProject(payload: Payload) {
  const { docs: needs } = await payload.find({
    collection: 'volunteer-needs',
    limit: 200,
    overrideAccess: true,
    depth: 0,
  })

  const byProject = new Map<string, VolunteerNeedRef[]>()

  for (const need of needs) {
    const projectId = typeof need.project === 'string' ? need.project : need.project?.id
    if (!projectId) continue

    const list = byProject.get(projectId) ?? []
    list.push({ id: need.id, roleName: need.roleName, projectId })
    byProject.set(projectId, list)
  }

  return byProject
}

async function deleteExistingSeedApplications(payload: Payload) {
  const { docs } = await payload.find({
    collection: 'volunteer-applications',
    where: { email: { contains: SEED_EMAIL_PREFIX } },
    limit: 200,
    overrideAccess: true,
  })

  for (const doc of docs) {
    await payload.delete({
      collection: 'volunteer-applications',
      id: doc.id,
      overrideAccess: true,
    })
  }

  return docs.length
}

function pickRoles(
  projectRoles: VolunteerNeedRef[],
  index: number,
  roleCount: 1 | 2,
): VolunteerNeedRef[] {
  if (projectRoles.length === 0) return []
  if (roleCount === 1 || projectRoles.length === 1) {
    return [projectRoles[index % projectRoles.length]]
  }

  const first = projectRoles[index % projectRoles.length]
  const second = projectRoles[(index + 1) % projectRoles.length]
  return first.id === second.id ? [first] : [first, second]
}

export async function seedVolunteerPlanningData() {
  return withPayload(async (payload) => {
    const { docs: projects } = await payload.find({
      collection: 'projects',
      limit: 50,
      overrideAccess: true,
      depth: 0,
    })

    if (projects.length === 0) {
      throw new Error('No projects found in the database. Create at least one project first.')
    }

    const rolesByProject = await loadVolunteerNeedsByProject(payload)
    const projectsWithRoles = projects.filter((project) => (rolesByProject.get(project.id)?.length ?? 0) > 0)

    if (projectsWithRoles.length === 0) {
      throw new Error(
        'No volunteer roles found in the database. Run `pnpm seed:volunteer-greece` or create volunteer needs first.',
      )
    }

    const removed = await deleteExistingSeedApplications(payload)

    let created = 0
    const statusCounts: Record<VolunteerApplicationStatus, number> = {
      confirmed: 0,
      in_discussion: 0,
      not_confirmed: 0,
      canceled: 0,
    }

    for (let index = 0; index < TARGET_COUNT; index += 1) {
      const applicant = applicants[index]
      const project = projectsWithRoles[index % projectsWithRoles.length]
      const projectRoles = rolesByProject.get(project.id) ?? []
      const selectedRoleRefs = pickRoles(projectRoles, index, applicant.roleCount)
      const selectedRoles = selectedRoleRefs.map((role) => role.id)
      const confirmedVolunteerRole =
        applicant.applicationStatus === 'confirmed' ? selectedRoleRefs[0]?.id : undefined
      const submittedAt = daysAgoDate(applicant.submittedDaysAgo)

      await payload.create({
        collection: 'volunteer-applications',
        data: {
          firstName: applicant.firstName,
          lastName: applicant.lastName,
          age: applicant.age,
          email: `${SEED_EMAIL_PREFIX}${String(index + 1).padStart(2, '0')}${SEED_EMAIL_DOMAIN}`,
          countryOfResidence: applicant.countryOfResidence,
          nationality: applicant.nationality,
          phoneCountryCode: '+33',
          phone: `6${String(10000000 + index).slice(-8)}`,
          selectedRoles: selectedRoles.length > 0 ? selectedRoles : undefined,
          motivation: applicant.motivation,
          preferredStartDate: applicant.preferredStartDate,
          preferredEndDate: applicant.preferredEndDate,
          confirmedStartDate: applicant.confirmedStartDate,
          confirmedEndDate: applicant.confirmedEndDate,
          confirmedVolunteerRole,
          applicationStatus: applicant.applicationStatus,
          happyStressfulEnvironment: 'yes',
          goodEnglishLevel: 'yes',
          euSchengenResident: index % 4 === 0 ? 'no' : 'yes',
          howDidYouHearAboutUs: 'Website / seed data',
          project: project.id,
          locale: applicant.locale,
          createdAt: submittedAt,
          updatedAt: submittedAt,
        },
        overrideAccess: true,
      })

      statusCounts[applicant.applicationStatus] += 1
      created += 1
    }

    return {
      removed,
      created,
      statusCounts,
      projects: projectsWithRoles.map((project) => project.slug ?? project.id),
      rolesUsed: [...rolesByProject.values()].reduce((sum, roles) => sum + roles.length, 0),
    }
  })
}

async function main() {
  const result = await seedVolunteerPlanningData()

  console.log(
    `Seed volunteer planning: removed ${result.removed}, created ${result.created} applications.`,
  )
  console.log(
    `Statuses — confirmed: ${result.statusCounts.confirmed}, in discussion: ${result.statusCounts.in_discussion}, not confirmed: ${result.statusCounts.not_confirmed}.`,
  )
  console.log(`Projects used: ${result.projects.join(', ')} (${result.rolesUsed} roles available).`)
}

if (process.argv[1]?.includes('seed-volunteer-planning-data')) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
