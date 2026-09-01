import type { CollectionConfig } from 'payload'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'project'],
    description: 'Current and past team members shown on the "Meet the team" page.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'e.g. "Field Coordinator" / "Coordinatrice terrain"' },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      label: 'Current / last project',
      admin: { position: 'sidebar' },
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Coordinator', value: 'coordinator' },
        { label: 'Medical volunteer', value: 'medical' },
        { label: 'Translator', value: 'translator' },
        { label: 'Admin / remote', value: 'admin' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 99,
      admin: {
        position: 'sidebar',
        description: 'Lower = shown first. Coordinators typically get 1–10.',
      },
    },
  ],
}

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'role', 'publishedAt', 'updatedAt'],
    description:
      'Volunteer stories and short quotes. Full stories appear on /volunteer/stories; featured quotes can appear on the Volunteer page.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'URL slug for the story page, e.g. "nurse" or "doctor".',
      },
    },
    {
      name: 'role',
      type: 'text',
      localized: true,
      admin: { description: 'e.g. "Nurse" / "Infirmière"' },
    },
    {
      name: 'location',
      type: 'text',
      localized: true,
      admin: { description: 'e.g. "Freiburg, Germany" / "Fribourg, Allemagne"' },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Short preview shown on the Volunteer stories listing (1–2 sentences).',
      },
    },
    {
      name: 'intro',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Opening paragraph on the story detail page.',
      },
    },
    {
      name: 'sections',
      type: 'array',
      labels: { singular: 'Q&A section', plural: 'Q&A sections' },
      admin: {
        description: 'Interview questions and answers shown on the story page.',
      },
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description:
          'Pull quote highlighted on the story page (also usable as a short testimonial).',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
        description: 'Controls the display date and sort order on the stories listing.',
      },
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Show on Volunteer page',
      admin: { position: 'sidebar' },
    },
  ],
}
