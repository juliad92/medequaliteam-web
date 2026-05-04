import React from 'react'
import { notFound } from 'next/navigation'
// import './styles.css'

const locales = ['en', 'fr'] as const
type Locale = (typeof locales)[number]

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Return 404 if locale is not supported
  if (!locales.includes(locale as Locale)) notFound()

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  )
}
