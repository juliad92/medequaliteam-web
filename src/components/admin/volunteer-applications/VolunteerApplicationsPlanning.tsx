import React from 'react'
import type { BeforeListServerProps } from 'payload'
import { VolunteerApplicationsPlanningClient } from './VolunteerApplicationsPlanningClient'
import type { PlanningEntry } from '@/lib/volunteer/planning-dates'
import { mapPlanningRole } from '@/lib/volunteer/planning-dates'
import { defaultVolunteerApplicationStatus } from '@/lib/volunteer/application-status'

export async function VolunteerApplicationsPlanning({ payload, user }: BeforeListServerProps) {
  if (!user) {
    return null
  }

  const result = await payload.find({
    collection: 'volunteer-applications',
    limit: 500,
    depth: 1,
    sort: '-createdAt',
    user,
  })

  const entries: PlanningEntry[] = result.docs.map((doc) => ({
    id: doc.id,
    firstName: doc.firstName,
    lastName: doc.lastName,
    email: doc.email,
    applicationStatus: doc.applicationStatus ?? defaultVolunteerApplicationStatus,
    createdAt: doc.createdAt,
    preferredStartDate: doc.preferredStartDate,
    preferredEndDate: doc.preferredEndDate,
    confirmedStartDate: doc.confirmedStartDate,
    confirmedEndDate: doc.confirmedEndDate,
    project: doc.project,
    selectedRoles: doc.selectedRoles?.map(mapPlanningRole) ?? null,
    confirmedVolunteerRole: doc.confirmedVolunteerRole
      ? mapPlanningRole(doc.confirmedVolunteerRole)
      : null,
  }))

  return <VolunteerApplicationsPlanningClient entries={entries} />
}
