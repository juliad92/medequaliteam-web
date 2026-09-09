import React from 'react'
import type { Homepage } from '@/payload/payload-types'

type ImpactBarProps = {
  locale: string
  impactStats?: Homepage['impactStats']
}

export default function ImpactBar({ locale: _locale, impactStats }: ImpactBarProps) {
  const stats = impactStats ?? []

  return (
    <div className="border-t border-white/6 bg-[var(--charcoal)]">
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-x-4 gap-y-8 px-4 py-8 sm:gap-6 sm:px-8 sm:py-10 md:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={stat.id ?? i} className="text-center">
            <span
              className="mb-2 block font-serif leading-none text-[var(--green)]"
              style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 400 }}
            >
              {stat.value}
            </span>
            <span className="text-[13px] tracking-[0.12em] text-white/40 uppercase">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
