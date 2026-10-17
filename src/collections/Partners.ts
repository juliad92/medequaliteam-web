import type { CollectionConfig } from 'payload'
import {
  revalidatePartnerAfterChange,
  revalidatePartnerAfterDelete,
} from '../lib/cms-revalidate.ts'

export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: {
    singular: {
      en: 'Partner',
      fr: 'Partenaire',
    },
    plural: {
      en: 'Partners',
      fr: 'Partenaires',
    },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'dateStart', 'dateEnd', 'updatedAt'],
    description: {
      en: 'Organisation partners shown in the homepage logo banner (active partners only).',
      fr: 'Partenaires affichés dans le bandeau de logos de la page d’accueil (partenaires actifs uniquement).',
    },
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [revalidatePartnerAfterChange],
    afterDelete: [revalidatePartnerAfterDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: {
        en: 'Company name',
        fr: 'Nom de l’entreprise',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: {
        en: 'Logo',
        fr: 'Logo',
      },
      admin: {
        description: {
          en: 'Prefer a transparent PNG or SVG-style logo on a clean background.',
          fr: 'Préférez un logo PNG transparent ou un logo net sur fond clair.',
        },
      },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      label: {
        en: 'Website URL',
        fr: 'URL du site',
      },
      admin: {
        description: {
          en: 'Full URL, e.g. https://example.com',
          fr: 'URL complète, p. ex. https://example.com',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: { en: 'Active', fr: 'Actif' }, value: 'active' },
        { label: { en: 'Inactive', fr: 'Inactif' }, value: 'inactive' },
      ],
      label: {
        en: 'Partnership status',
        fr: 'Statut du partenariat',
      },
      admin: { position: 'sidebar' },
    },
    {
      name: 'dateStart',
      type: 'date',
      label: {
        en: 'Partnership start',
        fr: 'Début du partenariat',
      },
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'dateEnd',
      type: 'date',
      label: {
        en: 'Partnership end',
        fr: 'Fin du partenariat',
      },
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
        description: {
          en: 'Leave empty while the partnership is ongoing.',
          fr: 'Laisser vide si le partenariat est en cours.',
        },
      },
    },
  ],
}
