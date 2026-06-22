export const volunteerApplicationStatusValues = [
  'confirmed',
  'in_discussion',
  'not_confirmed',
  'canceled',
] as const

export type VolunteerApplicationStatus = (typeof volunteerApplicationStatusValues)[number]

export const defaultVolunteerApplicationStatus: VolunteerApplicationStatus = 'not_confirmed'

export const volunteerApplicationStatusLabels: Record<
  'en' | 'fr',
  Record<VolunteerApplicationStatus, string>
> = {
  en: {
    confirmed: 'Confirmed',
    in_discussion: 'In discussion',
    not_confirmed: 'Not confirmed',
    canceled: 'Canceled',
  },
  fr: {
    confirmed: 'Confirmé',
    in_discussion: "En cours d'échange",
    not_confirmed: 'Non confirmé',
    canceled: 'Annulé',
  },
}

export const volunteerApplicationStatusOptions = volunteerApplicationStatusValues.map((value) => ({
  value,
  label: {
    en: volunteerApplicationStatusLabels.en[value],
    fr: volunteerApplicationStatusLabels.fr[value],
  },
}))

export const volunteerApplicationStatusColors: Record<
  VolunteerApplicationStatus,
  { bg: string; border: string; text: string }
> = {
  confirmed: { bg: '#dcfce7', border: '#16a34a', text: '#166534' },
  in_discussion: { bg: '#fef3c7', border: '#d97706', text: '#92400e' },
  not_confirmed: { bg: '#f3f4f6', border: '#9ca3af', text: '#4b5563' },
  canceled: { bg: '#fee2e2', border: '#dc2626', text: '#7f1d1d' },
}

const volunteerApplicationStatusSortRank: Record<VolunteerApplicationStatus, number> = {
  confirmed: 0,
  in_discussion: 1,
  not_confirmed: 2,
  canceled: 3,
}

export function isVolunteerApplicationStatus(value: string): value is VolunteerApplicationStatus {
  return volunteerApplicationStatusValues.includes(value as VolunteerApplicationStatus)
}

export function compareVolunteerApplicationStatus(a: string, b: string): number {
  const rankA =
    a in volunteerApplicationStatusSortRank
      ? volunteerApplicationStatusSortRank[a as VolunteerApplicationStatus]
      : volunteerApplicationStatusSortRank.not_confirmed
  const rankB =
    b in volunteerApplicationStatusSortRank
      ? volunteerApplicationStatusSortRank[b as VolunteerApplicationStatus]
      : volunteerApplicationStatusSortRank.not_confirmed
  return rankA - rankB
}
