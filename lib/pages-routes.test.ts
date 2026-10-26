import { describe, expect, it } from "vitest"

import { getPagesRoutes } from "@/lib/pages-routes"

const entries = [
  { name: "_next", directory: true },
  { name: "_headers", directory: false },
  { name: "_redirects", directory: false },
  { name: "_not-found", directory: true },
  { name: "_not-found.html", directory: false },
  { name: ".gitkeep", directory: false },
  { name: ".well-known", directory: true },
  { name: "__next._tree.txt", directory: false },
  { name: "index.html", directory: false },
  { name: "index.txt", directory: false },
  { name: "index.md", directory: false },
  { name: "docs", directory: true },
  { name: "docs.html", directory: false },
  { name: "docs.txt", directory: false },
  { name: "docs.md", directory: false },
  { name: "og", directory: true },
  { name: "preview", directory: true },
  { name: "opengraph-image", directory: false },
  { name: "favicon.ico", directory: false },
  { name: "icon.svg", directory: false },
  { name: "mcp", directory: true },
  { name: "r", directory: true },
  { name: "llms.txt", directory: false },
  { name: "robots.txt", directory: false },
  { name: "sitemap.xml", directory: false },
]

describe("getPagesRoutes", () => {
  const routes = getPagesRoutes(entries)

  it("routes everything else through Functions", () => {
    expect(routes.include).toEqual(["/*"])
  })

  it("skips Functions for build assets, images and RSC payloads", () => {
    expect(routes.exclude).toEqual([
      "/__next._tree.txt",
      "/_next/*",
      "/_not-found.html",
      "/_not-found/*",
      "/docs.txt",
      "/favicon.ico",
      "/icon.svg",
      "/index.txt",
      "/og/*",
      "/opengraph-image",
      "/preview/*",
    ])
  })

  it("keeps pages and files agents read on Functions", () => {
    for (const route of [
      "/",
      "/docs",
      "/docs/*",
      "/docs.md",
      "/index.md",
      "/llms.txt",
      "/robots.txt",
      "/sitemap.xml",
      "/.well-known/*",
      "/mcp/*",
      "/r/*",
      "/_headers",
      "/_redirects",
    ]) {
      expect(routes.exclude).not.toContain(route)
    }
  })

  it("refuses more rules than Cloudflare allows", () => {
    const many = Array.from({ length: 120 }, (_, index) => ({
      name: `image-${index}.png`,
      directory: false,
    }))
    expect(() => getPagesRoutes(many)).toThrow(/100/)
  })
})
