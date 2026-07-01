import { getT } from '@/i18n/translations'
import { GIVING_EUROPE_URL, type GivingEuropeCountryCode } from '@/lib/donate/config'

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-1">
      <p className="text-[14px] text-[var(--muted)]">{label}</p>
      <p className="mt-0.5 text-[15px] leading-relaxed text-[var(--charcoal)]">{value}</p>
    </div>
  )
}

function ContactLine({
  name,
  email,
  phone,
}: {
  name?: string
  email: string
  phone: string
}) {
  return (
    <p className="text-[15px] leading-relaxed text-[var(--charcoal)]">
      {name && <span className="font-medium">{name}: </span>}
      <a href={`mailto:${email}`} className="text-[var(--green-dark)] hover:underline">
        {email}
      </a>
      {' · '}
      <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-[var(--green-dark)] hover:underline">
        {phone}
      </a>
    </p>
  )
}

function ProfileLink({ label }: { label: string }) {
  return (
    <a
      href={GIVING_EUROPE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 font-medium text-[var(--green-dark)] hover:underline"
    >
      {label}
      <svg
        className="h-3.5 w-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
      </svg>
    </a>
  )
}

export default function GivingEuropeInstructions({
  country,
  locale,
}: {
  country: GivingEuropeCountryCode
  locale: string
}) {
  const ge = getT(locale).donate.givingEurope

  if (country === 'BE') {
    const content = ge.BE
    return (
      <div className="space-y-4 text-[15px] leading-relaxed text-[var(--charcoal)]">
        <ProfileLink label={ge.profileLink} />
        <ContactLine
          name={content.contact.name}
          email={content.contact.email}
          phone={content.contact.phone}
        />
        <p className="text-[var(--muted)]">{content.bankIntro}</p>
        <div className="rounded-lg border border-[var(--border)] bg-white px-4 py-3">
          <DetailRow label={content.bank.accountHolder} value={content.bank.accountHolderValue} />
          <DetailRow label={content.bank.bank} value={content.bank.bankValue} />
          <DetailRow label={content.bank.address} value={content.bank.addressValue} />
          <DetailRow label={content.bank.accountNumber} value={content.bank.accountNumberValue} />
          <DetailRow label={content.bank.iban} value={content.bank.ibanValue} />
          <DetailRow label={content.bank.bic} value={content.bank.bicValue} />
        </div>
        <p className="text-[var(--muted)]">{content.communicationNote}</p>
        <p className="rounded-lg border border-[var(--green)]/30 bg-[var(--green-pale)] px-3 py-2 font-mono text-[14px] text-[var(--green-dark)]">
          {content.communication}
        </p>
      </div>
    )
  }

  if (country === 'CH') {
    const content = ge.CH
    return (
      <div className="space-y-4 text-[15px] leading-relaxed text-[var(--charcoal)]">
        <p className="text-[var(--muted)]">{content.intro}</p>
        <ContactLine email={content.contact.email} phone={content.contact.phone} />
      </div>
    )
  }

  const content = ge.GB
  return (
    <div className="space-y-4 text-[15px] leading-relaxed text-[var(--charcoal)]">
      <ProfileLink label={ge.profileLink} />
      <p className="text-[var(--muted)]">{content.intro}</p>
      <ContactLine
        name={content.contact.name}
        email={content.contact.email}
        phone={content.contact.phone}
      />
    </div>
  )
}
