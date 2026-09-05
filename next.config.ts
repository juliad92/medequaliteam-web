import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Payload's pino logger (and its Node-only deps) out of the Next bundle.
  // Without this, webpack can fail with: Can't resolve 'worker_threads'.
  serverExternalPackages: [
    "pino",
    "pino-pretty",
    "pino-abstract-transport",
    "thread-stream",
  ],
};

export default withPayload(nextConfig);
