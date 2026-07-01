import { getPayload } from 'payload'
import config from '@payload-config'
import React from 'react'

import HeroSection from '@/components/home/HeroSection'
import ImpactBar from '@/components/home/ImpactBar'
import MissionSection from '@/components/home/MissionSection'
import ProjectsSection from '@/components/home/ProjectsSection'
import { VolunteerCTA, NewsSection } from '@/components/home/CtaAndNews'
import { getProjectsWithVolunteerNeeds } from '@/lib/volunteer'
import { getInstagramPosts } from '@/lib/instagram'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayload({ config })

  // Fetch real data from Payload (falls back to placeholders in components if empty)
  const { docs: projects } = await payload.find({
    collection: 'projects',
    where: { featured: { equals: true }, _status: { equals: 'published' } },
    locale: locale as 'en' | 'fr',
    fallbackLocale: 'en',
    limit: 3,
  })

  // Get the project configured in featuredProject in globals
  const homepageSettings = await payload.findGlobal({
    slug: 'homepage',
    locale: locale as 'en' | 'fr',
    depth: 1,
  })
  const featuredProject = homepageSettings?.featuredProject
  const heroData = homepageSettings?.hero
  const impactStats = homepageSettings?.impactStats
  const missionImage = homepageSettings?.mission?.image

  const { docs: posts } = await payload.find({
    collection: 'posts',
    sort: '-publishedAt',
    locale: locale as 'en' | 'fr',
    limit: 3,
  })

  const volunteerProjects = await getProjectsWithVolunteerNeeds(payload, locale as 'en' | 'fr')
  const instagramPosts = await getInstagramPosts(6)
  const volunteerHref = volunteerProjects[0]
    ? `/${locale}/volunteer/${volunteerProjects[0].slug}`
    : `/${locale}/volunteer/stories`

  return (
    <>
      <HeroSection locale={locale} heroData={heroData} project={featuredProject as any} />
      <ImpactBar locale={locale} impactStats={impactStats as any} />
      <MissionSection locale={locale} missionImage={missionImage} />
      <ProjectsSection locale={locale} projects={projects as any} />
      <VolunteerCTA locale={locale} volunteerHref={volunteerHref} />
      <NewsSection locale={locale} posts={posts as any} instagramPosts={instagramPosts} />
    </>
  )
}
