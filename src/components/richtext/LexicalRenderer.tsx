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
}

function isLexicalDocument(value: unknown): value is { root?: LexicalNode } {
  return Boolean(value && typeof value === 'object' && 'root' in (value as any))
}

function getTextAlign(node: LexicalNode): React.CSSProperties | undefined {
  const format = node.format
  if (!format || typeof format !== 'string') return undefined
  if (['left', 'start', 'center', 'right', 'end', 'justify'].includes(format)) {
    return { textAlign: format as any }
  }
  return undefined
}

function renderChildren(children?: LexicalNode[]) {
  if (!children || children.length === 0) return null
  return children.map((child, idx) => <React.Fragment key={idx}>{renderNode(child)}</React.Fragment>)
}

function renderNode(node: LexicalNode): React.ReactNode {
  const type = node.type

  if (type === 'text') {
    return node.text ?? ''
  }

  if (type === 'linebreak') return <br />

  if (type === 'paragraph') {
    return (
      <p className="mb-4 text-[14.5px] leading-relaxed text-[var(--muted)]" style={getTextAlign(node)}>
        {renderChildren(node.children)}
      </p>
    )
  }

  if (type === 'heading') {
    const Tag = (node.tag || 'h3') as React.ElementType
    return (
      <Tag className="mb-3 font-serif text-lg font-normal text-[var(--charcoal)]">
        {renderChildren(node.children)}
      </Tag>
    )
  }

  if (type === 'list') {
    const isOrdered = node.listType === 'number'
    const ListTag = (isOrdered ? 'ol' : 'ul') as 'ol' | 'ul'
    return (
      <ListTag
        className={isOrdered ? 'mb-4 list-decimal pl-5' : 'mb-4 list-disc pl-5'}
        style={{ color: 'var(--muted)' }}
      >
        {renderChildren(node.children)}
      </ListTag>
    )
  }

  if (type === 'listitem') {
    return (
      <li className="mb-1.5 text-[14.5px] leading-relaxed">
        {renderChildren(node.children)}
      </li>
    )
  }

  // Unknown node: fall back to rendering children
  return renderChildren(node.children)
}

export default function LexicalRenderer({ content }: { content: unknown }) {
  if (!isLexicalDocument(content) || !content.root) return null
  return <div>{renderNode(content.root)}</div>
}

