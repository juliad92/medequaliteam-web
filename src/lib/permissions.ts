/**
 * Admin console permissions for sensitive data.
 *
 * - Administrators have every permission.
 * - Editors only get the rights listed on their user document.
 * - Users created before `role` existed are treated as administrators.
 */

export const USER_ROLES = ['admin', 'editor'] as const
export type UserRole = (typeof USER_ROLES)[number]

export const PERMISSIONS = {
  viewVolunteerApplications: 'viewVolunteerApplications',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export const permissionOptions = [
  {
    label: {
      en: 'View volunteer applications',
      fr: 'Consulter les candidatures bénévoles',
    },
    value: PERMISSIONS.viewVolunteerApplications,
  },
] as const

type PermissionUser =
  | {
      role?: UserRole | null
      permissions?: (Permission | null)[] | null
    }
  | null
  | undefined

export function isAdminUser(user: PermissionUser): boolean {
  if (!user) return false
  // Legacy CMS users (no role field yet) keep full access.
  return user.role == null || user.role === 'admin'
}

export function userHasPermission(user: PermissionUser, permission: Permission): boolean {
  if (!user) return false
  if (isAdminUser(user)) return true
  return Array.isArray(user.permissions) && user.permissions.includes(permission)
}
