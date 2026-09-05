'use client'

import React from 'react'

type LexicalNode = {
  type?: string
  children?: LexicalNode[]
  text?: string
  tag?: string
  listType?: 'bullet' | 'number'
  value?: number
  format?: number | string
  url?: string
  fields?: { url?: string; newTab?: boolean; linkType?: string; doc?: unknown }
}

type Section = {
  heading: LexicalNode | null
  nodes: LexicalNode[]
}

const IS_BOLD = 1
const IS_ITALIC = 2
const IS_STRIKETHROUGH = 4
const IS_UNDERLINE = 8
const IS_CODE = 16

const HEADING_CLASS: Record<string, string> = {
  h1: 'mt-0 mb-4 font-serif text-[clamp(26px,3vw,32px)] leading-snug font-normal text-[var(--charcoal)]',
  h2: 'mt-0 mb-4 font-serif text-[clamp(22px,2.5vw,26px)] leading-snug font-normal text-[var(--charcoal)]',
  h3: 'mt-0 mb-3 font-serif text-[20px] leading-snug font-normal text-[var(--charcoal)]',
  h4: 'mt-0 mb-2 text-[13px] font-medium tracking-[0.12em] text-[var(--green)] uppercase',
}

function isLexicalDocument(value: unknown): value is { root?: LexicalNode } {
  return Boolean(value && typeof value === 'object' && 'root' in (value as object))
}

function getTextAlign(node: LexicalNode): React.CSSProperties | undefined {
  const format = node.format
  if (!format || typeof format !== 'string') return undefined
  if (['left', 'start', 'center', 'right', 'end', 'justify'].includes(format)) {
    return { textAlign: format as React.CSSProperties['textAlign'] }
  }
  return undefined
}

function getLinkHref(node: LexicalNode): string | null {
  if (node.url) return node.url
  if (node.fields?.url) return node.fields.url
  return null
}

function isSectionBreak(node: LexicalNode, preferH2: boolean): boolean {
  if (node.type !== 'heading') return false
  const tag = node.tag || 'h3'
  if (preferH2) return tag === 'h1' || tag === 'h2'
  return tag === 'h1' || tag === 'h2' || tag === 'h3'
}

function groupIntoSections(root: LexicalNode): Section[] {
  const children = root.children ?? []
  const preferH2 = children.some(
    (child) => child.type === 'heading' && (child.tag === 'h1' || child.tag === 'h2'),
  )
  const sections: Section[] = []
  let current: Section = { heading: null, nodes: [] }

  for (const child of children) {
    if (isSectionBreak(child, preferH2)) {
      if (current.heading || current.nodes.length > 0) sections.push(current)
      current = { heading: child, nodes: [] }
    } else {
      current.nodes.push(child)
    }
  }

  if (current.heading || current.nodes.length > 0) sections.push(current)
  return sections
}

function renderTextNode(node: LexicalNode): React.ReactNode {
  let content: React.ReactNode = node.text ?? ''
  const format = typeof node.format === 'number' ? node.format : 0

  if (format & IS_CODE) {
    content = (
      <code className="rounded bg-[var(--cream)] px-1.5 py-0.5 text-[0.92em] text-[var(--charcoal)]">
        {content}
      </code>
    )
  }
  if (format & IS_BOLD) content = <strong className="font-semibold text-[var(--charcoal)]">{content}</strong>
  if (format & IS_ITALIC) content = <em>{content}</em>
  if (format & IS_UNDERLINE) content = <span className="underline">{content}</span>
  if (format & IS_STRIKETHROUGH) content = <s>{content}</s>

  return content
}

function renderChildren(children?: LexicalNode[]) {
  if (!children || children.length === 0) return null
  return children.map((child, idx) => (
    <React.Fragment key={idx}>{renderNode(child)}</React.Fragment>
  ))
}

