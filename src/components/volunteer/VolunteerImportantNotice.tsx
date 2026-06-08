import React from 'react'

export default function VolunteerImportantNotice({ locale }: { locale: string }) {
  const fr = locale === 'fr'

  const copy = fr
    ? {
        title: 'À lire avant de postuler',
        visa: 'Nous ne pouvons pas fournir de lettres d’invitation pour obtenir un visa d’entrée dans l’Union européenne.',
        accommodation:
          'Lorsque c’est possible, nous proposons un hébergement en colocation ; en période chargée, vous devrez peut-être trouver votre propre logement sur place.',
      }
    : {
        title: 'Please read before applying',
        visa: 'We cannot provide invitation letters to obtain a visa to enter the European Union.',
        accommodation:
          'Whenever possible we offer accommodation in shared flats; during busy times you may need to find your own accommodation on site.',
      }

  return (
    <div
      role="note"
      className="mb-8 rounded-2xl border border-amber-200/80 bg-amber-50 px-6 py-5"
    >
      <p className="text-[11px] font-medium tracking-[0.14em] text-amber-800 uppercase">
        {copy.title}
      </p>
      <ul className="mt-3 space-y-2">
        <li className="flex gap-3 text-[14px] leading-relaxed text-amber-950/85">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-600" aria-hidden="true" />
          <span>{copy.visa}</span>
        </li>
        <li className="flex gap-3 text-[14px] leading-relaxed text-amber-950/85">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-600" aria-hidden="true" />
          <span>{copy.accommodation}</span>
        </li>
      </ul>
    </div>
  )
}
