/**
  * Sanitizes arbitrary string input to prevent XSS payloads and script injection.
  */
export function sanitizeString(input: string): string {
  if (!input) return ''
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

/**
 * Strips all HTML tags from plain text inputs.
 */
export function stripHtml(input: string): string {
  if (!input) return ''
  return input.replace(/<[^>]*>?/gm, '').trim()
}

/**
 * Normalizes email address inputs.
 */
export function normalizeEmail(email: string): string {
  if (!email) return ''
  return email.toLowerCase().trim()
}
