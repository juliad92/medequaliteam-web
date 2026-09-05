import type { Media, Testimonial } from '@/payload/payload-types'
import type { Payload } from 'payload'

export type VolunteerStorySection = {
  question: string
  answer: string
}

export type VolunteerStory = {
  id: string
  slug: string
  publishedAt: string
  name: string
  role: string
  location: string
  coverImage: string | null
  coverImageAlt: string
  excerpt: string
  intro: string
  sections: VolunteerStorySection[]
  pullQuote: string
}

type Locale = 'en' | 'fr'

function getPhotoUrl(photo: Testimonial['photo']): string | null {
  if (!photo || typeof photo === 'string') return null
  const media = photo as Media
  return media.sizes?.card?.url ?? media.url ?? null
}

function getPhotoAlt(photo: Testimonial['photo'], fallback: string): string {
  if (!photo || typeof photo === 'string') return fallback
  return (photo as Media).alt || fallback
}

export function mapTestimonialToStory(doc: Testimonial): VolunteerStory | null {
  if (!doc.slug) return null

  return {
    id: doc.id,
    slug: doc.slug,
    publishedAt: doc.publishedAt ? doc.publishedAt.slice(0, 10) : doc.createdAt.slice(0, 10),
    name: doc.name,
    role: doc.role || '',
    location: doc.location || '',
    coverImage: getPhotoUrl(doc.photo),
    coverImageAlt: getPhotoAlt(doc.photo, `${doc.name}${doc.role ? ` — ${doc.role}` : ''}`),
    excerpt: doc.excerpt || doc.quote,
    intro: doc.intro || '',
    sections: (doc.sections || [])
      .filter((section): section is { id?: string; question: string; answer: string } =>
        Boolean(section?.question && section?.answer),
      )
      .map((section) => ({
        question: section.question,
        answer: section.answer,
      })),
    pullQuote: doc.quote,
  }
}

export async function getVolunteerStories(
  payload: Payload,
  locale: string,
): Promise<VolunteerStory[]> {
  const { docs } = await payload.find({
    collection: 'testimonials',
    locale: locale as Locale,
    fallbackLocale: 'en',
    depth: 1,
    sort: '-publishedAt',
    limit: 100,
  })

  return docs
    .map((doc) => mapTestimonialToStory(doc))
    .filter((story): story is VolunteerStory => Boolean(story))
}

export async function getVolunteerStory(
  payload: Payload,
  locale: string,
  slug: string,
): Promise<VolunteerStory | null> {
  const { docs } = await payload.find({
    collection: 'testimonials',
    where: { slug: { equals: slug } },
    locale: locale as Locale,
    fallbackLocale: 'en',
    depth: 1,
    limit: 1,
  })

  const doc = docs[0]
  if (!doc) return null
  return mapTestimonialToStory(doc)
}

export function formatStoryDate(locale: string, isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`)
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}
