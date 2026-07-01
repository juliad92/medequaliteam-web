const INSTAGRAM_PROFILE = 'https://www.instagram.com/medequaliteam/'
const INSTAGRAM_HANDLE = 'medequaliteam'

type InstagramMediaItem = {
  id: string
  caption?: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url?: string
  thumbnail_url?: string
  permalink: string
  timestamp: string
}

export type InstagramPost = {
  id: string
  caption?: string
  mediaType: InstagramMediaItem['media_type']
  imageUrl: string
  permalink: string
  timestamp: string
}

export { INSTAGRAM_HANDLE, INSTAGRAM_PROFILE }

function getImageUrl(item: InstagramMediaItem): string | null {
  if (item.media_type === 'VIDEO') {
    return item.thumbnail_url ?? item.media_url ?? null
  }
  return item.media_url ?? item.thumbnail_url ?? null
}

function mapMediaItem(item: InstagramMediaItem): InstagramPost | null {
  const imageUrl = getImageUrl(item)
  if (!imageUrl) return null

  return {
    id: item.id,
    caption: item.caption,
    mediaType: item.media_type,
    imageUrl,
    permalink: item.permalink,
    timestamp: item.timestamp,
  }
}

export async function getInstagramPosts(limit = 6): Promise<InstagramPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  if (!token) return []

  const userId = process.env.INSTAGRAM_USER_ID
  const baseUrl = userId
    ? `https://graph.facebook.com/v21.0/${userId}/media`
    : 'https://graph.instagram.com/me/media'

  const params = new URLSearchParams({
    fields: 'id,caption,media_type,media_url,permalink,timestamp,thumbnail_url',
    limit: String(limit),
    access_token: token,
  })

  try {
    const response = await fetch(`${baseUrl}?${params}`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) return []

    const data = (await response.json()) as { data?: InstagramMediaItem[] }
    if (!data.data?.length) return []

    return data.data
      .map(mapMediaItem)
      .filter((post): post is InstagramPost => post !== null)
  } catch {
    return []
  }
}
