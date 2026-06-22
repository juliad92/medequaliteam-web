import { compareVolunteerApplicationStatus } from '@/lib/volunteer/application-status'

export type VolunteerRoleCategory = 'doctor' | 'nurse' | 'helper'

export type PlanningRole =
  | string
  | {
      id: string
      roleName?: string
      roleCategory?: VolunteerRoleCategory | string | null
    }

export type PlanningEntry = {
  id: string
  firstName: string
  lastName: string
  email: string
  applicationStatus: string
  createdAt: string
  preferredStartDate?: string | null
  preferredEndDate?: string | null
  confirmedStartDate?: string | null
  confirmedEndDate?: string | null
  project?: { id: string; title?: string } | string | null
  selectedRoles?: PlanningRole[] | null
  confirmedVolunteerRole?: PlanningRole | null
}

export type PresencePeriod = {
  start: Date
  end: Date
  kind: 'confirmed' | 'preferred'
}

export function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
}

export function getMonthMeta(year: number, month: number, language: 'en' | 'fr' = 'en') {
  const start = new Date(year, month, 1)
  const end = endOfDay(new Date(year, month + 1, 0))
  const daysInMonth = end.getDate()
  const dateLocale = language === 'fr' ? 'fr-FR' : 'en-GB'
  return {
    start,
    end,
    daysInMonth,
    label: start.toLocaleDateString(dateLocale, { month: 'long', year: 'numeric' }),
  }
}

export function getWeekdayLabels(language: 'en' | 'fr'): string[] {
  return language === 'fr'
    ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
}

export function getMondayBasedMonthOffset(year: number, month: number): number {
  return (new Date(year, month, 1).getDay() + 6) % 7
}

export type CalendarDayCell<T> = {
  day: number | null
  entries: T[]
}

export function buildMondayBasedCalendarGrid<T>(
  year: number,
  month: number,
  days: { day: number; entries: T[] }[],
): CalendarDayCell<T>[] {
  const leading = getMondayBasedMonthOffset(year, month)
  const trailing = (7 - ((leading + days.length) % 7)) % 7
  const cells: CalendarDayCell<T>[] = []

  for (let index = 0; index < leading; index += 1) {
    cells.push({ day: null, entries: [] })
  }

  for (const day of days) {
    cells.push({ day: day.day, entries: day.entries })
  }

  for (let index = 0; index < trailing; index += 1) {
    cells.push({ day: null, entries: [] })
  }

  return cells
}

export function getPresencePeriod(entry: PlanningEntry): PresencePeriod | null {
  const confirmedStart = parseDate(entry.confirmedStartDate)
  const confirmedEnd = parseDate(entry.confirmedEndDate)
  if (confirmedStart) {
    return {
      start: startOfDay(confirmedStart),
      end: endOfDay(confirmedEnd ?? confirmedStart),
      kind: 'confirmed',
    }
  }

  const preferredStart = parseDate(entry.preferredStartDate)
  const preferredEnd = parseDate(entry.preferredEndDate)
  if (preferredStart) {
    return {
      start: startOfDay(preferredStart),
      end: endOfDay(preferredEnd ?? preferredStart),
      kind: 'preferred',
    }
  }

  return null
}

export function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart <= bEnd && bStart <= aEnd
}

export function entryOverlapsMonth(
  entry: PlanningEntry,
  monthStart: Date,
  monthEnd: Date,
): boolean {
  const confirmedStart = parseDate(entry.confirmedStartDate)
  const confirmedEnd = parseDate(entry.confirmedEndDate)
  if (confirmedStart) {
    const start = startOfDay(confirmedStart)
    const end = endOfDay(confirmedEnd ?? confirmedStart)
    if (rangesOverlap(start, end, monthStart, monthEnd)) return true
  }

  const preferredStart = parseDate(entry.preferredStartDate)
  const preferredEnd = parseDate(entry.preferredEndDate)
  if (preferredStart) {
    const start = startOfDay(preferredStart)
    const end = endOfDay(preferredEnd ?? preferredStart)
    if (rangesOverlap(start, end, monthStart, monthEnd)) return true
  }

  return false
}

export function getBarStyle(
  periodStart: Date,
  periodEnd: Date,
  monthStart: Date,
  monthEnd: Date,
  daysInMonth: number,
): { left: string; width: string } | null {
  if (!rangesOverlap(periodStart, periodEnd, monthStart, monthEnd)) return null

  const visibleStart = periodStart < monthStart ? monthStart : periodStart
  const visibleEnd = periodEnd > monthEnd ? monthEnd : periodEnd

  const startDay = visibleStart.getDate()
  const endDay = visibleEnd.getDate()
  const left = ((startDay - 1) / daysInMonth) * 100
  const width = ((endDay - startDay + 1) / daysInMonth) * 100

  return { left: `${left}%`, width: `${Math.max(width, 100 / daysInMonth)}%` }
}

export function getDayMarkerStyle(
  date: Date,
  monthStart: Date,
  monthEnd: Date,
  daysInMonth: number,
): string | null {
  const day = startOfDay(date)
  if (day < monthStart || day > monthEnd) return null
  return `${((day.getDate() - 0.5) / daysInMonth) * 100}%`
}

