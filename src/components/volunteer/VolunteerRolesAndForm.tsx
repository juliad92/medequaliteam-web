'use client'

import React, { useCallback, useRef, useState } from 'react'

import VolunteerNeedsAccordion from '@/components/volunteer/VolunteerNeedsAccordion'
import VolunteerImportantNotice from '@/components/volunteer/VolunteerImportantNotice'
import VolunteerApplicationForm from '@/components/volunteer/VolunteerApplicationForm'

type AvailableRole = { id: string; roleName: string }

type VolunteerNeed = {
  id: string
  roleName: string
  duration?: string | null
  jobDescription?: unknown
  requiredExperienceAndSkills?: unknown
  desiredExperienceAndSkills?: unknown
  furtherInformation?: unknown
}

export default function VolunteerRolesAndForm({
  needs,
  locale,
  projectId,
  projectLocation,
  availableRoles,
  afterTimeline,
}: {
  needs: VolunteerNeed[]
  locale: string
  projectId: string
  projectLocation?: string
  availableRoles: AvailableRole[]
  afterTimeline: React.ReactNode
}) {
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([])
  const formAnchorRef = useRef<HTMLDivElement>(null)

  const applyForRole = useCallback((roleId: string) => {
    setSelectedRoleIds((prev) => (prev.includes(roleId) ? prev : [...prev, roleId]))
    formAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <>
      <section id="volunteer-roles" className="scroll-mt-36">
        <VolunteerNeedsAccordion
          needs={needs}
          locale={locale}
          projectLocation={projectLocation}
          onApplyForRole={applyForRole}
        />
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div id="volunteer-process" className="scroll-mt-36">
          {afterTimeline}
        </div>

        <div ref={formAnchorRef} id="volunteer-application" className="scroll-mt-28">
          <VolunteerImportantNotice locale={locale} />
          <VolunteerApplicationForm
            locale={locale}
            projectId={projectId}
            availableRoles={availableRoles}
            selectedRoleIds={selectedRoleIds}
            onSelectedRoleIdsChange={setSelectedRoleIds}
          />
        </div>
      </section>
    </>
  )
}
