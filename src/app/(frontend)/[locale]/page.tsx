import { getPayload } from 'payload'
import config from '@payload-config'
import React from 'react'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import ImpactBar from '@/components/home/ImpactBar'
import MissionSection from '@/components/home/MissionSection'
import ProjectsSection from '@/components/home/ProjectsSection'
import { VolunteerCTA, NewsSection } from '@/components/home/CtaAndNews'

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
  })
  const featuredProject = homepageSettings?.featuredProject

  const impactStats = homepageSettings?.impactStats

  const { docs: posts } = await payload.find({
    collection: 'posts',
    sort: '-publishedAt',
    locale: locale as 'en' | 'fr',
    limit: 3,
  })

  return (
    <>
      <Navbar locale={locale} />
      <HeroSection locale={locale} project={featuredProject as any} />
      <ImpactBar locale={locale} impactStats={impactStats as any} />
      <MissionSection locale={locale} />
      <ProjectsSection locale={locale} projects={projects as any} />
      <VolunteerCTA locale={locale} />
      <NewsSection locale={locale} posts={posts as any} />
      <Footer locale={locale} />
    </>
  )
}