export function getProjectLabel(project: PlanningEntry['project']): string {
  if (!project) return '—'
  if (typeof project === 'string') return project
  return project.title ?? project.id
}

export function getProjectId(project: PlanningEntry['project']): string | null {
  if (!project) return null
  return typeof project === 'string' ? project : project.id
}

export function getRoleLabel(role: PlanningRole | null | undefined): string {
  if (!role) return '—'
  if (typeof role === 'string') return role
  return role.roleName ?? role.id
}

export function getRolesLabel(roles: PlanningRole[] | null | undefined): string {
  if (!roles?.length) return '—'
  return roles.map((role) => getRoleLabel(role)).join(', ')
}

export const volunteerRoleCategoryOrder: VolunteerRoleCategory[] = ['doctor', 'nurse', 'helper']

const volunteerRoleCategorySortRank: Record<VolunteerRoleCategory, number> = {
  doctor: 0,
  nurse: 1,
  helper: 2,
}

export const volunteerRoleCategoryLabels: Record<VolunteerRoleCategory, string> = {
  doctor: 'Médecin',
  nurse: 'Infirmier·ère',
  helper: 'Aidant·e',
}

export function parseRoleCategory(value: string | null | undefined): VolunteerRoleCategory | null {
  if (value === 'doctor' || value === 'nurse' || value === 'helper') return value
  return null
}

export function inferVolunteerRoleCategory(roleName: string): VolunteerRoleCategory {
  const name = roleName.toLowerCase()
  if (/\b(doctor|physician|médecin|midwife|sage-femme|medical coordinator|coordinateur)\b/.test(name)) {
    return 'doctor'
  }
  if (/\b(nurse|infirmier|infirmière|soignant|soignante|nursing)\b/.test(name)) {
    return 'nurse'
  }
  return 'helper'
}

export function getRoleCategory(role: PlanningRole | null | undefined): VolunteerRoleCategory | null {
  if (!role || typeof role === 'string') return null
  return parseRoleCategory(role.roleCategory ?? null)
}

export function getEntryRoleCategories(entry: PlanningEntry): VolunteerRoleCategory[] {
  const confirmed = getRoleCategory(entry.confirmedVolunteerRole)
  if (confirmed) return [confirmed]

  const categories = new Set<VolunteerRoleCategory>()
  for (const role of entry.selectedRoles ?? []) {
    const category = getRoleCategory(role)
    if (category) categories.add(category)
  }

  return volunteerRoleCategoryOrder.filter((category) => categories.has(category))
}

export function getEntryPrimaryRoleCategory(entry: PlanningEntry): VolunteerRoleCategory | null {
  return getEntryRoleCategories(entry)[0] ?? null
}

export function countEntriesByRoleCategory(
  entries: PlanningEntry[],
): Record<VolunteerRoleCategory, number> {
  const counts: Record<VolunteerRoleCategory, number> = {
    doctor: 0,
    nurse: 0,
    helper: 0,
  }

  for (const entry of entries) {
    if (entry.applicationStatus !== 'confirmed') continue
    const category = getEntryPrimaryRoleCategory(entry)
    if (category) counts[category] += 1
  }

  return counts
}

export function comparePlanningEntryRoleCategory(
  a: PlanningEntry,
  b: PlanningEntry,
  language: 'en' | 'fr' = 'fr',
): number {
  const categoryA = getEntryPrimaryRoleCategory(a)
  const categoryB = getEntryPrimaryRoleCategory(b)
  const rankA = categoryA ? volunteerRoleCategorySortRank[categoryA] : volunteerRoleCategoryOrder.length
  const rankB = categoryB ? volunteerRoleCategorySortRank[categoryB] : volunteerRoleCategoryOrder.length
  if (rankA !== rankB) return rankA - rankB

  const locale = language === 'fr' ? 'fr' : 'en'
  const lastNameCompare = a.lastName.localeCompare(b.lastName, locale)
  if (lastNameCompare !== 0) return lastNameCompare

  return a.firstName.localeCompare(b.firstName, locale)
}

export function comparePlanningEntries(
  a: PlanningEntry,
  b: PlanningEntry,
  language: 'en' | 'fr' = 'fr',
): number {
  const statusCompare = compareVolunteerApplicationStatus(a.applicationStatus, b.applicationStatus)
  if (statusCompare !== 0) return statusCompare
  return comparePlanningEntryRoleCategory(a, b, language)
}

export function mapPlanningRole(
  role: string | { id: string; roleName?: string; roleCategory?: string | null },
): PlanningRole {
  if (typeof role === 'string') return role
  return {
    id: role.id,
    roleName: role.roleName,
    roleCategory: role.roleCategory,
  }
}

export function formatShortDate(
  value: string | null | undefined,
  language: 'en' | 'fr' = 'en',
): string {
  const date = parseDate(value)
  if (!date) return '—'
  const dateLocale = language === 'fr' ? 'fr-FR' : 'en-GB'
  return date.toLocaleDateString(dateLocale, { day: 'numeric', month: 'short', year: 'numeric' })
}
