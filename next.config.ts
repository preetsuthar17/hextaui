import type { NextConfig } from "next"
import { PHASE_DEVELOPMENT_SERVER } from "next/constants"

const env = { NEXT_PUBLIC_BUILT_AT: new Date().toISOString() }

export default function nextConfig(phase: string): NextConfig {
  if (phase !== PHASE_DEVELOPMENT_SERVER) {
    return { output: "export", env }
  }

  return {
    output: "export",
    env,
    experimental: {
      turbopackLazyDynamicImports: true,
    },
    rewrites: async () => [
      {
        source: "/api/:path*",
        destination: "http://localhost:8788/api/:path*",
      },
    ],
  }
}
