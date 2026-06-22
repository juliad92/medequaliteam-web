import React from 'react'
import {
  getVolunteerRoleCategoryLabel,
  type AdminLanguage,
} from '@/i18n/volunteer-applications-admin'
import { volunteerRoleCategoryOrder, type VolunteerRoleCategory } from '@/lib/volunteer/planning-dates'

type Props = {
  categories: VolunteerRoleCategory[]
  language: AdminLanguage
}

const iconSize = 12

type IconProps = {
  category: VolunteerRoleCategory
  language: AdminLanguage
  size?: number
}

function VolunteerRoleCategoryIcon({ category, language, size = iconSize }: IconProps) {
  const label = getVolunteerRoleCategoryLabel(language, category)

  if (category === 'doctor') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-label={label}
        role="img"
      >
        <path d="M11 2v2" />
        <path d="M5 2v2" />
        <path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" />
        <path d="M8 15a6 6 0 0 0 12 0v-3" />
        <circle cx="20" cy="10" r="2" />
      </svg>
    )
  }

  if (category === 'nurse') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-label={label}
        role="img"
      >
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M12 11v6" />
        <path d="M9 14h6" />
      </svg>
    )
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label={label}
      role="img"
    >
      <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
      <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v6" />
      <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8" />
    </svg>
  )
}

export function VolunteerRoleCategoryIcons({ categories, language }: Props) {
  if (categories.length === 0) return null

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.125rem',
        flexShrink: 0,
        opacity: 0.9,
      }}
    >
      {categories.map((category) => (
        <VolunteerRoleCategoryIcon key={category} category={category} language={language} />
      ))}
    </span>
  )
}

type CountsProps = {
  counts: Record<VolunteerRoleCategory, number>
  language: AdminLanguage
}

function pluralSuffix(count: number): string {
  return count > 1 ? 's' : ''
}

export function VolunteerRoleCategoryDayCounts({ counts, language }: CountsProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        fontSize: '0.6875rem',
        fontWeight: 500,
        opacity: 0.85,
        flexShrink: 0,
      }}
    >
      {volunteerRoleCategoryOrder.map((category) => {
        const label = getVolunteerRoleCategoryLabel(language, category)
        const count = counts[category]
        return (
          <span
            key={category}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.125rem' }}
            aria-label={`${count} ${label}${pluralSuffix(count)}`}
            title={`${count} ${label.toLowerCase()}${pluralSuffix(count)}`}
          >
            <span aria-hidden="true">{count}</span>
            <span aria-hidden="true">
              <VolunteerRoleCategoryIcon category={category} language={language} size={10} />
            </span>
          </span>
        )
      })}
    </span>
  )
}

export { VolunteerRoleCategoryIcon }
