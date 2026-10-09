import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

import { proBlocks } from "@/lib/pro/catalog"

const root = process.cwd()
const rules = readFileSync(path.join(root, "public/_redirects"), "utf8")
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#"))
  .map((line) => {
    const [source, target, status] = line.split(/\s+/)
    return { source, target, status }
  })

const staticRules = rules.filter(
  (rule) => !rule.source.includes(":") && !rule.source.includes("*")
)

function hasPage(route: string) {
  if (route.startsWith("/blocks/")) {
    return proBlocks.some((block) => `/blocks/${block.name}` === route)
  }
  return existsSync(path.join(root, "app", route, "page.tsx"))
}

describe("public/_redirects", () => {
  it("uses permanent redirects", () => {
    for (const rule of rules) {
      expect(rule.status, rule.source).toBe("301")
    }
  })

  it("has no duplicate sources", () => {
    const sources = rules.map((rule) => rule.source)
    expect(new Set(sources).size).toBe(sources.length)
  })

  it("points every legacy URL at a page that exists", () => {
    for (const rule of staticRules) {
      expect(hasPage(rule.target), `${rule.source} → ${rule.target}`).toBe(true)
    }
  })

  it("never shadows a live page", () => {
    for (const rule of staticRules) {
      expect(hasPage(rule.source), rule.source).toBe(false)
    }
  })

  it("never chains one redirect into another", () => {
    const sources = new Set(staticRules.map((rule) => rule.source))
    for (const rule of staticRules) {
      expect(sources.has(rule.target), rule.target).toBe(false)
    }
  })

  it("lists every static rule before the first dynamic one", () => {
    const firstDynamic = rules.findIndex((rule) => !staticRules.includes(rule))
    const lastStatic = rules.findLastIndex((rule) => staticRules.includes(rule))
    if (firstDynamic !== -1) {
      expect(lastStatic).toBeLessThan(firstDynamic)
    }
  })

  it("stays within the Cloudflare Pages limits", () => {
    expect(staticRules.length).toBeLessThanOrEqual(2000)
    expect(rules.length - staticRules.length).toBeLessThanOrEqual(100)
  })
})
