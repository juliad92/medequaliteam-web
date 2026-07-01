import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import VolunteerPageNav from '@/components/volunteer/VolunteerPageNav'
import VolunteerRolesAndForm from '@/components/volunteer/VolunteerRolesAndForm'
import { getVolunteerNeedsForProject } from '@/lib/volunteer'

export const dynamic = 'force-dynamic'

function getCopy(locale: string, project: { title: string; location: string }) {
  const place = project.location || project.title

  if (locale === 'fr') {
    return {
      title: `Bénévolat — ${project.title}`,
      subtitle: `Rejoignez notre projet à ${place}`,
      intro: [
        `Vous trouverez ci-dessous une description des différents rôles de nos bénévoles afin de mieux comprendre ce que vous pourriez faire en rejoignant le projet à ${place}.`,
        "Si vous avez d'autres compétences et idées, ou si vous souhaitez combiner des rôles, nous serons ravis d'en discuter. Pour toute question, écrivez à volunteer@medequali.team et notre Volunteer Coordinator reviendra vers vous dans les prochains jours.",
        "Quand vous êtes prêt·e à postuler, utilisez le formulaire plus bas et nous vous répondrons dès que possible. Notez que nous ne pouvons pas fournir de lettres d'invitation pour obtenir un visa afin d'entrer dans l'Union Européenne. Lorsque cela est possible, nous proposons un hébergement en colocation ; toutefois, lors des périodes chargées, vous devrez peut-être trouver votre propre logement sur place.",
      ],
      whyTitle: 'Pourquoi postuler ?',
      why: [
        'Rejoindre une équipe internationale de personnes très motivées',
        'Travailler dans une ONG très adaptative, au plus près des besoins médicaux des personnes déplacées',
        'Contribuer à améliorer la vie des populations déplacées',
        'Un engagement très enrichissant et porteur de sens',
        'Évoluer dans un environnement multilingue',
      ],
      afterTitle: 'Après l’envoi de votre candidature',
      after: [
        'Après soumission, nous vous contacterons pour discuter de votre profil et de vos disponibilités',
        "Si vos dates et votre profil correspondent, vous recevrez une présentation plus détaillée de l'expérience sur le terrain",
        'Nous organiserons un appel téléphonique pour répondre aux questions et échanger sur votre parcours',
        "Si tout est aligné des deux côtés, nous confirmerons votre venue. Nous demanderons certains documents (notamment un extrait de casier judiciaire de moins de 6 mois et une copie de votre pièce d'identité) et nous vous enverrons notre Volunteer Guide",
        'Avant de réserver vos transports, assurez-vous que vos dates correspondent à notre planning',
      ],
      contact: 'Questions ? Écrivez à',
    }
  }

  return {
    title: `Volunteer — ${project.title}`,
    subtitle: `Join our project in ${place}`,
    intro: [
      `Below you can find a description of the different roles of our volunteers to give you a better idea of what you could be doing by joining the project in ${place}.`,
      'If you have other skills and ideas, or you would like to combine roles, we would also be delighted to hear from you. If you have additional questions, please message to volunteer@medequali.team and our Volunteer Coordinator will come back to you in the next days.',
      "When you feel ready to apply as a volunteer, please use our application form below, and we'll get back to you as soon as possible. Please note that we cannot provide invitation letters to obtain a visa if you need one to enter the European Union. Whenever possible we offer accommodation in shared flats, however, during busy times you may have to find your own accommodation on site.",
    ],
    whyTitle: 'Why apply with us?',
    why: [
      'Join an international team of very interesting and highly motivated people',
      'Work in a highly adaptive NGO context to meet the medical needs of displaced people',
      'Contribute to improving the lives of displaced population',
      'A highly rewarding and meaningful job',
      'Work in a multilingual environment',
    ],
    afterTitle: 'What happens after submitting your application',
    after: [
      'After submitting your application, we will get in touch with you to discuss your specifics',
      'If your preferred dates and profile fit, you will receive a more detailed presentation of what it is like to work with us',
      'We will organize a phone call with you to discuss any remaining questions as well as your professional background',
      'If everything feels good on both sides, we will confirm your stay. We will ask for some documents (notably a criminal background check less than 6 months old and copy of your ID), and will send you our Volunteer Guide',
      'Before booking your travels, make sure your dates fit our schedule',
    ],
    contact: 'Questions? Email',
  }
}

export default async function VolunteerProjectPage({
  params,
}: {
  params: Promise<{ locale: string; projectSlug: string }>
}) {
  const { locale, projectSlug } = await params
  const payload = await getPayload({ config })

  const { docs: projects } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: projectSlug } },
    locale: locale as 'en' | 'fr',
    fallbackLocale: 'en',
    limit: 1,
  })

  const project = projects[0]
  if (!project) notFound()

  const needs = await getVolunteerNeedsForProject(
    payload,
    project.id,
    locale as 'en' | 'fr',
  )

  if (needs.length === 0) notFound()

  const copy = getCopy(locale, { title: project.title, location: project.location })

  return (
    <>
      <header className="relative overflow-hidden bg-[var(--charcoal)] px-8 pt-24 pb-16">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #1a2e20 0%, #0f1f14 45%, #1c2818 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 15% 40%, rgba(61,140,79,0.18) 0%, transparent 55%), radial-gradient(circle at 85% 25%, rgba(61,140,79,0.08) 0%, transparent 40%)',
          }}
        />
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-4 flex items-center gap-3 text-[13px] font-medium tracking-[0.16em] text-[var(--green-light)] uppercase">
            <span className="h-px w-8 bg-[var(--green-light)]" />
            {copy.subtitle}
          </p>
          <h1
            className="font-serif leading-[1.05] text-white"
            style={{ fontSize: 'clamp(40px, 5.5vw, 64px)', fontWeight: 300 }}
          >
            {copy.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-white/55">
            {copy.contact}{' '}
            <a
              className="text-white underline decoration-white/30 underline-offset-4"
              href="mailto:volunteer@medequali.team"
            >
              volunteer@medequali.team
            </a>
          </p>
        </div>
      </header>

      <VolunteerPageNav locale={locale} />

      <main className="bg-white px-8 py-20">
        <div className="mx-auto max-w-7xl space-y-16">
          <section
            id="volunteer-overview"
            className="scroll-mt-36 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]"
          >
            <div>
              {copy.intro.map((p) => (
                <p key={p} className="mb-4 text-[16px] leading-relaxed text-[var(--muted)]">
                  {p}
                </p>
              ))}
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--cream)] p-7">
              <p className="text-[13px] font-medium tracking-[0.14em] text-[var(--green)] uppercase">
                {copy.whyTitle}
              </p>
              <ul className="mt-4 space-y-3">
                {copy.why.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-[15px] leading-relaxed text-[var(--muted)]"
                  >
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--green)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <VolunteerRolesAndForm
            needs={needs as any}
            locale={locale}
            projectId={project.id}
            projectLocation={project.location}
            availableRoles={needs.map((need) => ({
              id: need.id,
              roleName: need.roleName,
            }))}
            afterTimeline={
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--cream)] p-7">
                <p className="text-[13px] font-medium tracking-[0.14em] text-[var(--green)] uppercase">
                  {copy.afterTitle}
                </p>
                <ol className="mt-4 space-y-3">
                  {copy.after.map((item, idx) => (
                    <li
                      key={item}
                      className="flex gap-3 text-[15px] leading-relaxed text-[var(--muted)]"
                    >
                      <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-white text-[14px] font-medium text-[var(--green-dark)]">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            }
          />
        </div>
      </main>
    </>
  )
}
