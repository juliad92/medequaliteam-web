import { Montserrat } from 'next/font/google'

/**
 * Self-hosted via next/font (no render-blocking Google Fonts CSS @import).
 * Exposes `--font-montserrat` for CSS / Tailwind theme tokens.
 */
export const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-montserrat',
})
