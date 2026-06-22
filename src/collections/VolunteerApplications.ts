import type { CollectionConfig } from 'payload'
import {
  defaultVolunteerApplicationStatus,
  volunteerApplicationStatusOptions,
} from '../lib/volunteer/application-status.ts'

const yesNoOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
]

const languageLevelOptions = [
  { label: '—', value: '' },
  { label: 'Basic', value: 'basic' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Fluent', value: 'fluent' },
]

export const VolunteerApplications: CollectionConfig = {
  slug: 'volunteer-applications',
  labels: {
    singular: {
      en: 'Volunteer application',
      fr: 'Candidature bénévole',
    },
    plural: {
      en: 'Volunteer applications',
      fr: 'Candidatures bénévoles',
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: [
      'firstName',
      'lastName',
      'selectedRoles',
      'applicationStatus',
      'project',
      'preferredStartDate',
      'confirmedVolunteerRole',
    ],
    description: {
      en: 'Volunteer recruitment submissions from the website.',
      fr: 'Candidatures de recrutement bénévole reçues via le site.',
    },
    components: {
      beforeList: [
        '/src/components/admin/volunteer-applications/VolunteerApplicationsPlanning#VolunteerApplicationsPlanning',
      ],
    },
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    // ── Identity ──────────────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        { name: 'firstName', type: 'text', required: true, label: 'First name' },
        { name: 'lastName', type: 'text', required: true, label: 'Last name' },
      ],
    },
    { name: 'age', type: 'number', required: true, label: 'Age', min: 16, max: 99 },
    { name: 'email', type: 'email', required: true, label: 'Email' },
    {
      type: 'row',
      fields: [
        { name: 'countryOfResidence', type: 'text', required: true, label: 'Country of residence' },
        { name: 'nationality', type: 'text', required: true, label: 'Nationality' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phoneCountryCode', type: 'text', label: 'Phone country code' },
        { name: 'phone', type: 'text', label: 'Phone number' },
      ],
    },

    // ── Role selection ─────────────────────────────────────────────────────────
    {
      name: 'selectedRoles',
      type: 'relationship',
      relationTo: 'volunteer-needs',
      hasMany: true,
      label: 'Selected volunteer roles',
    },

    // ── Emergency contact ──────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Emergency contact',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'emergencyFirstName', type: 'text', label: 'First name' },
            { name: 'emergencyLastName', type: 'text', label: 'Last name' },
          ],
        },
        { name: 'emergencyRelation', type: 'text', label: 'Relationship' },
        {
          type: 'row',
          fields: [
            { name: 'emergencyPhoneCountryCode', type: 'text', label: 'Phone country code' },
            { name: 'emergencyPhone', type: 'text', label: 'Phone number' },
          ],
        },
      ],
    },

    // ── Experience ─────────────────────────────────────────────────────────────
    {
      name: 'relevantWorkAcademicExperience',
      type: 'textarea',
      label: 'Relevant work and academic experience',
    },
    { name: 'volunteerExperience', type: 'textarea', label: 'Volunteer experience' },
    { name: 'experienceWithRefugees', type: 'textarea', label: 'Experience working with refugees' },
    { name: 'otherExperience', type: 'textarea', label: 'Other experience' },
    {
      name: 'medicalGraduationDate',
      type: 'date',
      label: 'Graduation date (medical staff)',
      admin: { date: { pickerAppearance: 'monthOnly' } },
    },

    // ── Availability ───────────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'preferredStartDate',
          type: 'date',
          label: 'Preferred start date',
          admin: { date: { pickerAppearance: 'dayOnly' } },
        },
        {
          name: 'preferredEndDate',
          type: 'date',
          label: 'Preferred end date',
          admin: { date: { pickerAppearance: 'dayOnly' } },
        },
      ],
    },
    { name: 'motivation', type: 'textarea', required: true, label: 'Motivation' },

    // ── Work environment & personal qualities ───────────────────────────────────
    {
      name: 'happyStressfulEnvironment',
      type: 'select',
      label: 'Happy working in a stressful, chaotic and emotionally demanding environment',
      options: yesNoOptions,
    },
    {
      name: 'goodEnglishLevel',
      type: 'select',
      label: 'Good level of spoken English',
      options: yesNoOptions,
    },
    {
      name: 'euSchengenResident',
      type: 'select',
      label: 'EU / Schengen resident',
      options: yesNoOptions,
    },
    {
      name: 'greeceVisa',
      type: 'select',
      label: 'Visa allowing to volunteer in Greece (non-EU/Schengen)',
      options: yesNoOptions,
    },
    { name: 'greeceVisaComments', type: 'textarea', label: 'Visa comments' },
    {
      name: 'visaExpiryDate',
      type: 'date',
      label: 'Visa expiry date',
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'experienceWorkingAbroad',
      type: 'textarea',
      label: 'Experience working abroad',
    },

    // ── Languages ────────────────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'languageGreek',
          type: 'select',
          label: 'Greek',
          options: languageLevelOptions,
        },
        {
          name: 'languageArabic',
          type: 'select',
          label: 'Arabic',
          options: languageLevelOptions,
        },
        {
          name: 'languageFarsi',
          type: 'select',
          label: 'Farsi',
          options: languageLevelOptions,
        },
      ],
    },

    // ── Driving licence ─────────────────────────────────────────────────────────
    {
      name: 'drivingLicence',
      type: 'select',
      label: 'B-Driving licence',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
        { label: 'Other', value: 'other' },
      ],
    },
    { name: 'drivingLicenceOther', type: 'text', label: 'Driving licence (other)' },

    // ── Referral ─────────────────────────────────────────────────────────────────
    {
      name: 'howDidYouHearAboutUs',
      type: 'textarea',
      label: 'How did you hear about us?',
    },

    {
      name: 'applicationStatus',
      type: 'select',
      label: {
        en: 'Status',
        fr: 'Statut',
      },
      required: true,
      defaultValue: defaultVolunteerApplicationStatus,
      options: [...volunteerApplicationStatusOptions],
      admin: {
        position: 'sidebar',
        description: {
          en: 'Internal tracking: Confirmed, In discussion, Canceled or Not confirmed.',
          fr: "Suivi interne : Confirmé, En cours d'échange, Annulé ou Non confirmé.",
        },
      },
    },
    {
      name: 'confirmedVolunteerRole',
      type: 'relationship',
      relationTo: 'volunteer-needs',
      label: {
        en: 'Confirmed volunteer role',
        fr: 'Rôle bénévole confirmé',
      },
      admin: {
        position: 'sidebar',
        description: {
          en: 'Role retained once the application is confirmed.',
          fr: 'Rôle retenu une fois la candidature confirmée.',
        },
      },
    },
    {
      type: 'row',
      admin: { position: 'sidebar' },
      fields: [
        {
          name: 'confirmedStartDate',
          type: 'date',
          label: {
            en: 'Confirmed presence — start',
            fr: 'Présence confirmée — début',
          },
          admin: {
            date: { pickerAppearance: 'dayOnly' },
            description: {
              en: 'Actual dates once the application is confirmed.',
              fr: 'Dates réelles une fois la candidature confirmée.',
            },
          },
        },
        {
          name: 'confirmedEndDate',
          type: 'date',
          label: {
            en: 'Confirmed presence — end',
            fr: 'Présence confirmée — fin',
          },
          admin: { date: { pickerAppearance: 'dayOnly' } },
        },
      ],
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
      label: 'Project',
      admin: { position: 'sidebar' },
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
      admin: { position: 'sidebar' },
    },
  ],
}
