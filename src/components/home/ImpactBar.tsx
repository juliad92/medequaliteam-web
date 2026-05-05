import React from 'react'
import { getT } from '@/i18n/translations'

export default function ImpactBar({ locale, impactStats }: { locale: string; impactStats: any }) {
  const t = getT(locale)

  return (
    <div className="border-t border-white/6 bg-[var(--charcoal)]">
      <div className="mx-auto grid max-w-4xl grid-cols-4 gap-6 px-8 py-10">
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
