import type { CollectionConfig } from 'payload'

export const DonationInquiries: CollectionConfig = {
  slug: 'donation-inquiries',
  labels: {
    singular: 'Donation inquiry',
    plural: 'Donation inquiries',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'lastName', 'email', 'country', 'createdAt'],
    description: 'Transnational Giving Europe donation requests from the website.',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'firstName', type: 'text', required: true, label: 'First name' },
        { name: 'lastName', type: 'text', required: true, label: 'Last name' },
      ],
    },
    { name: 'email', type: 'email', required: true, label: 'Email' },
    { name: 'country', type: 'text', required: true, label: 'Country of residence' },
    { name: 'locale', type: 'select', options: ['en', 'fr'], defaultValue: 'en' },
  ],
}
