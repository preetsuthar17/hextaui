import { describe, expect, it } from "vitest"

import {
  docsEntries,
  docsHooks,
  docsTitles,
  docsUtilities,
  getDocsTitle,
} from "@/lib/docs"

describe("docs titles", () => {
  it("only overrides pages that exist", () => {
    const slugs = new Set(docsEntries.map((entry) => entry.slug))
    for (const slug of Object.keys(docsTitles)) {
      expect(slugs.has(slug), slug).toBe(true)
    }
  })

  it("gives every hook and utility a written title", () => {
    for (const entry of [...docsHooks, ...docsUtilities]) {
      expect(docsTitles[entry.slug], entry.slug).toBeDefined()
    }
  })

  it("names React in every title and keeps it short enough for search results", () => {
    for (const entry of docsEntries) {
      const title = getDocsTitle(entry.slug)
      expect(title, entry.slug).toMatch(/React|Tailwind/)
      expect(title.length, title).toBeLessThanOrEqual(60)
    }
  })

  it("gives every page a different title", () => {
    const titles = docsEntries.map((entry) => getDocsTitle(entry.slug))
    expect(new Set(titles).size).toBe(titles.length)
  })

  it("capitalizes the component name in the default title", () => {
    expect(getDocsTitle("alert-dialog")).toBe(
      "Alert Dialog component for React & shadcn/ui"
    )
    expect(getDocsTitle("input-group")).toBe(
      "Input Group component for React & shadcn/ui"
    )
  })
})
