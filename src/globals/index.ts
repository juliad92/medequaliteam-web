import type { GlobalConfig } from 'payload'

// ─── Navigation ──────────────────────────────────────────────────────────────

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: {
    description: 'Main navigation menu. Changes here affect the header on every page.',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Menu items',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Link (no dropdown)', value: 'link' },
            { label: 'Dropdown', value: 'dropdown' },
          ],
          defaultValue: 'link',
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData.type === 'link',
          },
        },
        {
          name: 'children',
          type: 'array',
          label: 'Dropdown items',
          admin: {
            condition: (data, siblingData) => siblingData.type === 'dropdown',
          },
          fields: [
            { name: 'label', type: 'text', required: true, localized: true },
            { name: 'url', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'donateCta',
      type: 'group',
      label: 'Donate button (always visible in navbar)',
      fields: [
        { name: 'label', type: 'text', defaultValue: 'Donate', localized: true },
        { name: 'url', type: 'text', defaultValue: '/donate' },
      ],
    },
  ],
}

// ─── Site Info ───────────────────────────────────────────────────────────────

export const SiteInfo: GlobalConfig = {
  slug: 'site-info',
  admin: {
    description: 'Contact details, social links, legal footer information.',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      defaultValue: 'info@medequali.team',
    },
    {
      name: 'address',
      type: 'text',
      defaultValue: '867 route de Dorjon, 74490 Megevette, France',
    },
    {
      name: 'charityNumber',
      type: 'text',
      label: 'Charity registration number',
      defaultValue: 'W102001158',
    },
    {
      name: 'socials',
      type: 'group',
      fields: [
        { name: 'facebook', type: 'text', defaultValue: 'https://facebook.com/MedEqualiTeam' },
        { name: 'twitter', type: 'text', label: 'Twitter / X' },
        { name: 'instagram', type: 'text' },
        { name: 'linkedin', type: 'text' },
      ],
    },
    {
      name: 'seoDefaults',
      type: 'group',
      label: 'Default SEO (used when a page has no custom meta)',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          defaultValue: "Med'EqualiTeam — Free healthcare for people on the move",
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          defaultValue:
            "Med'EqualiTeam is a medical NGO providing free primary health care for refugees and displaced populations.",
        },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}

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
