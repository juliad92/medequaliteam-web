import React from 'react'

/** Renders a JSON-LD script tag for search/AI crawlers. */
export default function JsonLd({ data }: { data: Record<string, unknown> | object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}
