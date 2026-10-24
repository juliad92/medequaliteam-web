import type { CollectionConfig } from 'payload'
import { canAccessVolunteerApplications } from '../lib/access.ts'

const cvStaticDir =
  process.env.VERCEL || process.env.BLOB_READ_WRITE_TOKEN?.trim()
    ? undefined
    : 'storage/volunteer-cvs'

export const VolunteerCVs: CollectionConfig = {
  slug: 'volunteer-cvs',
  labels: {
    singular: {
      en: 'Volunteer CV',
      fr: 'CV bénévole',
    },
    plural: {
      en: 'Volunteer CVs',
      fr: 'CV bénévoles',
    },
  },
  admin: {
    hidden: true,
    description: {
      en: 'CVs uploaded with volunteer applications. Visible from each application.',
      fr: 'CV envoyés avec les candidatures bénévoles. Visibles depuis chaque candidature.',
    },
  },
  access: {
    read: canAccessVolunteerApplications,
    create: canAccessVolunteerApplications,
    update: canAccessVolunteerApplications,
    delete: canAccessVolunteerApplications,
  },
  fields: [],
  upload: {
    ...(cvStaticDir ? { staticDir: cvStaticDir } : {}),
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    crop: false,
    displayPreview: true,
  },
}
