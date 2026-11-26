import type { NextConfig } from "next"
import { PHASE_DEVELOPMENT_SERVER } from "next/constants"

const env = { NEXT_PUBLIC_BUILT_AT: new Date().toISOString() }
const experimental: NextConfig["experimental"] = { agentUpgrade: "security" }

export default function nextConfig(phase: string): NextConfig {
  if (phase !== PHASE_DEVELOPMENT_SERVER) {
    return { output: "export", env, experimental }
  }

  return {
    output: "export",
    env,
    experimental,
    rewrites: async () => [
      {
        source: "/:page((?!md/).+)\\.md",
        destination: "/md/:page.md",
      },
      {
        source: "/api/:path*",
        destination: "http://localhost:8788/api/:path*",
      },
      {
        source: "/stats/script.js",
        destination:
          "https://preet-datafast.preetsutharxd.workers.dev/js/script.js",
      },
      {
        source: "/stats/event",
        destination:
          "https://preet-datafast.preetsutharxd.workers.dev/api/event",
      },
    ],
  }
}
