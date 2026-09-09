import type { GlobalConfig } from 'payload'

// ─── Homepage ─────────────────────────────────────────────────────────────────

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  admin: {
    description: 'Editable content for the homepage hero, mission statement, and featured project.',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
          localized: true,
          defaultValue: "Med'EqualiTeam",
        },
        {
          name: 'tagline',
          type: 'text',
          required: true,
          localized: true,
          defaultValue: 'Caring for people on the move',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          // required: true,
        },
        {
          name: 'primaryCta',
          type: 'group',
          label: 'Primary button',
          fields: [
            { name: 'label', type: 'text', defaultValue: 'Donate', localized: true },
            { name: 'url', type: 'text', defaultValue: '/donate' },
          ],
        },
        {
          name: 'secondaryCta',
          type: 'group',
          label: 'Secondary button',
          fields: [
            { name: 'label', type: 'text', defaultValue: 'Volunteer with us', localized: true },
            { name: 'url', type: 'text', defaultValue: '/volunteer' },
          ],
        },
      ],
    },
    {
      name: 'impactStats',
      type: 'array',
      label: 'Impact numbers (shown below the hero)',
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
      name: 'mission',
      type: 'group',
      label: 'Our mission section',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Photo',
          admin: {
            description: 'Displayed in the "Our mission" section on the homepage.',
          },
        },
        {
          name: 'missionText',
          type: 'richText',
          localized: true,
          label: 'Mission statement (shown after stats)',
        },
      ],
    },
    {
      name: 'featuredProject',
      type: 'relationship',
      relationTo: 'projects',
      label: 'Featured project (shown on homepage)',
    },
  ],
}
