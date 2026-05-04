import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'status', 'updatedAt'],
    description: "Medical projects run by Med'EqualiTeam on the ground.",
  },
  access: {
    read: () => true, // public
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
      admin: {
        description: 'Name of the project (e.g. "Medical help in Northern Greece")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description:
          'URL-friendly identifier (e.g. "northern-greece-2024"). Do not change after publishing.',
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Past', value: 'past' },
        { label: 'Upcoming', value: 'upcoming' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      admin: {
        description: 'City / country (e.g. "Thessaloniki, Greece")',
        position: 'sidebar',
      },
    },
    {
      name: 'dateStart',
      type: 'date',
      label: 'Start date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'monthOnly' } },
    },
    {
      name: 'dateEnd',
      type: 'date',
      label: 'End date (leave empty if ongoing)',
      admin: { position: 'sidebar', date: { pickerAppearance: 'monthOnly' } },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'summary',
      type: 'textarea',
      localized: true,
      required: true,
      admin: {
        description: '2–3 sentence summary shown on the Projects listing page.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
      admin: {
        description: 'Full project description shown on the project detail page.',
      },
    },
    {
      name: 'partners',
      type: 'array',
      label: 'Partner organisations',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'url', type: 'text', label: 'Website URL' },
        { name: 'logo', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Key impact numbers (shown as a stat bar)',
      maxRows: 4,
      fields: [
        { name: 'value', type: 'text', required: true, admin: { description: 'e.g. "80,000+"' } },
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          admin: { description: 'e.g. "Patients treated"' },
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Feature on homepage',
      admin: { position: 'sidebar' },
    },
  ],
}
