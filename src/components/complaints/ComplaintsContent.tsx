import React from 'react'
import Link from 'next/link'

import ComplaintForm from '@/components/complaints/ComplaintForm'
import { getT } from '@/i18n/translations'

function ContentSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 font-serif text-[20px] font-normal text-[var(--charcoal)]">{title}</h2>
      {children}
    </section>
  )
}

export default function ComplaintsContent({ locale }: { locale: string }) {
  const c = getT(locale).complaints

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pt-6 pb-10 sm:px-6 sm:pt-8 sm:pb-14">
      <header className="mb-8 border-b border-[var(--border)] pb-8">
        <h1 className="mb-4 font-serif text-[28px] leading-tight font-normal text-[var(--charcoal)]">
          {c.title}
        </h1>
        <p className="text-[15px] leading-relaxed text-[var(--muted)]">{c.intro}</p>
      </header>

      <ContentSection title={c.waysTitle}>
        <p className="mb-3 text-[15px] leading-relaxed text-[var(--muted)]">{c.waysIntro}</p>
        <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-[var(--muted)]">
          {c.waysBullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection title={c.expectTitle}>
        <p className="mb-4 text-[15px] leading-relaxed text-[var(--muted)]">{c.expectIntro}</p>
        <ul className="space-y-4">
          {c.expectSteps.map((step) => (
            <li key={step.title} className="text-[15px] leading-relaxed text-[var(--muted)]">
              <span className="font-medium text-[var(--charcoal)]">{step.title}</span>
              {' — '}
              {step.body}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">{c.expectNote}</p>
      </ContentSection>

      <ContentSection title={c.anonymityTitle}>
        <p className="mb-3 text-[15px] leading-relaxed text-[var(--muted)]">{c.anonymityBody}</p>
        <p className="text-[15px] leading-relaxed text-[var(--muted)]">
          {c.anonymityPrivacy.split('{privacyPolicy}')[0]}
          <Link
            href={`/${locale}/data-protection`}
            className="text-[var(--green-dark)] underline underline-offset-2 hover:text-[var(--green)]"
          >
            {c.privacyPolicyLabel}
          </Link>
          {c.anonymityPrivacy.split('{privacyPolicy}')[1]}
        </p>
      </ContentSection>

      <ContentSection title={c.reportTitle}>
        <p className="mb-3 text-[15px] leading-relaxed text-[var(--muted)]">{c.reportIntro}</p>
        <p className="mb-2 text-[15px] leading-relaxed text-[var(--muted)]">
          {c.reportExamplesIntro}
        </p>
        <ul className="mb-4 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-[var(--muted)]">
          {c.reportExamples.map((example, index) => {
            if (index !== 3) {
              return <li key={example}>{example}</li>
            }

            return (
              <li key={example}>
                {example} (
                <span className="italic">{c.safeguardingPolicyLabel}</span> {c.safeguardingPolicySuffix}
                )
              </li>
            )
          })}
        </ul>
        <p className="mb-3 text-[15px] leading-relaxed text-[var(--muted)]">{c.reportDisclaimer}</p>
        <p className="text-[15px] leading-relaxed text-[var(--muted)]">{c.coordinationNote}</p>
      </ContentSection>

      <ComplaintForm locale={locale} />
    </div>
  )
}
