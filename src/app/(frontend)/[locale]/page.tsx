import { getPayload } from 'payload'
import config from '@payload-config'
import React from 'react'
import type { Metadata } from 'next'

import HeroSection from '@/components/home/HeroSection'
import ImpactBar from '@/components/home/ImpactBar'
import MissionSection from '@/components/home/MissionSection'
import ProjectsSection from '@/components/home/ProjectsSection'
import { VolunteerCTA } from '@/components/home/CtaAndNews'
import { getT } from '@/i18n/translations'
import { buildPageMetadata } from '@/lib/seo'
import { getProjectsWithVolunteerNeeds } from '@/lib/volunteer'
import type { Project } from '@/payload/payload-types'

function populatedProject(value: string | Project | null | undefined): Project | undefined {
  return value && typeof value === 'object' ? value : undefined
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = getT(locale)
  const payload = await getPayload({ config })
  const homepageSettings = await payload.findGlobal({
    slug: 'homepage',
    locale: locale as 'en' | 'fr',
    fallbackLocale: 'en',
    depth: 1,
  })

  const heading = homepageSettings?.hero?.heading?.trim()
  const tagline = homepageSettings?.hero?.tagline?.trim()
  const title = heading ? (tagline ? `${heading} — ${tagline}` : heading) : t.home.metaTitle

  return buildPageMetadata({
    locale,
    path: '',
    title,
    description: t.home.metaDescription,
    image: homepageSettings?.hero?.image,
    absoluteTitle: true,
  })
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayload({ config })

  // Fetch real data from Payload (falls back to placeholders in components if empty)
  const { docs: projects } = await payload.find({
    collection: 'projects',
    where: { featured: { equals: true }, _status: { equals: 'published' } },
    locale: locale as 'en' | 'fr',
    fallbackLocale: 'en',
    depth: 1,
    limit: 3,
  })

  // Get the project configured in featuredProject in globals
  const homepageSettings = await payload.findGlobal({
    slug: 'homepage',
    locale: locale as 'en' | 'fr',
    depth: 1,
  })
  const featuredProject = populatedProject(homepageSettings?.featuredProject)
  const heroData = homepageSettings?.hero
  const impactStats = homepageSettings?.impactStats
  const missionImage = homepageSettings?.mission?.image

  const volunteerProjects = await getProjectsWithVolunteerNeeds(payload, locale as 'en' | 'fr')
  const volunteerHref = volunteerProjects[0]
    ? `/${locale}/volunteer/${volunteerProjects[0].slug}`
    : `/${locale}/volunteer/stories`

  return (
    <>
      <HeroSection locale={locale} heroData={heroData} project={featuredProject} />
      <ImpactBar locale={locale} impactStats={impactStats} />
      <MissionSection locale={locale} missionImage={missionImage} />
      <ProjectsSection locale={locale} projects={projects} />
      <VolunteerCTA locale={locale} volunteerHref={volunteerHref} />
    </>
  )
}
