import React from 'react'
import type { Metadata } from 'next'

import { getSiteUrl, SITE_NAME } from '@/lib/seo'

import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
