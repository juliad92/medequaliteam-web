type LexicalTextNode = {
  type: 'text'
  text: string
  format?: number
  detail?: number
  mode?: 'normal'
  style?: string
  version: 1
}

type LexicalElementNode = {
  type: string
  children: LexicalNode[]
  version: 1
  indent: number
  format: string
  direction: 'ltr' | 'rtl' | null
  tag?: string
  listType?: 'bullet' | 'number'
  start?: number
  value?: number
}

type LexicalNode = LexicalTextNode | LexicalElementNode

const FORMAT_BOLD = 1
const FORMAT_ITALIC = 2

function elementDefaults(): Pick<LexicalElementNode, 'indent' | 'format' | 'direction' | 'version'> {
  return {
    indent: 0,
    format: '',
    direction: null,
    version: 1,
  }
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
}

function stripTags(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
}

function parseInline(html: string): LexicalTextNode[] {
  const nodes: LexicalTextNode[] = []
  const pattern = /(<\/?(?:b|strong|i|em|br\s*\/?)>)/gi
  let format = 0
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(html)) !== null) {
    const text = decodeHtmlEntities(html.slice(lastIndex, match.index))
    if (text) {
      nodes.push({
        type: 'text',
        text,
        detail: 0,
        mode: 'normal',
        style: '',
        ...(format ? { format } : { format: 0 }),
        version: 1,
      })
    }

    const tag = match[1].toLowerCase()
    if (tag.startsWith('<b') || tag.startsWith('<strong')) format |= FORMAT_BOLD
    else if (tag.startsWith('</b') || tag.startsWith('</strong')) format &= ~FORMAT_BOLD
    else if (tag.startsWith('<i') || tag.startsWith('<em')) format |= FORMAT_ITALIC
    else if (tag.startsWith('</i') || tag.startsWith('</em')) format &= ~FORMAT_ITALIC
    else if (tag.startsWith('<br')) {
      nodes.push({
        type: 'text',
        text: '\n',
        detail: 0,
        mode: 'normal',
        style: '',
        format: 0,
        version: 1,
      })
    }

    lastIndex = match.index + match[0].length
  }

  const trailing = decodeHtmlEntities(html.slice(lastIndex))
  if (trailing) {
    nodes.push({
      type: 'text',
      text: trailing,
      detail: 0,
      mode: 'normal',
      style: '',
      ...(format ? { format } : { format: 0 }),
      version: 1,
    })
  }

  return nodes.length > 0
    ? nodes
    : [{ type: 'text', text: '', detail: 0, mode: 'normal', style: '', format: 0, version: 1 }]
}

function paragraphFromHtml(html: string): LexicalElementNode | null {
  const children = parseInline(html)
  const text = children.map((node) => node.text).join('')
  if (!text.trim()) return null

  return {
    type: 'paragraph',
    children,
    ...elementDefaults(),
  }
}

function listItemFromHtml(html: string, value: number): LexicalElementNode {
  const nestedListMatch = html.match(/<ul[^>]*>([\s\S]*)<\/ul>/i)
  const children: LexicalNode[] = []

  if (nestedListMatch) {
    const before = html.slice(0, nestedListMatch.index ?? 0)
    const paragraph = paragraphFromHtml(before)
    if (paragraph) children.push(paragraph)
    children.push(parseList(nestedListMatch[1], 'bullet'))
  } else {
    const paragraph = paragraphFromHtml(html)
    if (paragraph) children.push(paragraph)
  }

  if (children.length === 0) {
    children.push({
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text: stripTags(html),
          detail: 0,
          mode: 'normal',
          style: '',
          format: 0,
          version: 1,
        },
      ],
      ...elementDefaults(),
    })
  }

  return {
    type: 'listitem',
    children,
    value,
    ...elementDefaults(),
  }
}

function parseList(html: string, listType: 'bullet' | 'number'): LexicalElementNode {
  const items: LexicalElementNode[] = []
  const itemPattern = /<li[^>]*>([\s\S]*?)<\/li>/gi
  let match: RegExpExecArray | null
  let value = 1

  while ((match = itemPattern.exec(html)) !== null) {
    items.push(listItemFromHtml(match[1], value))
    value += 1
  }

  return {
    type: 'list',
    listType,
    tag: listType === 'number' ? 'ol' : 'ul',
    start: 1,
    children: items,
    ...elementDefaults(),
  }
}

function parseBlockNodes(html: string): LexicalNode[] {
  const nodes: LexicalNode[] = []
  const blockPattern = /<(p|ul|ol)(?:\s[^>]*)?>([\s\S]*?)<\/\1>|<br\s*\/?>/gi
  let match: RegExpExecArray | null
  let lastIndex = 0

  while ((match = blockPattern.exec(html)) !== null) {
    const between = html.slice(lastIndex, match.index).trim()
    if (between) {
      const paragraph = paragraphFromHtml(between)
      if (paragraph) nodes.push(paragraph)
    }

    const tag = match[1]?.toLowerCase()
    if (!tag) {
      nodes.push({
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: '\n',
            detail: 0,
            mode: 'normal',
            style: '',
            format: 0,
            version: 1,
          },
        ],
        ...elementDefaults(),
      })
    } else if (tag === 'p') {
      const paragraph = paragraphFromHtml(match[2])
      if (paragraph) nodes.push(paragraph)
    } else if (tag === 'ul') {
      nodes.push(parseList(match[2], 'bullet'))
    } else if (tag === 'ol') {
      nodes.push(parseList(match[2], 'number'))
    }

    lastIndex = match.index + match[0].length
  }

  const trailing = html.slice(lastIndex).trim()
  if (trailing) {
    const paragraph = paragraphFromHtml(trailing)
    if (paragraph) nodes.push(paragraph)
  }

  return nodes
}

export function lexicalDocument(children: LexicalNode[]) {
  return {
    root: {
      type: 'root',
      children:
        children.length > 0
          ? children
          : [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: '',
                    detail: 0,
                    mode: 'normal' as const,
                    style: '',
                    format: 0,
                    version: 1 as const,
                  },
                ],
                ...elementDefaults(),
              },
            ],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1 as const,
    },
  }
}

export function lexicalParagraph(text: string) {
  return lexicalDocument([
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text,
          detail: 0,
          mode: 'normal',
          style: '',
          format: 0,
          version: 1,
        },
      ],
      ...elementDefaults(),
    },
  ])
}

export function htmlToLexical(html: string) {
  const cleaned = html.replace(/<p>\s*<\/p>/gi, '').trim()
  if (!cleaned) return lexicalParagraph('')

  const children = parseBlockNodes(cleaned).filter(Boolean)
  if (children.length === 0) {
    return lexicalParagraph(stripTags(cleaned))
  }

  return lexicalDocument(children)
}
