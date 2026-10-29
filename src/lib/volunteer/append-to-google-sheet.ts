import { GoogleAuth } from 'google-auth-library'

const DEFAULT_SPREADSHEET_ID = '1rxudCKPglKna9goCmpRzaOAwmVXX-Gjck_oxeywn9u0'
const DEFAULT_SHEET_TAB = 'test'
const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets'

export const volunteerApplicationSheetHeaders = [
  'Submitted at',
  'Application ID',
  'First name',
  'Last name',
  'Age',
  'Email',
  'Country of residence',
  'Nationality',
  'Phone',
  'Selected roles',
  'Relevant experience',
  'CV uploaded',
  'Medical graduation date',
  'Preferred start date',
  'Preferred end date',
  'Dates flexible',
  'Flexible from',
  'Flexible to',
  'Motivation',
  'Happy in stressful environment',
  'Good English level',
  'EU / Schengen resident',
  'Greece visa',
  'Visa comments',
  'Visa expiry date',
  'Greek',
  'Arabic',
  'Farsi',
  'Driving licence',
  'Driving licence (other)',
  'Comfortable driving 9-seat van',
  'How did you hear about us',
  'Project',
  'Locale',
] as const

export type VolunteerApplicationSheetRow = {
  applicationId: string
  submittedAt: string
  firstName: string
  lastName: string
  age: number
  email: string
  countryOfResidence: string
  nationality: string
  phone: string
  selectedRoles: string
  relevantExperience: string
  cvUploaded: boolean
  medicalGraduationDate: string
  preferredStartDate: string
  preferredEndDate: string
  datesFlexible: string
  flexibleFromDate: string
  flexibleToDate: string
  motivation: string
  happyStressfulEnvironment: string
  goodEnglishLevel: string
  euSchengenResident: string
  greeceVisa: string
  greeceVisaComments: string
  visaExpiryDate: string
  languageGreek: string
  languageArabic: string
  languageFarsi: string
  drivingLicence: string
  drivingLicenceOther: string
  comfortableDriving9SeatVan: string
  howDidYouHearAboutUs: string
  project: string
  locale: string
}

function getSheetsConfig(): {
  clientEmail: string
  privateKey: string
  spreadsheetId: string
  sheetTab: string
} | null {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL?.trim()
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n').trim()
  if (!clientEmail || !privateKey) return null

  return {
    clientEmail,
    privateKey,
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim() || DEFAULT_SPREADSHEET_ID,
    sheetTab: process.env.GOOGLE_SHEETS_TAB?.trim() || DEFAULT_SHEET_TAB,
  }
}

function quoteSheetTab(tab: string): string {
  return `'${tab.replace(/'/g, "''")}'`
}

function rowValues(row: VolunteerApplicationSheetRow): string[] {
  return [
    row.submittedAt,
    row.applicationId,
    row.firstName,
    row.lastName,
    String(row.age),
    row.email,
    row.countryOfResidence,
    row.nationality,
    row.phone,
    row.selectedRoles,
    row.relevantExperience,
    row.cvUploaded ? 'yes' : 'no',
    row.medicalGraduationDate,
    row.preferredStartDate,
    row.preferredEndDate,
    row.datesFlexible,
    row.flexibleFromDate,
    row.flexibleToDate,
    row.motivation,
    row.happyStressfulEnvironment,
    row.goodEnglishLevel,
    row.euSchengenResident,
    row.greeceVisa,
    row.greeceVisaComments,
    row.visaExpiryDate,
    row.languageGreek,
    row.languageArabic,
    row.languageFarsi,
    row.drivingLicence,
    row.drivingLicenceOther,
    row.comfortableDriving9SeatVan,
    row.howDidYouHearAboutUs,
    row.project,
    row.locale,
  ]
}

async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const auth = new GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: [SHEETS_SCOPE],
  })
  const client = await auth.getClient()
  const tokenResponse = await client.getAccessToken()
  const token = typeof tokenResponse === 'string' ? tokenResponse : tokenResponse?.token
  if (!token) throw new Error('Unable to obtain Google Sheets access token.')
  return token
}

async function sheetsFetch(url: string, token: string, init?: RequestInit): Promise<Response> {
  return fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
}

async function ensureHeaderRow(
  spreadsheetId: string,
  sheetTab: string,
  token: string,
): Promise<void> {
  const range = encodeURIComponent(`${quoteSheetTab(sheetTab)}!A1:AH1`)
  const getUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`
  const existing = await sheetsFetch(getUrl, token)
  if (!existing.ok) {
    throw new Error(`Failed to read sheet headers (${existing.status}).`)
  }

  const data = (await existing.json()) as { values?: string[][] }
  const firstCell = data.values?.[0]?.[0]?.trim()
  if (firstCell) return

  const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`
  const update = await sheetsFetch(updateUrl, token, {
    method: 'PUT',
    body: JSON.stringify({ values: [[...volunteerApplicationSheetHeaders]] }),
  })
  if (!update.ok) {
    throw new Error(`Failed to write sheet headers (${update.status}).`)
  }
}

/**
 * Appends a volunteer application row to the configured Google Sheet.
 * No-ops when credentials are not configured.
 */
export async function appendVolunteerApplicationToGoogleSheet(
  row: VolunteerApplicationSheetRow,
): Promise<'appended' | 'skipped'> {
  const config = getSheetsConfig()
  if (!config) return 'skipped'

  const token = await getAccessToken(config.clientEmail, config.privateKey)
  await ensureHeaderRow(config.spreadsheetId, config.sheetTab, token)

  const range = encodeURIComponent(`${quoteSheetTab(config.sheetTab)}!A:AH`)
  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`
  const response = await sheetsFetch(appendUrl, token, {
    method: 'POST',
    body: JSON.stringify({ values: [rowValues(row)] }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Google Sheets append failed (${response.status}): ${body}`)
  }

  return 'appended'
}
