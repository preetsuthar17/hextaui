import { readFileSync } from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

import {
  aiSearchAgents,
  aiTrainingAgents,
  getRobotsTxt,
  robotsRules,
} from "@/lib/robots"

const rules = robotsRules.map((rule) => ({
  userAgent: rule.userAgents,
  allow: rule.allow,
  disallow: rule.disallow,
}))
const headers = readFileSync(
  path.join(process.cwd(), "public/_headers"),
  "utf8"
)

function list(value: string | string[] | undefined) {
  return [value ?? []].flat()
}

function headerBlock(source: string) {
  const start = headers.indexOf(`\n${source}\n`)
  if (start === -1) return ""
  const end = headers.indexOf("\n\n", start + 1)
  return headers.slice(start, end === -1 ? undefined : end)
}

describe("robots.txt", () => {
  it("names the AI crawlers and keeps a rule for everyone else", () => {
    const agents = rules.flatMap((rule) => rule.userAgent)
    for (const agent of [...aiSearchAgents, ...aiTrainingAgents, "*"]) {
      expect(agents).toContain(agent)
    }
  })

  it("never blocks the whole site for AI search bots", () => {
    for (const rule of rules) {
      expect(rule.disallow).not.toContain("/")
      expect(rule.allow).toContain("/")
    }
  })

  it("points at the sitemap, llms.txt and ai.txt", () => {
    const text = getRobotsTxt()
    expect(text).toContain("Sitemap: https://hextaui.com/sitemap.xml")
    expect(text).toContain("https://hextaui.com/llms.txt")
    expect(text).toContain("https://hextaui.com/ai.txt")
    expect(text).toContain("Keep in sync")
  })

  it("keeps registry JSON out of crawls but leaves the index reachable", () => {
    expect(list(rules[0].disallow)).toContain("/r/")
    expect(list(rules[0].allow)).toContain("/r/registry.json")
  })

  it("lets link-preview bots fetch social images", () => {
    for (const path of list(rules[0].disallow)) {
      expect("/og/docs/button.png".startsWith(path), path).toBe(false)
      expect("/opengraph-image".startsWith(path), path).toBe(false)
    }
  })

  it("keeps social images out of the index with a header instead", () => {
    for (const source of ["/og/*", "/opengraph-image"]) {
      expect(headerBlock(source), source).toContain("X-Robots-Tag: noindex")
    }
  })
})
