"use client"

import * as React from "react"

import type { ModelContext } from "@/components/site/web-mcp-tools"

function getModelContext() {
  const host = document as Document & { modelContext?: ModelContext }
  const fallback = navigator as Navigator & { modelContext?: ModelContext }
  return host.modelContext ?? fallback.modelContext
}

function WebMcp() {
  React.useEffect(() => {
    const context = getModelContext()
    if (!context) {
      return
    }
    const controller = new AbortController()
    import("@/components/site/web-mcp-tools")
      .then(({ webMcpTools }) => {
        if (controller.signal.aborted) return
        for (const tool of webMcpTools) {
          Promise.resolve()
            .then(() =>
              context.registerTool(tool, { signal: controller.signal })
            )
            .catch(() => {})
        }
      })
      .catch(() => {})
    return () => controller.abort()
  }, [])

  return null
}

export { WebMcp }
