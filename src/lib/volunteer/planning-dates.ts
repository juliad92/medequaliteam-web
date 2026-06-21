export type PlanningRole = { id: string; roleName?: string } | string

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

export function getMonthMeta(year: number, month: number) {
  const start = new Date(year, month, 1)
  const end = endOfDay(new Date(year, month + 1, 0))
  const daysInMonth = end.getDate()
  return { start, end, daysInMonth, label: start.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) }
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

export function formatShortDate(value: string | null | undefined): string {
  const date = parseDate(value)
  if (!date) return '—'
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}
