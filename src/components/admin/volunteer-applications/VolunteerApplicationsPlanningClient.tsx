'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { useTranslation } from '@payloadcms/ui'
import {
  isVolunteerApplicationStatus,
  volunteerApplicationStatusColors,
  volunteerApplicationStatusOptions,
  volunteerApplicationStatusValues,
} from '@/lib/volunteer/application-status'
import {
  getVolunteerApplicationsAdminCopy,
  getVolunteerRoleCategoryLabel,
  resolveAdminLanguage,
  volunteerApplicationStatusLabels,
  type AdminLanguage,
} from '@/i18n/volunteer-applications-admin'
import {
  buildMondayBasedCalendarGrid,
  comparePlanningEntries,
  countEntriesByRoleCategory,
  entryOverlapsMonth,
  formatShortDate,
  getBarStyle,
  getDayMarkerStyle,
  getEntryRoleCategories,
  getMonthMeta,
  getPresencePeriod,
  getProjectId,
  getProjectLabel,
  getRoleLabel,
  getRolesLabel,
  getWeekdayLabels,
  parseDate,
  type PlanningEntry,
} from '@/lib/volunteer/planning-dates'
import { VolunteerRoleCategoryDayCounts, VolunteerRoleCategoryIcons } from './VolunteerRoleCategoryIcons'

type Props = {
  entries: PlanningEntry[]
}

