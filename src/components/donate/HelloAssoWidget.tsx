'use client'

import { useEffect, useState } from 'react'

import { getHelloAssoWidgetUrl } from '@/lib/donate/config'

const DEFAULT_HEIGHT = 750

export default function HelloAssoWidget({ formUrl }: { formUrl: string }) {
  const [height, setHeight] = useState(DEFAULT_HEIGHT)

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data
      if (typeof data === 'object' && data !== null && typeof data.height === 'number') {
        setHeight(data.height)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <iframe
      id="haWidget"
      title="HelloAsso"
      src={getHelloAssoWidgetUrl(formUrl)}
      className="w-full border-none"
      style={{ height: `${height}px` }}
    />
  )
}
