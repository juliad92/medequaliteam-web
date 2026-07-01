import type { CollectionConfig, Block } from 'payload'

const mediaStaticDir =
  process.env.VERCEL || process.env.BLOB_READ_WRITE_TOKEN?.trim()
    ? undefined
    : 'public/media'

// ─── Reusable content blocks ────────────────────────────────────────────────

const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero section', plural: 'Hero sections' },
  fields: [
    { name: 'heading', type: 'text', required: true, localized: true },
    { name: 'subheading', type: 'text', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'ctas',
      type: 'array',
      label: 'Call-to-action buttons',
      maxRows: 2,
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'url', type: 'text', required: true },
        {
          name: 'variant',
          type: 'select',
          options: [
            { label: 'Primary (green)', value: 'primary' },
            { label: 'Secondary (outline)', value: 'secondary' },
          ],
          defaultValue: 'primary',
        },
      ],
    },
  ],
}

const RichTextBlock: Block = {
  slug: 'rich-text',
  labels: { singular: 'Rich text', plural: 'Rich text blocks' },
  fields: [{ name: 'content', type: 'richText', required: true, localized: true }],
}

const StatsBlock: Block = {
  slug: 'stats',
  labels: { singular: 'Stats bar', plural: 'Stats bars' },
  fields: [
    {
      name: 'stats',
      type: 'array',
      required: true,
      maxRows: 5,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true, localized: true },
      ],
    },
  ],
}

const MediaBlock: Block = {
  slug: 'media-block',
  labels: { singular: 'Image / video', plural: 'Images & videos' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'caption', type: 'text', localized: true },
  ],
}

const CallToActionBlock: Block = {
  slug: 'cta',
  labels: { singular: 'Call to action', plural: 'Calls to action' },
  fields: [
    { name: 'heading', type: 'text', required: true, localized: true },
    { name: 'body', type: 'textarea', localized: true },
    { name: 'buttonLabel', type: 'text', required: true, localized: true },
    { name: 'buttonUrl', type: 'text', required: true },
    {
      name: 'style',
      type: 'select',
      options: [
        { label: 'Green (donation / action)', value: 'green' },
        { label: 'Dark (neutral)', value: 'dark' },
      ],
      defaultValue: 'green',
    },
  ],
}

// ─── Media collection ────────────────────────────────────────────────────────

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    description: 'All images, documents, and files used across the site.',
  },
  access: {
    read: () => true,
  },
  upload: {
    ...(mediaStaticDir ? { staticDir: mediaStaticDir } : {}),
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 800, height: 500, position: 'centre' },
      { name: 'hero', width: 1600, height: 900, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'application/pdf'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
      admin: { description: 'Describe the image for screen readers and SEO.' },
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
    },
  ],
}

// ─── Pages collection (block-based, for About / Legal / etc.) ───────────────

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'Flexible pages built with content blocks (About, Legal, Volunteer info, etc.).',
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'e.g. "about/organisation" or "volunteer"',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      blocks: [HeroBlock, RichTextBlock, StatsBlock, MediaBlock, CallToActionBlock],
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'title', type: 'text', localized: true, label: 'Meta title' },
        { name: 'description', type: 'textarea', localized: true, label: 'Meta description' },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Social share image' },
      ],
    },
  ],
}
