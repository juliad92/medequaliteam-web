'use client'

import React, { useRef, useState } from 'react'

import GivingEuropeInstructions from '@/components/donate/GivingEuropeInstructions'
import HelloAssoWidget from '@/components/donate/HelloAssoWidget'
import LocalPlatformPanel from '@/components/donate/LocalPlatformPanel'
import { getT } from '@/i18n/translations'
import {
  DONATE_COUNTRY_CONFIG,
  DONATE_EMAIL,
  DONATE_PRESET_AMOUNTS,
  HELLOASSO_FORM_URL,
  PAYPAL_URL,
  getImpactLabel,
  isGivingEuropeCountry,
  isLocalPlatformCountry,
  offersDualDonationChannel,
  type DonateCountryCode,
  type DonateFrequency,
  type DonationChannel,
} from '@/lib/donate/config'

const COUNTRY_FLAGS: Record<DonateCountryCode, string> = {
  FR: '🇫🇷',
  US: '🇺🇸',
  DE: '🇩🇪',
  BE: '🇧🇪',
  CH: '🇨🇭',
  GB: '🇬🇧',
  OTHER: '🌍',
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-medium tracking-[0.1em] text-[var(--muted)] uppercase">
      {children}
    </p>
  )
}

function TaxBanner({ message }: { message: string }) {
  return (
    <div
      className="mb-6 flex gap-2.5 rounded-lg border border-[var(--green)]/30 bg-[var(--green-pale)] px-4 py-3 text-[13px] leading-relaxed text-[var(--green-dark)]"
      role="status"
    >
      <svg
        className="mt-0.5 h-4 w-4 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M9 14l2 2 4-4" />
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>{message}</p>
    </div>
  )
}

function formatTaxMessage(
  template: string,
  symbol: string,
  selectedAmount: number,
  deductionRate: number,
): string {
  const net = selectedAmount - Math.round(selectedAmount * deductionRate)
  return template.replace('{net}', `${symbol}${net}`)
}

function getLocalChannelCopy(
  country: DonateCountryCode,
  d: ReturnType<typeof getT>['donate'],
): { label: string; hint: string } {
  const alt = DONATE_COUNTRY_CONFIG[country].dualChannelAlt
  if (alt === 'givingEurope') return d.donationChannel.givingEurope
  return {
    label: DONATE_COUNTRY_CONFIG[country].platform,
    hint: d.donationChannel.localHint,
  }
}

