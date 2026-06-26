'use client'

import { useEffect, useRef } from 'react'

import { getHelloAssoWidgetUrl } from '@/lib/donate/config'

export default function HelloAssoWidget({ formUrl }: { formUrl: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      const dataHeight = e.data?.height
      const haWidgetElement = iframeRef.current
      if (
        typeof dataHeight === 'number' &&
        haWidgetElement &&
        dataHeight > parseFloat(haWidgetElement.height || '0')
      ) {
        haWidgetElement.height = `${dataHeight}px`
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <iframe
      ref={iframeRef}
      id="haWidgetLight"
      allow="payment"
      src={`${getHelloAssoWidgetUrl(formUrl)}?view=form`}
      className="block w-full border-0"
    />
  )
}