export function VolunteerApplicationsPlanningClient({ entries }: Props) {
  const { i18n } = useTranslation()
  const language = resolveAdminLanguage(i18n.language)
  const copy = (key: Parameters<typeof getVolunteerApplicationsAdminCopy>[1]) =>
    getVolunteerApplicationsAdminCopy(language, key)
  const statusLabels = volunteerApplicationStatusLabels[language]

  const today = new Date()
  const [expanded, setExpanded] = useState(true)
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [projectFilter, setProjectFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const monthMeta = useMemo(() => getMonthMeta(year, month, language), [year, month, language])

  const projects = useMemo(() => {
    const map = new Map<string, string>()
    for (const entry of entries) {
      const id = getProjectId(entry.project)
      if (!id) continue
      map.set(id, getProjectLabel(entry.project))
    }
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1], language))
  }, [entries, language])

  const filteredEntries = useMemo(() => {
    return entries
      .filter((entry) => {
        if (statusFilter !== 'all' && entry.applicationStatus !== statusFilter) return false
        if (projectFilter !== 'all' && getProjectId(entry.project) !== projectFilter) return false
        return entryOverlapsMonth(entry, monthMeta.start, monthMeta.end)
      })
      .sort((a, b) => comparePlanningEntries(a, b, language))
  }, [entries, language, monthMeta.end, monthMeta.start, projectFilter, statusFilter])

  const calendarDays = useMemo(() => {
    const days: { date: Date; day: number; entries: PlanningEntry[] }[] = []
    for (let day = 1; day <= monthMeta.daysInMonth; day += 1) {
      const date = new Date(year, month, day)
      const dayStart = new Date(year, month, day)
      const dayEnd = new Date(year, month, day, 23, 59, 59, 999)
      const present = filteredEntries
        .filter((entry) => {
          const period = getPresencePeriod(entry)
          if (!period) return false
          return period.start <= dayEnd && dayStart <= period.end
        })
        .sort((a, b) => comparePlanningEntries(a, b, language))
      days.push({ date, day, entries: present })
    }
    return days
  }, [filteredEntries, language, month, monthMeta.daysInMonth, year])

  const weekdayLabels = useMemo(() => getWeekdayLabels(language), [language])

  const calendarGrid = useMemo(
    () =>
      buildMondayBasedCalendarGrid(
        year,
        month,
        calendarDays.map(({ day, entries }) => ({ day, entries })),
      ),
    [calendarDays, month, year],
  )

  const shiftMonth = (delta: number) => {
    const next = new Date(year, month + delta, 1)
    setYear(next.getFullYear())
    setMonth(next.getMonth())
  }

  const statusFilterOptions = useMemo(
    () => [
      { label: copy('allStatuses'), value: 'all' },
      ...volunteerApplicationStatusOptions.map((option) => ({
        label: option.label[language],
        value: option.value,
      })),
    ],
    [language],
  )

  return (
    <section
      style={{
        marginBottom: '1.5rem',
        border: '1px solid var(--theme-elevation-150, #e5e7eb)',
        borderRadius: '8px',
        background: 'var(--theme-elevation-50, #fafafa)',
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          padding: '1rem 1.25rem',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          textAlign: 'left',
          color: 'inherit',
        }}
      >
        <div>
          <strong style={{ display: 'block', fontSize: '1rem' }}>{copy('planningTitle')}</strong>
          <span style={{ fontSize: '0.875rem', opacity: 0.75 }}>{copy('planningSubtitle')}</span>
        </div>
        <span aria-hidden="true" style={{ fontSize: '1.25rem' }}>
          {expanded ? '▾' : '▸'}
        </span>
      </button>

      {expanded ? (
        <div style={{ padding: '0 1.25rem 1.25rem' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button type="button" onClick={() => shiftMonth(-1)} aria-label={copy('previousMonth')}>
                ◀
              </button>
              <strong style={{ minWidth: '10rem', textAlign: 'center', textTransform: 'capitalize' }}>
                {monthMeta.label}
              </strong>
              <button type="button" onClick={() => shiftMonth(1)} aria-label={copy('nextMonth')}>
                ▶
              </button>
              <button
                type="button"
                onClick={() => {
                  setYear(today.getFullYear())
                  setMonth(today.getMonth())
                }}
                style={{ marginLeft: '0.25rem' }}
              >
                {copy('today')}
              </button>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>{copy('project')}</span>
              <select value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)}>
                <option value="all">{copy('allProjects')}</option>
                {projects.map(([id, title]) => (
                  <option key={id} value={id}>
                    {title}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>{copy('status')}</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                {statusFilterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1rem',
              fontSize: '0.8125rem',
            }}
          >
            {volunteerApplicationStatusValues.map((value) => (
              <span key={value} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                <span
                  style={{
                    width: '0.75rem',
                    height: '0.75rem',
                    borderRadius: '999px',
                    background: volunteerApplicationStatusColors[value].border,
                  }}
                />
                {statusLabels[value]}
              </span>
            ))}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
              <span
                style={{
                  width: '0.75rem',
                  height: '0.75rem',
                  borderRadius: '999px',
                  border: '2px dashed #64748b',
                  background: 'transparent',
                }}
              />
              {copy('preferredAvailability')}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
              <span
                style={{
                  width: '0.5rem',
                  height: '0.5rem',
                  borderRadius: '999px',
                  background: '#2563eb',
                }}
              />
              {copy('applicationDate')}
            </span>
          </div>

          <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table style={{ width: '100%', minWidth: '960px', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr>
                  <th style={headerCellStyle}>{copy('candidate')}</th>
                  <th style={headerCellStyle}>{copy('status')}</th>
                  <th style={headerCellStyle}>{copy('project')}</th>
                  <th style={headerCellStyle}>{copy('selectedRoles')}</th>
                  <th style={headerCellStyle}>{copy('confirmedRole')}</th>
                  <th style={{ ...headerCellStyle, minWidth: '420px' }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      {copy('period')} ({monthMeta.label})
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${monthMeta.daysInMonth}, 1fr)`, gap: '1px' }}>
                      {Array.from({ length: monthMeta.daysInMonth }, (_, index) => (
                        <span key={index + 1} style={{ fontSize: '0.6875rem', opacity: 0.7, textAlign: 'center' }}>
                          {index + 1}
                        </span>
                      ))}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '1rem', opacity: 0.7 }}>
                      {copy('noApplicationsForFilters')}
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry) => {
                    const status = isVolunteerApplicationStatus(entry.applicationStatus)
                      ? entry.applicationStatus
                      : 'not_confirmed'
                    const colors = volunteerApplicationStatusColors[status]
                    const period = getPresencePeriod(entry)
                    const barStyle =
                      period &&
                      getBarStyle(period.start, period.end, monthMeta.start, monthMeta.end, monthMeta.daysInMonth)
                    const applicationMarker = getDayMarkerStyle(
                      parseDate(entry.createdAt) ?? new Date(entry.createdAt),
                      monthMeta.start,
                      monthMeta.end,
                      monthMeta.daysInMonth,
                    )

                    return (
                      <tr key={entry.id}>
                        <td style={bodyCellStyle}>
                          <Link
                            href={`/admin/collections/volunteer-applications/${entry.id}`}
                            style={{ color: 'inherit', textDecoration: 'underline' }}
                          >
                            {entry.firstName} {entry.lastName}
                          </Link>
                          <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{entry.email}</div>
                        </td>
                        <td style={bodyCellStyle}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.125rem 0.5rem',
                              borderRadius: '999px',
                              border: `1px solid ${colors.border}`,
                              background: colors.bg,
                              color: colors.text,
                              fontSize: '0.75rem',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {statusLabels[status]}
                          </span>
                        </td>
                        <td style={bodyCellStyle}>{getProjectLabel(entry.project)}</td>
                        <td style={bodyCellStyle}>{getRolesLabel(entry.selectedRoles)}</td>
                        <td style={bodyCellStyle}>{getRoleLabel(entry.confirmedVolunteerRole)}</td>
                        <td style={bodyCellStyle}>
                          <div
                            style={{
                              position: 'relative',
                              height: '1.75rem',
                              borderRadius: '4px',
                              background: 'var(--theme-elevation-100, #f3f4f6)',
                            }}
                          >
                            {barStyle ? (
                              <div
                                title={formatPeriodTitle(entry, period, language, copy)}
                                style={{
                                  position: 'absolute',
                                  top: '0.375rem',
                                  bottom: '0.375rem',
                                  left: barStyle.left,
                                  width: barStyle.width,
                                  borderRadius: '4px',
                                  background:
                                    period?.kind === 'confirmed' ? colors.border : 'transparent',
                                  border:
                                    period?.kind === 'confirmed'
                                      ? `1px solid ${colors.border}`
                                      : `2px dashed ${colors.border}`,
                                  opacity: period?.kind === 'confirmed' ? 1 : 0.85,
                                }}
                              />
                            ) : null}
                            {applicationMarker ? (
                              <div
                                title={`${copy('applicationReceivedOn')} ${formatShortDate(entry.createdAt, language)}`}
                                style={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: applicationMarker,
                                  transform: 'translate(-50%, -50%)',
                                  width: '0.625rem',
                                  height: '0.625rem',
                                  borderRadius: '999px',
                                  background: '#2563eb',
                                  border: '2px solid white',
                                  boxShadow: '0 0 0 1px #2563eb',
                                }}
                              />
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.9375rem' }}>{copy('presenceByDay')}</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
              gap: '0.75rem',
            }}
          >
            {weekdayLabels.map((label) => (
              <div
                key={label}
                style={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textAlign: 'center',
                  color: 'var(--theme-elevation-600, #4b5563)',
                  paddingBottom: '0.25rem',
                }}
              >
                {label}
              </div>
            ))}
            {calendarGrid.map((cell, index) => {
              if (cell.day === null) {
                return (
                  <div
                    key={`empty-${index}`}
                    style={{
                      minHeight: '120px',
                      borderRadius: '6px',
                      background: 'var(--theme-elevation-50, #fafafa)',
                    }}
                  />
                )
              }

              const isToday =
                cell.day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()

              return (
                <div
                  key={cell.day}
                  style={{
                    minHeight: '120px',
                    padding: '0.625rem',
                    borderRadius: '6px',
                    border: isToday
                      ? '2px solid var(--theme-success-500, #16a34a)'
                      : '1px solid var(--theme-elevation-150, #e5e7eb)',
                    background: 'var(--theme-elevation-0, #fff)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.375rem',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{cell.day}</div>
                    <VolunteerRoleCategoryDayCounts
                      counts={countEntriesByRoleCategory(cell.entries)}
                      language={language}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    {cell.entries.length === 0 ? (
                      <span style={{ fontSize: '0.75rem', opacity: 0.55 }}>—</span>
                    ) : (
                      cell.entries.map((entry) => {
                        const status = isVolunteerApplicationStatus(entry.applicationStatus)
                          ? entry.applicationStatus
                          : 'not_confirmed'
                        const colors = volunteerApplicationStatusColors[status]
                        const roleCategories = getEntryRoleCategories(entry)
                        const roleCategoryLabel = roleCategories
                          .map((category) => getVolunteerRoleCategoryLabel(language, category))
                          .join(', ')
                        const title = roleCategoryLabel
                          ? `${entry.email} — ${roleCategoryLabel}`
                          : entry.email
                        return (
                          <Link
                            key={entry.id}
                            href={`/admin/collections/volunteer-applications/${entry.id}`}
                            title={title}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              padding: '0.125rem 0.375rem',
                              borderRadius: '4px',
                              background: colors.bg,
                              color: colors.text,
                              border: `1px solid ${colors.border}`,
                              fontSize: '0.6875rem',
                              textDecoration: 'none',
                              overflow: 'hidden',
                              minWidth: 0,
                            }}
                          >
                            <VolunteerRoleCategoryIcons
                              categories={roleCategories}
                              language={language}
                            />
                            <span
                              style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {entry.firstName} {entry.lastName.charAt(0)}.
                            </span>
                          </Link>
                        )
                      })
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </section>
  )
}

function formatPeriodTitle(
  entry: PlanningEntry,
  period: ReturnType<typeof getPresencePeriod>,
  language: AdminLanguage,
  copy: (key: Parameters<typeof getVolunteerApplicationsAdminCopy>[1]) => string,
): string {
  if (!period) return ''

  if (period.kind === 'confirmed') {
    return `${copy('confirmedPresence')}: ${formatShortDate(entry.confirmedStartDate, language)} → ${formatShortDate(entry.confirmedEndDate ?? entry.confirmedStartDate, language)}`
  }

  return `${copy('preferredAvailabilityRange')}: ${formatShortDate(entry.preferredStartDate, language)} → ${formatShortDate(entry.preferredEndDate ?? entry.preferredStartDate, language)}`
}

const headerCellStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.625rem 0.75rem',
  borderBottom: '1px solid var(--theme-elevation-150, #e5e7eb)',
  verticalAlign: 'bottom',
}

const bodyCellStyle: React.CSSProperties = {
  padding: '0.75rem',
  borderBottom: '1px solid var(--theme-elevation-100, #f3f4f6)',
  verticalAlign: 'top',
}
