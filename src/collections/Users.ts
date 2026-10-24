import type { CollectionConfig, FieldAccess } from 'payload'

import { isAdminUser, permissionOptions } from '../lib/permissions.ts'

const adminOnlyField: FieldAccess = ({ req: { user } }) => isAdminUser(user)

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'permissions'],
  },
  auth: true,
  access: {
    read: ({ req: { user } }) => Boolean(user),
    // First user is created via Payload Local API (overrideAccess).
    create: ({ req: { user } }) => isAdminUser(user),
    update: ({ req: { user }, id }) => {
      if (!user) return false
      if (isAdminUser(user)) return true
      return String(user.id) === String(id)
    },
    delete: ({ req: { user } }) => isAdminUser(user),
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        {
          label: { en: 'Administrator', fr: 'Administrateur' },
          value: 'admin',
        },
        {
          label: { en: 'Editor', fr: 'Éditeur' },
          value: 'editor',
        },
      ],
      label: { en: 'Role', fr: 'Rôle' },
      admin: {
        description: {
          en: 'Administrators can access all sensitive data and manage user rights. Editors need explicit permissions below.',
          fr: 'Les administrateurs accèdent à toutes les données sensibles et gèrent les droits. Les éditeurs ont besoin des permissions ci-dessous.',
        },
      },
      access: {
        create: adminOnlyField,
        update: adminOnlyField,
      },
    },
    {
      name: 'permissions',
      type: 'select',
      hasMany: true,
      options: [...permissionOptions],
      label: { en: 'Permissions', fr: 'Permissions' },
      admin: {
        description: {
          en: 'Sensitive-data rights for editors. Administrators already have every permission.',
          fr: 'Droits sur les données sensibles pour les éditeurs. Les administrateurs ont déjà tous les droits.',
        },
        condition: (_, siblingData) => siblingData?.role === 'editor',
      },
      access: {
        create: adminOnlyField,
        update: adminOnlyField,
      },
    },
  ],
}
