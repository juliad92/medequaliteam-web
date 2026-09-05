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
    defaultColumns: ['firstName', 'email', 'pixelTrackingConsent', 'locale', 'createdAt'],
    description: {
      en: 'Newsletter sign-ups from the website.',
      fr: 'Inscriptions à la newsletter reçues via le site.',
    },
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    // Public sign-ups go through /api/newsletter (Local API bypasses access).
    create: () => false,
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
      name: 'pixelTrackingConsent',
      type: 'checkbox',
      defaultValue: false,
      label: {
        en: 'Pixel tracking consent',
        fr: 'Consentement au suivi par pixel',
      },
      admin: {
        description: {
          en: 'Whether the subscriber agreed to tracking pixels in newsletter emails.',
          fr: 'Indique si l’abonné a accepté le suivi par pixel dans les e-mails de newsletter.',
        },
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
