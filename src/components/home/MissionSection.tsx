import React from 'react'
import { getT } from '@/i18n/translations'

export default function MissionSection({ locale }: { locale: string }) {
  const t = getT(locale)
  const pillars = [
    { icon: '🏥', title: t.mission.pillar1Title, desc: t.mission.pillar1Desc },
    { icon: '🌍', title: t.mission.pillar2Title, desc: t.mission.pillar2Desc },
    { icon: '🤝', title: t.mission.pillar3Title, desc: t.mission.pillar3Desc },
  ]
  return (
    <section className="bg-[var(--warm-white)] px-4 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative mx-auto h-[300px] w-full max-w-lg sm:h-[380px] lg:mx-0 lg:h-[460px] lg:max-w-none">
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #c8d9c8, #9ab89a)' }}
          >
            <div className="flex h-full w-full items-end p-6">
              <p className="text-sm text-white/60 italic">{t.mission.photoCaption}</p>
            </div>
          </div>
          <div className="absolute right-2 bottom-6 w-36 rounded-xl border-4 border-white bg-[var(--green-pale)] p-4 shadow-lg sm:-right-5 sm:bottom-8 sm:w-44 sm:p-5">
            <p className="font-serif text-[13px] leading-snug text-[var(--green-dark)] italic">
              &ldquo;{t.mission.quote}&rdquo;
            </p>
          </div>
          <div className="absolute top-6 left-2 rounded-xl bg-[var(--green)] p-3 text-center text-white shadow-lg sm:top-8 sm:-left-4 sm:p-4">
            <span className="block font-serif text-3xl leading-none">7+</span>
            <span className="text-[11px] tracking-wider uppercase opacity-80">
              {t.mission.years}
            </span>
          </div>
        </div>
        <div>
          <p className="mb-4 text-[11px] font-medium tracking-[0.15em] text-[var(--green)] uppercase">
            {t.mission.eyebrow}
          </p>
          <h2
            className="mb-5 font-serif leading-tight text-[var(--charcoal)]"
            style={{ fontSize: 'clamp(30px, 3.5vw, 44px)', fontWeight: 300 }}
          >
            {t.mission.title}
          </h2>
          <p className="mb-10 max-w-md text-base leading-relaxed text-[var(--muted)]">
            {t.mission.body}
          </p>
          <div className="flex flex-col gap-3">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="flex items-start gap-4 rounded-xl border border-[var(--border)] bg-white p-4"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--green-pale)] text-base">
                  {p.icon}
                </div>
                <div>
                  <p className="mb-0.5 text-sm font-medium text-[var(--charcoal)]">{p.title}</p>
                  <p className="text-[13px] leading-snug text-[var(--muted)]">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
