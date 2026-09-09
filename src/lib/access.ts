import type { Access } from 'payload'

/**
 * Authenticated users can read all documents (including drafts).
 * Anonymous REST/Local API callers only see published documents.
 */
export const publishedOrAuthenticated: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}
