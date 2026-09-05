import { getPayload } from 'payload'
import config from '@payload-config'

import type { Page } from '@/payload/payload-types'

type Locale = 'en' | 'fr'

export async function getPageBySlug(slug: string, locale: Locale): Promise<Page | null> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'pages',
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
    },
    locale,
    fallbackLocale: 'en',
    depth: 1,
    limit: 1,
  })

  return (docs[0] as Page | undefined) ?? null
}

export function getPageRichTextContent(page: Page): unknown | null {
  const block = page.layout.find((item) => item.blockType === 'rich-text')
  if (!block || block.blockType !== 'rich-text') return null
  return block.content ?? null
}
