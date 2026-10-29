import type { Access } from 'payload'

import { PERMISSIONS, userHasPermission } from './permissions.ts'

/**
 * Authenticated users can read all documents (including drafts).
 * Anonymous REST/Local API callers only see published documents.
 */
export const publishedOrAuthenticated: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}

/** Read / manage volunteer applications and related CVs (PII). */
export const canAccessVolunteerApplications: Access = ({ req: { user } }) =>
  userHasPermission(user, PERMISSIONS.viewVolunteerApplications)
