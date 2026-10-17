/**
 * ISR window for public CMS-backed marketing pages (seconds).
 * Keep in sync with `export const revalidate = 300` on
 * `src/app/(frontend)/[locale]/layout.tsx` (must be a numeric literal for Next.js).
 */
export const MARKETING_REVALIDATE_SECONDS = 300

/** Tags for `unstable_cache` / `revalidateTag` (CMS hooks in `cms-revalidate.ts`). */
export const CACHE_TAGS = {
  projectsNav: 'projects-nav',
  volunteerNav: 'volunteer-nav',
} as const
