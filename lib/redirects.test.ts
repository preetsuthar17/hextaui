import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

import { proBlocks } from "@/lib/pro/catalog"
import {
  bulkRedirectsCsv,
  isStaticRule,
  parseRedirects,
  resolveRedirect,
  wwwRedirects,
} from "@/lib/redirects"
import { siteUrl } from "@/lib/site"

const root = process.cwd()
const redirectsFile = readFileSync(path.join(root, "public/_redirects"), "utf8")
const rules = parseRedirects(redirectsFile)
const staticRules = rules.filter(isStaticRule)

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
    for (const rule of rules) {
      const next = resolveRedirect(rules, rule.target)
      expect(next?.source, `${rule.source} → ${rule.target}`).toBeUndefined()
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

describe("resolveRedirect", () => {
  it("follows static, placeholder and splat sources", () => {
    const chain = parseRedirects(
      ["/a /b 301", "/b /c 301", "/p/:slug /c/:slug 301", "/s/* /c 301"].join(
        "\n"
      )
    )
    expect(resolveRedirect(chain, "/b")?.target).toBe("/c")
    expect(resolveRedirect(chain, "/p/x")?.target).toBe("/c/:slug")
    expect(resolveRedirect(chain, "/p/x/y")).toBeUndefined()
    expect(resolveRedirect(chain, "/s/x/y")?.target).toBe("/c")
    expect(resolveRedirect(chain, "/c")).toBeUndefined()
  })
})

describe("www bulk redirects", () => {
  const lists = wwwRedirects(rules, "www.hextaui.com", siteUrl)

  it("sends every legacy www URL to its final page in one hop", () => {
    expect(lists.legacy).toHaveLength(staticRules.length)
    for (const redirect of lists.legacy) {
      const target = new URL(redirect.target_url)
      expect(target.origin).toBe(siteUrl)
      expect(resolveRedirect(rules, target.pathname)).toBeUndefined()
    }
  })

  it("matches the generated Cloudflare lists", () => {
    for (const [name, redirects] of Object.entries(lists)) {
      const file = path.join(root, "cloudflare", `www-${name}`)
      const json = JSON.parse(readFileSync(`${file}.json`, "utf8"))
      const csv = readFileSync(`${file}.csv`, "utf8")
      expect(json, `run pnpm redirects:www`).toEqual(
        redirects.map((redirect) => ({ redirect }))
      )
      expect(csv, `run pnpm redirects:www`).toBe(
        `${bulkRedirectsCsv(redirects)}\n`
      )
    }
  })

  it("stays within the Cloudflare free plan", () => {
    expect(lists.legacy.length + lists.host.length).toBeLessThanOrEqual(10000)
  })
})