export default function DonationForm({ locale }: { locale: string }) {
  const t = getT(locale)
  const d = t.donate

  const [country, setCountry] = useState<DonateCountryCode | ''>(locale === 'fr' ? 'FR' : '')
  const [frequency, setFrequency] = useState<DonateFrequency>('once')
  const [selectedAmount, setSelectedAmount] = useState(50)
  const [customMode, setCustomMode] = useState(false)
  const [customValue, setCustomValue] = useState('')
  const [donationChannel, setDonationChannel] = useState<DonationChannel>('local')

  const paymentMethodsRef = useRef<HTMLDivElement>(null)

  const config = country ? DONATE_COUNTRY_CONFIG[country] : null
  const showDualChannel = Boolean(country && offersDualDonationChannel(country))
  const showHelloAsso =
    country === 'FR' ||
    country === 'OTHER' ||
    (showDualChannel && donationChannel === 'helloasso')
  const showGivingEuropePanel = Boolean(
    country &&
      showDualChannel &&
      donationChannel === 'local' &&
      config?.dualChannelAlt === 'givingEurope' &&
      isGivingEuropeCountry(country),
  )
  const showLocalPlatformPanel = Boolean(
    country &&
      showDualChannel &&
      donationChannel === 'local' &&
      config?.dualChannelAlt === 'platform' &&
      config.url &&
      isLocalPlatformCountry(country),
  )

  const symbol = config?.symbol ?? '€'
  const deductionRate = config?.deductionRate ?? 0
  const isDeductible = Boolean(config && deductionRate > 0)
  const deduction = Math.round(selectedAmount * deductionRate)
  const netCost = selectedAmount - deduction

  const freqSuffix =
    frequency === 'monthly' ? d.freqMonthly : frequency === 'yearly' ? d.freqYearly : ''

  const buttonLabel = country
    ? d.donateAmount.replace('{amount}', `${symbol}${selectedAmount}`).replace('{freq}', freqSuffix)
    : d.donateNow

  const taxMessage =
    country && d.tax[country as keyof typeof d.tax]
      ? formatTaxMessage(
          d.tax[country as keyof typeof d.tax],
          symbol,
          selectedAmount,
          deductionRate,
        )
      : ''

  const helloAssoNote = country === 'FR' ? d.helloAssoNote : d.helloAssoNoteInternational

  function selectAmount(amount: number) {
    setSelectedAmount(amount)
    setCustomMode(false)
    setCustomValue('')
  }

  function handleCustomInput(value: string) {
    setCustomValue(value)
    const parsed = parseFloat(value)
    if (parsed > 0) {
      setSelectedAmount(parsed)
      setCustomMode(true)
    }
  }

  function handleDonate() {
    if (!country || !config) return

    if (showDualChannel) {
      paymentMethodsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    if (config.url) {
      window.open(config.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 pt-6 pb-10 sm:px-6 sm:pt-8 sm:pb-14">
      <header className="mb-8 border-b border-[var(--border)] pb-8 text-center">
        <p className="mb-3 text-[11px] font-medium tracking-[0.12em] text-[var(--muted)] uppercase">
          {d.eyebrow}
        </p>
        <h1 className="mb-3 font-serif text-[28px] leading-tight font-normal text-[var(--charcoal)]">
          {d.title}
        </h1>
        <p className="mx-auto max-w-md text-[14px] leading-relaxed text-[var(--muted)]">
          {d.subtitle}
        </p>
      </header>

      <div className="mb-8 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--border)]">
        {(['consultation', 'medicine', 'kit'] as const).map((key) => (
          <div key={key} className="bg-white px-3 py-4 text-center">
            <p className="font-serif text-[20px] text-[var(--charcoal)]">{d.impact[key].value}</p>
            <p className="mt-1 text-[11px] leading-snug text-[var(--muted)]">{d.impact[key].label}</p>
          </div>
        ))}
      </div>

      <SectionLabel>{d.countryLabel}</SectionLabel>
      <div className="relative mb-6">
        <select
          value={country}
          onChange={(e) => {
            const nextCountry = e.target.value as DonateCountryCode | ''
            setCountry(nextCountry)
            if (nextCountry && offersDualDonationChannel(nextCountry)) {
              setDonationChannel('local')
            }
          }}
          className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-[var(--border)] bg-white px-4 pr-10 text-[14px] text-[var(--charcoal)] outline-none focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/20"
          aria-label={d.countryLabel}
        >
          <option value="">{d.countryPlaceholder}</option>
          {(Object.keys(DONATE_COUNTRY_CONFIG) as DonateCountryCode[]).map((code) => (
            <option key={code} value={code}>
              {COUNTRY_FLAGS[code]} {d.countries[code]}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[var(--muted)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {country && config && (
        <TaxBanner message={taxMessage} />
      )}

      {showDualChannel && (
        <p className="mb-4 text-center text-[11px] text-[var(--muted)]">{d.dualChannelNote}</p>
      )}

      <div ref={paymentMethodsRef}>
        {showDualChannel && country && (
          <>
            <SectionLabel>{d.donationChannelLabel}</SectionLabel>
            <div className="mb-6 grid grid-cols-2 gap-1.5">
              {(['helloasso', 'local'] as const).map((channel) => {
                const active = donationChannel === channel
                const copy =
                  channel === 'helloasso'
                    ? d.donationChannel.helloasso
                    : getLocalChannelCopy(country, d)
                return (
                  <button
                    key={channel}
                    type="button"
                    onClick={() => setDonationChannel(channel)}
                    className={`rounded-lg border px-2 py-2.5 text-center transition-colors ${
                      active
                        ? 'border-[var(--green)] bg-[var(--green-pale)] font-medium text-[var(--green-dark)]'
                        : 'border-[var(--border)] bg-white text-[var(--muted)] hover:border-[var(--green)]/40'
                    }`}
                  >
                    <span className={`block text-[13px] ${active ? 'font-medium' : ''}`}>
                      {copy.label}
                    </span>
                    <span
                      className={`mt-0.5 block text-[11px] ${
                        active ? 'text-[var(--green-dark)]/80' : 'text-[var(--muted)]'
                      }`}
                    >
                      {copy.hint}
                    </span>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {showHelloAsso && (
          <section
            className="mb-8 overflow-hidden rounded-xl border border-[var(--border)] bg-white"
            aria-label={d.helloAssoTitle}
          >
            <div className="border-b border-[var(--border)] bg-[var(--cream)] px-4 py-4">
              <p className="text-[11px] font-medium tracking-[0.1em] text-[var(--muted)] uppercase">
                {d.helloAssoTitle}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-[var(--charcoal)]">
                {helloAssoNote}
              </p>
            </div>
            <HelloAssoWidget formUrl={HELLOASSO_FORM_URL} />
          </section>
        )}

        {showGivingEuropePanel && country && isGivingEuropeCountry(country) && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--cream)] p-6">
            <p className="text-[11px] font-medium tracking-[0.1em] text-[var(--green)] uppercase">
              {d.givingEurope.title}
            </p>
            <div className="mt-4">
              <GivingEuropeInstructions country={country} locale={locale} />
            </div>
          </div>
        )}

        {showLocalPlatformPanel && country && isLocalPlatformCountry(country) && config?.url && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--cream)] p-6">
            <p className="text-[11px] font-medium tracking-[0.1em] text-[var(--green)] uppercase">
              {config.platform}
            </p>
            <div className="mt-4">
              <LocalPlatformPanel
                country={country}
                locale={locale}
                platform={config.platform}
                url={config.url}
              />
            </div>
          </div>
        )}
      </div>

      {!country && (
        <>
      <SectionLabel>{d.frequencyLabel}</SectionLabel>
      <div className="mb-6 grid grid-cols-3 gap-1.5">
        {(['once', 'monthly', 'yearly'] as const).map((freq) => (
          <button
            key={freq}
            type="button"
            onClick={() => setFrequency(freq)}
            className={`rounded-lg border px-2 py-2 text-[13px] transition-colors ${
              frequency === freq
                ? 'border-[var(--green)] bg-[var(--green-pale)] font-medium text-[var(--green-dark)]'
                : 'border-[var(--border)] bg-white text-[var(--muted)] hover:border-[var(--green)]/40'
            }`}
          >
            {d.frequency[freq]}
          </button>
        ))}
      </div>

      <SectionLabel>{d.amountLabel}</SectionLabel>
      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {DONATE_PRESET_AMOUNTS.map((amount) => {
          const active = !customMode && selectedAmount === amount
          return (
            <button
              key={amount}
              type="button"
              onClick={() => selectAmount(amount)}
              className={`rounded-lg border px-2 py-2.5 text-center text-[14px] font-medium transition-colors ${
                active
                  ? 'border-[var(--green)] bg-[var(--green-pale)] text-[var(--green-dark)]'
                  : 'border-[var(--border)] bg-white text-[var(--charcoal)] hover:border-[var(--green)]/40'
              }`}
            >
              {symbol}
              {amount}
              <span
                className={`mt-0.5 block text-[11px] font-normal ${
                  active ? 'text-[var(--green-dark)]/80' : 'text-[var(--muted)]'
                }`}
              >
                {getImpactLabel(amount, locale)}
              </span>
            </button>
          )
        })}
      </div>

      <div className="relative mb-6">
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[14px] text-[var(--muted)]">
          {symbol.trim()}
        </span>
        <input
          type="number"
          min={1}
          value={customValue}
          onChange={(e) => handleCustomInput(e.target.value)}
          placeholder={d.customPlaceholder}
          className="h-11 w-full rounded-lg border border-[var(--border)] bg-white py-0 pr-4 pl-7 text-[14px] text-[var(--charcoal)] outline-none focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/20"
          aria-label={d.customPlaceholder}
        />
      </div>

      {isDeductible && (
        <div className="mb-6 rounded-lg bg-[var(--cream)] px-4 py-3 text-[13px]">
          <div className="flex items-center justify-between py-1">
            <span className="text-[var(--muted)]">{d.netCost.donation}</span>
            <span className="text-[var(--muted)]">
              {symbol}
              {selectedAmount}
            </span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-[var(--muted)]">
              {d.netCost.deduction} (~{Math.round(deductionRate * 100)}%)
            </span>
            <span className="text-[var(--green-dark)]">
              −{symbol}
              {deduction}
            </span>
          </div>
          <hr className="my-1.5 border-[var(--border)]" />
          <div className="flex items-center justify-between py-1">
            <span className="font-medium text-[var(--charcoal)]">{d.netCost.actual}</span>
            <span className="text-[16px] font-medium text-[var(--green-dark)]">
              {symbol}
              {netCost}
            </span>
          </div>
        </div>
      )}

      <span
        className={`mb-2 block w-full ${!country ? 'cursor-not-allowed' : ''}`}
        title={!country ? d.selectCountryTooltip : undefined}
      >
        <button
          type="button"
          onClick={handleDonate}
          disabled={!country}
          aria-describedby={!country ? 'donate-country-hint' : undefined}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--green)] text-[15px] font-medium text-white transition-colors hover:bg-[var(--green-dark)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[var(--border)] disabled:text-[var(--muted)] disabled:hover:bg-[var(--border)]"
        >
          <svg
            className="h-[18px] w-[18px]"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          {buttonLabel}
        </button>
        {!country && (
          <span id="donate-country-hint" className="sr-only">
            {d.selectCountryTooltip}
          </span>
        )}
      </span>
        </>
      )}

      <div className="mt-8">
        <p className="mb-3 text-center text-[11px] font-medium tracking-[0.08em] text-[var(--muted)] uppercase">
          {d.otherWays}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <a
            href={PAYPAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 transition-colors hover:border-[var(--green)]/40"
          >
            <svg
              className="h-[18px] w-[18px] text-[var(--muted)]"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944 3.72A.77.77 0 015.7 3h6.52c2.17 0 3.68.55 4.49 1.64.76 1.02.87 2.45.32 4.25-.02.07-.05.14-.08.21l-.01.03c-.96 3.12-2.87 4.7-5.68 4.7H9.28l-.77 4.86a.64.64 0 01-.633.54z" />
            </svg>
            <div>
              <p className="text-[12px] font-medium text-[var(--charcoal)]">{d.paypal}</p>
              <p className="text-[11px] text-[var(--muted)]">{d.paypalNote}</p>
            </div>
          </a>
          <a
            href={`mailto:${DONATE_EMAIL}`}
            className="flex items-center gap-2.5 rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 transition-colors hover:border-[var(--green)]/40"
          >
            <svg
              className="h-[18px] w-[18px] text-[var(--muted)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <rect x="2" y="6" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
            </svg>
            <div>
              <p className="text-[12px] font-medium text-[var(--charcoal)]">{d.bankTransfer}</p>
              <p className="text-[11px] text-[var(--muted)]">{d.bankNote}</p>
            </div>
          </a>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2">
        {(['charity', 'secure', 'operations'] as const).map((key) => (
          <span
            key={key}
            className="flex items-center gap-1.5 text-[11px] text-[var(--muted)]"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              {key === 'charity' && <path d="M9 14l2 2 4-4M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />}
              {key === 'secure' && (
                <>
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </>
              )}
              {key === 'operations' && (
                <>
                  <path d="M21.21 15.89A10 10 0 118 2.83" />
                  <path d="M22 12A10 10 0 0012 2v10z" />
                </>
              )}
            </svg>
            {d.trust[key]}
          </span>
        ))}
      </div>
    </div>
  )
}
