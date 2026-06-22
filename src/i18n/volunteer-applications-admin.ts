import { volunteerApplicationStatusLabels } from '@/lib/volunteer/application-status'

export type AdminLanguage = 'en' | 'fr'

export function resolveAdminLanguage(language: string | undefined): AdminLanguage {
  return language === 'fr' ? 'fr' : 'en'
}

export { volunteerApplicationStatusLabels }

export const volunteerApplicationsAdminCopy = {
  en: {
    planningTitle: 'Application planning',
    planningSubtitle: 'Field presence, preferred availability and application dates',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    today: 'Today',
    project: 'Project',
    allProjects: 'All',
    status: 'Status',
    allStatuses: 'All statuses',
    preferredAvailability: 'Preferred availability',
    applicationDate: 'Application date',
    candidate: 'Candidate',
    period: 'Period',
    selectedRoles: 'Selected volunteer roles',
    confirmedRole: 'Confirmed volunteer role',
    noApplicationsForFilters: 'No applications for this month and these filters.',
    confirmedPresence: 'Confirmed presence',
    preferredAvailabilityRange: 'Preferred availability',
    applicationReceivedOn: 'Application received on',
    presenceByDay: 'Presence by day',
  },
  fr: {
    planningTitle: 'Planning des candidatures',
    planningSubtitle: 'Présence sur le terrain, disponibilités souhaitées et dates de candidature',
    previousMonth: 'Mois précédent',
    nextMonth: 'Mois suivant',
    today: "Aujourd'hui",
    project: 'Projet',
    allProjects: 'Tous',
    status: 'Statut',
    allStatuses: 'Tous les statuts',
    preferredAvailability: 'Disponibilité souhaitée',
    applicationDate: 'Date de candidature',
    candidate: 'Candidat',
    period: 'Période',
    selectedRoles: 'Rôles bénévoles sélectionnés',
    confirmedRole: 'Rôle bénévole confirmé',
    noApplicationsForFilters: 'Aucune candidature pour ce mois et ces filtres.',
    confirmedPresence: 'Présence confirmée',
    preferredAvailabilityRange: 'Disponibilité souhaitée',
    applicationReceivedOn: 'Candidature reçue le',
    presenceByDay: 'Présence par jour',
  },
} as const

export type VolunteerApplicationsAdminCopyKey = keyof typeof volunteerApplicationsAdminCopy.en

export function getVolunteerApplicationsAdminCopy(
  language: AdminLanguage,
  key: VolunteerApplicationsAdminCopyKey,
): string {
  return volunteerApplicationsAdminCopy[language][key]
}

export function getDateLocale(language: AdminLanguage): string {
  return language === 'fr' ? 'fr-FR' : 'en-GB'
}

const volunteerRoleCategoryLabelsByLanguage = {
  en: {
    doctor: 'Doctor',
    nurse: 'Nurse',
    helper: 'Helper',
  },
  fr: {
    doctor: 'Médecin',
    nurse: 'Infirmier·ère',
    helper: 'Aidant·e',
  },
} as const

export function getVolunteerRoleCategoryLabel(
  language: AdminLanguage,
  category: keyof typeof volunteerRoleCategoryLabelsByLanguage.en,
): string {
  return volunteerRoleCategoryLabelsByLanguage[language][category]
}
