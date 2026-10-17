/**
 * Normalize Payload Lexical JSON so the admin editor can parse it.
 *
 * Seeded / HTML-converted content sometimes omits `indent` on element nodes.
 * Lexical ListItemNode.setIndent() throws error #117 ("Invalid indent value.")
 * when `indent` is not a number.
 */

type LexicalNode = {
  type?: string
  indent?: unknown
  format?: unknown
  direction?: unknown
  version?: unknown
  value?: unknown
  checked?: unknown
  listType?: unknown
  tag?: unknown
  start?: unknown
  children?: LexicalNode[]
  [key: string]: unknown
}

type LexicalDocument = {
  root?: LexicalNode
  [key: string]: unknown
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function sanitizeNode(node: LexicalNode): LexicalNode {
  const next: LexicalNode = { ...node }

  if (typeof next.indent !== 'number' || !Number.isFinite(next.indent) || next.indent < 0) {
    next.indent = 0
  }

  if (next.format == null) {
    next.format = ''
  }

  if (!('direction' in next) || next.direction === undefined) {
    next.direction = null
  }

  if (next.type === 'listitem') {
    if (typeof next.value !== 'number' || !Number.isFinite(next.value)) {
      next.value = 1
    }
  }

  if (next.type === 'list') {
    if (typeof next.start !== 'number' || !Number.isFinite(next.start)) {
      next.start = 1
    }
    if (!next.tag) {
      next.tag = next.listType === 'number' ? 'ol' : 'ul'
    }
    if (!next.listType) {
      next.listType = next.tag === 'ol' ? 'number' : 'bullet'
    }
  }

  if (Array.isArray(next.children)) {
    next.children = next.children.map((child) =>
      isPlainObject(child) ? sanitizeNode(child as LexicalNode) : child,
    )
  }

  return next
}

/** Returns a sanitized copy of a Lexical document, or the original value if not Lexical-shaped. */
export function sanitizeLexicalDocument(value: unknown): unknown {
  if (!isPlainObject(value)) return value

  // Localized field shape before locale resolution: { en: { root }, fr: { root } }
  if (!isPlainObject(value.root)) {
    const localeEntries = Object.entries(value)
    const looksLocalized = localeEntries.every(
      ([, localeValue]) =>
        localeValue == null || (isPlainObject(localeValue) && isPlainObject(localeValue.root)),
    )
    if (looksLocalized && localeEntries.length > 0) {
      const next: Record<string, unknown> = { ...value }
      for (const [locale, localeValue] of localeEntries) {
        if (localeValue != null) next[locale] = sanitizeLexicalDocument(localeValue)
      }
      return next
    }
    return value
  }

  const doc = value as LexicalDocument
  return {
    ...doc,
    root: sanitizeNode(doc.root as LexicalNode),
  }
}

const VOLUNTEER_NEED_RICHTEXT_FIELDS = [
  'jobDescription',
  'requiredExperienceAndSkills',
  'desiredExperienceAndSkills',
  'furtherInformation',
] as const

export function sanitizeVolunteerNeedRichText<T extends Record<string, unknown>>(doc: T): T {
  const next = { ...doc }
  for (const field of VOLUNTEER_NEED_RICHTEXT_FIELDS) {
    if (field in next && next[field] != null) {
      ;(next as Record<string, unknown>)[field] = sanitizeLexicalDocument(next[field])
    }
  }
  return next
}
