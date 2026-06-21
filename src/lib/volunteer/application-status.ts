export const volunteerApplicationStatusOptions = [
  { label: 'Confirmé', value: 'confirmed' },
  { label: "En cours d'échange", value: 'in_discussion' },
  { label: 'Non confirmé', value: 'not_confirmed' },
  { label: 'Annulé', value: 'canceled' },
] as const

export type VolunteerApplicationStatus = (typeof volunteerApplicationStatusOptions)[number]['value']

export const defaultVolunteerApplicationStatus: VolunteerApplicationStatus = 'not_confirmed'

export const volunteerApplicationStatusLabels: Record<VolunteerApplicationStatus, string> = {
  confirmed: 'Confirmé',
  in_discussion: "En cours d'échange",
  not_confirmed: 'Non confirmé',
  canceled: 'Annulé',
}

export const volunteerApplicationStatusColors: Record<
  VolunteerApplicationStatus,
  { bg: string; border: string; text: string }
> = {
  confirmed: { bg: '#dcfce7', border: '#16a34a', text: '#166534' },
  in_discussion: { bg: '#fef3c7', border: '#d97706', text: '#92400e' },
  not_confirmed: { bg: '#f3f4f6', border: '#9ca3af', text: '#4b5563' },
  canceled: { bg: '#fee2e2', border: '#dc2626', text: '#7f1d1d' },
}
