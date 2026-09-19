import { permanentRedirect } from 'next/navigation'

export default async function DonateFundsRedirect({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  permanentRedirect(`/${locale}/donate`)
}
