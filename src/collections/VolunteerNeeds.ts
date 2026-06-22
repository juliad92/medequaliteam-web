import type { CollectionConfig } from 'payload'

export const VolunteerNeeds: CollectionConfig = {
  slug: 'volunteer-needs',
  labels: {
    singular: 'Volunteer need',
    plural: 'Volunteer needs',
  },
  admin: {
    useAsTitle: 'roleName',
    defaultColumns: ['roleName', 'project', 'duration', 'updatedAt'],
    description: 'Open volunteer roles linked to field projects (e.g. medical coordinator, nurse).',
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'roleName',
      type: 'text',
      required: true,
      localized: true,
      label: 'Role name',
      admin: {
        description: 'e.g. "Medical coordinator" / "Coordinateur·rice médical·e"',
      },
    },
    {
      name: 'roleCategory',
      type: 'select',
      required: true,
      localized: true,
      label: 'Role category',
      options: [
        { label: 'Doctor', value: 'doctor' },
        { label: 'Nurse', value: 'nurse' },
        { label: 'Helper', value: 'helper' },
      ],
      admin: {
        description: 'Doctor/Nurse/Helper',
      },
    },
    {
      name: 'duration',
      type: 'text',
      localized: true,
      label: 'Duration',
      admin: {
        description: 'Optional. e.g. "6 months" / "6 mois"',
        position: 'sidebar',
      },
    },
    {
      name: 'jobDescription',
      type: 'richText',
      required: true,
      localized: true,
      label: 'Job description',
    },
    {
      name: 'requiredExperienceAndSkills',
      type: 'richText',
      required: true,
      localized: true,
      label: 'Required experience and skills',
    },
    {
      name: 'desiredExperienceAndSkills',
      type: 'richText',
      localized: true,
      label: 'Desired experience and skills',
    },
    {
      name: 'furtherInformation',
      type: 'richText',
      localized: true,
      label: 'Further information',
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
      label: 'Project',
      admin: { position: 'sidebar' },
    },
  ],
}
