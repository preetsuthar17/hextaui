import { readdirSync } from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

import { finishMarkdownPage, markdownMeta } from "@/lib/md/format"
import {
  htmlPathFor,
  markdownPathFor,
  markdownRoutePatterns,
  markdownSkippedRoutes,
  matchMarkdownRoute,
} from "@/lib/md/routes"

const appDir = path.join(process.cwd(), "app")

function pageRoutes(dir: string, segments: string[] = []): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isFile() && /^page\.tsx?$/.test(entry.name)) {
      return [`/${segments.join("/")}`]
    }
    if (!entry.isDirectory() || /^[_@]/.test(entry.name)) return []
    const segment = /^\(.+\)$/.test(entry.name) ? [] : [entry.name]
    return pageRoutes(path.join(dir, entry.name), [...segments, ...segment])
  })
}

function isSkipped(route: string) {
  return Object.keys(markdownSkippedRoutes).some(
    (skip) => route === skip || route.startsWith(`${skip}/`)
  )
}

describe("Markdown routes", () => {
  it("covers every public page with a renderer or a reason to skip it", () => {
    const missing = pageRoutes(appDir)
      .filter((route) => !isSkipped(route))
      .filter(
        (route) =>
          !matchMarkdownRoute(route.replace(/\[[^\]]+\]/g, "sample-slug"))
      )
    expect(
      missing,
      "Add a pattern to lib/md/routes.ts and a renderer to lib/md/registry.ts, or a skip reason"
    ).toEqual([])
  })

  it("gives every skipped route a reason", () => {
    for (const reason of Object.values(markdownSkippedRoutes)) {
      expect(reason.length).toBeGreaterThan(10)
    }
  })

  it("maps HTML paths to Markdown paths and back", () => {
    expect(markdownPathFor("/")).toBe("/index.md")
    expect(markdownPathFor("/pricing/")).toBe("/pricing.md")
    expect(htmlPathFor("/index.md")).toBe("/")
    expect(htmlPathFor("/blog/shadcn-ui-states.md")).toBe(
      "/blog/shadcn-ui-states"
    )
  })

  it("only negotiates content routes", () => {
    for (const path of [
      "/llms.txt",
      "/ai.txt",
      "/robots.txt",
      "/sitemap.xml",
      "/api/account",
      "/_next/static/chunk.js",
      "/.well-known/mcp.json",
      "/docs/search.json",
      "/account",
      "/es/docs",
    ]) {
      expect(matchMarkdownRoute(path), path).toBeNull()
    }
    expect(matchMarkdownRoute("/docs/button")).toBe("/docs/:slug")
    expect(markdownRoutePatterns).toContain("/")
  })
})

describe("Markdown page format", () => {
  it("puts the canonical URL and date under the summary", () => {
    const page = finishMarkdownPage("# Title\n\n> Summary.\n\nBody text.", {
      path: "/about",
      updated: "2026-10-20",
      related: [{ title: "Contact", href: "/contact" }],
    })
    expect(page).toBe(
      "# Title\n\n> Summary.\n\nCanonical: https://hextaui.com/about\nLast updated: 2026-10-20\n\nBody text.\n\n## Related\n\n- [Contact](https://hextaui.com/contact)\n"
    )
    expect(markdownMeta(page)).toEqual({ title: "Title", summary: "Summary." })
  })

  it("keeps frontmatter first", () => {
    const page = finishMarkdownPage('---\ntitle: "T"\n---\n# T\n\n> S', {
      path: "/",
    })
    expect(page).toMatch(/^---\ntitle: "T"\n---\n# T\n\n> S\n\nCanonical: /)
  })
})
