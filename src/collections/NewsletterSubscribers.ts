import type { CollectionConfig } from 'payload'

export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  labels: {
    singular: {
      en: 'Newsletter subscriber',
      fr: 'Abonné newsletter',
    },
    plural: {
      en: 'Newsletter subscribers',
      fr: 'Abonnés newsletter',
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'email', 'locale', 'createdAt'],
    description: {
      en: 'Newsletter sign-ups from the website.',
      fr: 'Inscriptions à la newsletter reçues via le site.',
    },
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
      label: {
        en: 'First name',
        fr: 'Prénom',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      label: {
        en: 'Email',
        fr: 'E-mail',
      },
    },
    {
      name: 'locale',
      type: 'select',
      required: true,
      defaultValue: 'en',
      options: [
        { label: 'English', value: 'en' },
        { label: 'Français', value: 'fr' },
      ],
      label: {
        en: 'Locale',
        fr: 'Langue',
      },
      admin: { position: 'sidebar' },
    },
  ],
}
