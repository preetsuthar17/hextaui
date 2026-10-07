import type { NextConfig } from "next"
import { PHASE_DEVELOPMENT_SERVER } from "next/constants"

export default function nextConfig(phase: string): NextConfig {
  if (phase !== PHASE_DEVELOPMENT_SERVER) {
    return { output: "export" }
  }

  return {
    output: "export",
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
