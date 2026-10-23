import { readFileSync } from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

import robots from "@/app/robots"

const rules = [robots().rules].flat()
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
  it("has one rule for every crawler", () => {
    expect(rules).toHaveLength(1)
    expect(rules[0].userAgent).toBe("*")
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
    for (const source of [
      "/og/*",
      "/opengraph-image",
      "/blog/opengraph-image",
      "/blog/:slug/opengraph-image",
    ]) {
      expect(headerBlock(source), source).toContain("X-Robots-Tag: noindex")
    }
  })
})
