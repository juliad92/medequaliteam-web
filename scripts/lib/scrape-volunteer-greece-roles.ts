export const VOLUNTEER_GREECE_URL =
  'https://www.medequali.team/en/volunteer/volunteer_greece/'

export type ScrapedVolunteerRole = {
  roleName: string
  duration?: string
  jobDescriptionHtml: string
  requiredExperienceAndSkillsHtml: string
  desiredExperienceAndSkillsHtml?: string
  furtherInformationHtml?: string
}

const SECTION_HEADINGS = {
  jobDescription: 'Job description',
  requiredExperienceAndSkills: 'Required experience and skills',
  desiredExperienceAndSkills: 'Desired experience and skills',
  furtherInformation: 'Further information',
} as const

type SectionKey = keyof typeof SECTION_HEADINGS

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
}

export function parseRoleName(raw: string): { roleName: string; duration?: string } {
  const trimmed = decodeHtmlEntities(raw).replace(/\s+/g, ' ').trim()
  const match = trimmed.match(/^(.+?)\s*\((min\s+[^)]+)\)\s*$/i)
  if (match) {
    return { roleName: match[1].trim(), duration: match[2].trim() }
  }
  return { roleName: trimmed }
}

function parseRoleSections(cardBodyHtml: string): Partial<Record<SectionKey, string>> {
  const sections: Partial<Record<SectionKey, string>> = {}
  const sectionPattern = /<h3>([^<]+)<\/h3>\s*([\s\S]*?)(?=<h3>|$)/gi
  let match: RegExpExecArray | null

  while ((match = sectionPattern.exec(cardBodyHtml)) !== null) {
    const heading = decodeHtmlEntities(match[1]).trim()
    const content = match[2].trim()
    const entry = Object.entries(SECTION_HEADINGS).find(([, label]) => label === heading)
    const key = entry?.[0] as SectionKey | undefined
    if (key) sections[key] = content
  }

  return sections
}

export function parseVolunteerRolesFromHtml(html: string): ScrapedVolunteerRole[] {
  const accordionMatch = html.match(/<div id="accordion"[\s\S]*?<\/div>\s*<script type="text\/javascript">/i)
  if (!accordionMatch) {
    throw new Error('Could not find volunteer roles accordion on the page.')
  }

  const accordionHtml = accordionMatch[0]
  const rolePattern =
    /<div class="card-header"[\s\S]*?<span style="font-family: 'Abel', sans-serif;">\s*&nbsp;([^<]+)\s*<\/span>[\s\S]*?<div class="card-body">\s*([\s\S]*?)<\/div>\s*<\/div>/gi

  const roles: ScrapedVolunteerRole[] = []
  let match: RegExpExecArray | null

  while ((match = rolePattern.exec(accordionHtml)) !== null) {
    const { roleName, duration } = parseRoleName(match[1])
    const sections = parseRoleSections(match[2])

    const jobDescriptionHtml = sections.jobDescription?.trim()
    const requiredExperienceAndSkillsHtml = sections.requiredExperienceAndSkills?.trim()

    if (!jobDescriptionHtml || !requiredExperienceAndSkillsHtml) {
      throw new Error(`Missing required sections for role "${roleName}".`)
    }

    roles.push({
      roleName,
      duration,
      jobDescriptionHtml,
      requiredExperienceAndSkillsHtml,
      desiredExperienceAndSkillsHtml: sections.desiredExperienceAndSkills?.trim(),
      furtherInformationHtml: sections.furtherInformation?.trim(),
    })
  }

  if (roles.length === 0) {
    throw new Error('No volunteer roles found in the page accordion.')
  }

  return roles
}

export async function scrapeVolunteerGreeceRoles(
  url: string = VOLUNTEER_GREECE_URL,
): Promise<ScrapedVolunteerRole[]> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'medequaliteam-web/seed-volunteer-greece-roles',
      Accept: 'text/html',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
  }

  const html = await response.text()
  return parseVolunteerRolesFromHtml(html)
}
