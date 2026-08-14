export const CV_MAX_BYTES = 4 * 1024 * 1024

export const CV_ACCEPT =
  '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

const CV_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

function extensionOf(filename: string): string {
  const i = filename.lastIndexOf('.')
  return i >= 0 ? filename.slice(i).toLowerCase() : ''
}

export function mimeTypeForCv(filename: string, mimeType?: string): string {
  if (mimeType && CV_MIME_TYPES.has(mimeType)) return mimeType
  const ext = extensionOf(filename)
  if (ext === '.pdf') return 'application/pdf'
  if (ext === '.doc') return 'application/msword'
  if (ext === '.docx') {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  }
  return mimeType || 'application/octet-stream'
}

export function isAllowedCvFile(filename: string, mimeType: string, size: number): boolean {
  if (size <= 0 || size > CV_MAX_BYTES) return false
  const ext = extensionOf(filename)
  if (ext !== '.pdf' && ext !== '.doc' && ext !== '.docx') return false
  return !mimeType || CV_MIME_TYPES.has(mimeType) || mimeType === 'application/octet-stream'
}

export function sanitizeCvFilename(filename: string): string {
  const cleaned = filename.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 180)
  return cleaned || 'cv.pdf'
}
