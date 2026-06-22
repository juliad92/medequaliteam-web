export const E2E = {
  projectSlug: 'e2e-volunteer-project',
  emptyProjectSlug: 'e2e-volunteer-empty',
  roleName: 'E2E Medical Nurse',
  roleCategory: 'nurse',
  adminEmail: process.env.E2E_ADMIN_EMAIL ?? 'e2e-admin@medequali.team',
  adminPassword: process.env.E2E_ADMIN_PASSWORD ?? 'E2E-Admin-Password-123!',
} as const

export const SEED_STATE_PATH = 'e2e/fixtures/seed-state.json'
