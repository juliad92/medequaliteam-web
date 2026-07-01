'use client'

import React, { useMemo, useState } from 'react'
import LexicalRenderer from '@/components/richtext/LexicalRenderer'

type VolunteerNeed = {
  id: string
  roleName: string
  duration?: string | null
  jobDescription?: unknown
  requiredExperienceAndSkills?: unknown
  desiredExperienceAndSkills?: unknown
  furtherInformation?: unknown
}

export default function VolunteerNeedsAccordion({
  needs,
  locale,
  projectLocation,
  onApplyForRole,
}: {
  needs: VolunteerNeed[]
  locale: string
  projectLocation?: string
  onApplyForRole?: (roleId: string) => void
}) {
  const [openId, setOpenId] = useState<string | null>(needs?.[0]?.id ?? null)

  const byId = useMemo(() => new Map(needs.map((n) => [n.id, n])), [needs])
  const openNeed = openId ? byId.get(openId) : undefined

  const locationLabel = projectLocation || (locale === 'fr' ? 'ce projet' : 'this project')

  const strings =
    locale === 'fr'
      ? {
          eyebrow: 'Besoins bénévoles',
          title: `Rôles ouverts — ${locationLabel}`,
          hint: 'Cliquez sur un rôle pour afficher les détails.',
          roleDetails: 'Détails du rôle',
          duration: 'Durée',
          jobDescription: 'Description du poste',
          required: 'Expérience et compétences requises',
          desired: 'Expérience et compétences souhaitées',
          further: 'Informations complémentaires',
          emptyTitle: 'Sélectionnez un rôle',
          emptyBody:
            "Nous sommes aussi preneurs de candidatures avec des compétences complémentaires.",
          applyForRole: 'Postuler pour ce rôle',
        }
      : {
          eyebrow: 'Volunteer needs',
          title: `Open roles — ${locationLabel}`,
          hint: 'Click a role to see details.',
          roleDetails: 'Role details',
          duration: 'Duration',
          jobDescription: 'Job description',
          required: 'Required experience and skills',
          desired: 'Desired experience and skills',
          further: 'Further information',
          emptyTitle: 'Select a role to see details',
          emptyBody: 'We also welcome applications from candidates with complementary skills.',
          applyForRole: 'Apply for this role',
        }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
        <div className="border-b border-[var(--border)] bg-[var(--cream)] px-6 py-5">
          <p className="text-[13px] font-medium tracking-[0.14em] text-[var(--green)] uppercase">
            {strings.eyebrow}
          </p>
          <h2 className="mt-2 font-serif text-2xl font-normal text-[var(--charcoal)]">
            {strings.title}
          </h2>
          <p className="mt-2 text-[16px] leading-relaxed text-[var(--muted)]">
            {strings.hint}
          </p>
        </div>

        <ul className="divide-y divide-[var(--border)]">
          {needs.map((need) => {
            const isOpen = need.id === openId
            return (
              <li key={need.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : need.id)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-[var(--green-pale)]"
                  aria-expanded={isOpen}
                >
                  <div>
                    <p className="text-base font-medium text-[var(--charcoal)]">{need.roleName}</p>
                    {need.duration ? (
                      <p className="mt-1 text-[15px] text-[var(--muted)]">
                        {strings.duration}: {need.duration}
                      </p>
                    ) : null}
                  </div>
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)]"
                    aria-hidden="true"
                  >
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
        {openNeed ? (
          <>
            <div className="mb-5">
              <p className="text-[13px] font-medium tracking-[0.14em] text-[var(--green)] uppercase">
                {strings.roleDetails}
              </p>
              <h3 className="mt-2 font-serif text-2xl font-normal text-[var(--charcoal)]">
                {openNeed.roleName}
              </h3>
              {openNeed.duration ? (
                <p className="mt-1 text-[15px] text-[var(--muted)]">
                  {strings.duration}: {openNeed.duration}
                </p>
              ) : null}
            </div>

            <div className="space-y-6">
              <section>
                <h4 className="mb-2 text-[14px] font-medium tracking-[0.12em] text-[var(--muted)] uppercase">
                  {strings.jobDescription}
                </h4>
                <LexicalRenderer content={openNeed.jobDescription} />
              </section>

              <section>
                <h4 className="mb-2 text-[14px] font-medium tracking-[0.12em] text-[var(--muted)] uppercase">
                  {strings.required}
                </h4>
                <LexicalRenderer content={openNeed.requiredExperienceAndSkills} />
              </section>

              {openNeed.desiredExperienceAndSkills ? (
                <section>
                  <h4 className="mb-2 text-[14px] font-medium tracking-[0.12em] text-[var(--muted)] uppercase">
                    {strings.desired}
                  </h4>
                  <LexicalRenderer content={openNeed.desiredExperienceAndSkills} />
                </section>
              ) : null}

              {openNeed.furtherInformation ? (
                <section>
                  <h4 className="mb-2 text-[14px] font-medium tracking-[0.12em] text-[var(--muted)] uppercase">
                    {strings.further}
                  </h4>
                  <LexicalRenderer content={openNeed.furtherInformation} />
                </section>
              ) : null}

              {onApplyForRole ? (
                <button
                  type="button"
                  onClick={() => onApplyForRole(openNeed.id)}
                  className="mt-2 inline-flex h-11 items-center justify-center rounded-lg bg-[var(--green)] px-6 text-base font-medium text-white transition-colors hover:bg-[var(--green-dark)]"
                >
                  {strings.applyForRole}
                </button>
              ) : null}
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center rounded-xl bg-[var(--cream)] p-10 text-center">
            <p className="text-base font-medium text-[var(--charcoal)]">{strings.emptyTitle}</p>
            <p className="mt-2 text-[16px] leading-relaxed text-[var(--muted)]">
              {strings.emptyBody}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