function hasTextContent(nodes?: LexicalNode[]): boolean {
  if (!nodes?.length) return false
  return nodes.some((n) => {
    if (n.type === 'text') return Boolean(n.text?.trim())
    if (n.type === 'linebreak') return true
    return hasTextContent(n.children)
  })
}

function renderNode(node: LexicalNode): React.ReactNode {
  const type = node.type

  if (type === 'text') return renderTextNode(node)
  if (type === 'linebreak') return <br />

  if (type === 'link' || type === 'autolink') {
    const href = getLinkHref(node)
    if (!href) return renderChildren(node.children)
    const newTab = node.fields?.newTab
    return (
      <a
        href={href}
        className="font-medium text-[var(--green)] underline-offset-2 hover:underline"
        {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {renderChildren(node.children)}
      </a>
    )
  }

  if (type === 'paragraph') {
    if (!hasTextContent(node.children)) return <div className="mb-3 h-2" aria-hidden />
    return (
      <p
        className="mb-4 text-[17px] leading-[1.7] text-[var(--muted)] last:mb-0"
        style={getTextAlign(node)}
      >
        {renderChildren(node.children)}
      </p>
    )
  }

  if (type === 'heading') {
    const tag = (node.tag || 'h3') as keyof typeof HEADING_CLASS
    const Tag = (node.tag || 'h3') as React.ElementType
    return <Tag className={HEADING_CLASS[tag] ?? HEADING_CLASS.h3}>{renderChildren(node.children)}</Tag>
  }

  if (type === 'list') {
    const isOrdered = node.listType === 'number'
    const ListTag = (isOrdered ? 'ol' : 'ul') as 'ol' | 'ul'
    return (
      <ListTag
        className={
          isOrdered
            ? 'mb-5 list-decimal space-y-2 pl-5 marker:text-[var(--green)] last:mb-0'
            : 'mb-5 list-disc space-y-2 pl-5 marker:text-[var(--green)] last:mb-0'
        }
      >
        {renderChildren(node.children)}
      </ListTag>
    )
  }

  if (type === 'listitem') {
    return (
      <li className="pl-1 text-[17px] leading-[1.65] text-[var(--muted)]">
        {renderChildren(node.children)}
      </li>
    )
  }

  if (type === 'quote') {
    return (
      <blockquote className="mb-5 border-l-2 border-[var(--green)] pl-5 font-serif text-[18px] leading-relaxed text-[var(--charcoal)] italic last:mb-0">
        {renderChildren(node.children)}
      </blockquote>
    )
  }

  if (type === 'horizontalrule') {
    return <hr className="my-8 border-0 border-t border-[var(--border)]" />
  }

  return renderChildren(node.children)
}

function ArticleSection({ section }: { section: Section }) {
  if (!section.heading) {
    return <div className="max-w-[65ch]">{section.nodes.map((node, idx) => (
      <React.Fragment key={idx}>{renderNode(node)}</React.Fragment>
    ))}</div>
  }

  return (
    <section className="max-w-[65ch] border-t border-[var(--border)] pt-8 first:border-t-0 first:pt-0">
      {renderNode(section.heading)}
      <div className="mt-1">
        {section.nodes.map((node, idx) => (
          <React.Fragment key={idx}>{renderNode(node)}</React.Fragment>
        ))}
      </div>
    </section>
  )
}

export default function LexicalRenderer({
  content,
  variant = 'default',
}: {
  content: unknown
  /** `article` groups H2 sections with clear visual breaks for long project pages. */
  variant?: 'default' | 'article'
}) {
  if (!isLexicalDocument(content) || !content.root) return null

  if (variant === 'article') {
    const sections = groupIntoSections(content.root)
    if (sections.length === 0) return null
    return (
      <div className="space-y-8">
        {sections.map((section, idx) => (
          <ArticleSection key={idx} section={section} />
        ))}
      </div>
    )
  }

  return <div className="max-w-[65ch]">{renderNode(content.root)}</div>
}
