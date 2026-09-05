const MEDICAL_ROLE_PATTERN =
  /\b(medical|nurse|doctor|physician|midwife|clinical|médecin|infirmier|soignant|soignante|médecine)\b/i

/** Pure helper — safe to import from client components. */
export function isMedicalVolunteerRole(roleName: string): boolean {
  return MEDICAL_ROLE_PATTERN.test(roleName)
}
