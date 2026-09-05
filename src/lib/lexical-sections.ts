type LexicalNode = {
  type?: string
  children?: LexicalNode[]
  text?: string
  tag?: string
}

export type ArticleNavSection = {
  id: string
  label: string
}

function isLexicalDocument(value: unknown): value is { root?: LexicalNode } {
  return Boolean(value && typeof value === 'object' && 'root' in (value as object))
}

function getPlainText(node: LexicalNode | null | undefined): string {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text
  if (!node.children?.length) return ''
  return node.children.map(getPlainText).join('')
}

export function slugifyHeading(label: string): string {
  const slug = label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'section'
}

function isSectionBreak(node: LexicalNode, preferH2: boolean): boolean {
  if (node.type !== 'heading') return false
  const tag = node.tag || 'h3'
  if (preferH2) return tag === 'h1' || tag === 'h2'
  return tag === 'h1' || tag === 'h2' || tag === 'h3'
}

/** Extract H2/H3 section headings from Lexical rich text for in-page navigation. */
export function extractArticleNavSections(content: unknown): ArticleNavSection[] {
  if (!isLexicalDocument(content) || !content.root) return []

  const children = content.root.children ?? []
  const preferH2 = children.some(
    (child) => child.type === 'heading' && (child.tag === 'h1' || child.tag === 'h2'),
  )

  const usedIds = new Map<string, number>()
  const sections: ArticleNavSection[] = []

  for (const child of children) {
    if (!isSectionBreak(child, preferH2)) continue
    const label = getPlainText(child).trim()
    if (!label) continue

    const base = slugifyHeading(label)
    const count = usedIds.get(base) ?? 0
    usedIds.set(base, count + 1)
    const id = count === 0 ? base : `${base}-${count + 1}`

    sections.push({ id, label })
  }

  return sections
}
