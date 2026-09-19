import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

import { getRedirects } from './src/redirects'

const nextConfig: NextConfig = {
  // Prefer /en/about over /en/about/ (Next also auto-redirects the other way).
  trailingSlash: false,

  // Keep Payload's pino logger (and its Node-only deps) out of the Next bundle.
  // Without this, webpack can fail with: Can't resolve 'worker_threads'.
  serverExternalPackages: [
    'pino',
    'pino-pretty',
    'pino-abstract-transport',
    'thread-stream',
  ],

  async redirects() {
    return getRedirects()
  },
}

export default withPayload(nextConfig)
