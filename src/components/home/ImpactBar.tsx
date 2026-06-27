import React from 'react'
import { getT } from '@/i18n/translations'

type ImpactBarProps = {
  locale: string
  impactStats: {
    value: string
    label: string
  }[]
}

export default function ImpactBar({ locale, impactStats }: ImpactBarProps) {
  const t = getT(locale)

  return (
    <div className="border-t border-white/6 bg-[var(--charcoal)]">
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-x-4 gap-y-8 px-4 py-8 sm:gap-6 sm:px-8 sm:py-10 md:grid-cols-4">
        {impactStats.map((stat, i) => (
          <div key={i} className="text-center">
            <span
              className="mb-2 block font-serif leading-none text-[var(--green-light)]"
              style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 400 }}
            >
              {stat.value}
            </span>
            <span className="text-[11px] tracking-[0.12em] text-white/40 uppercase">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
