import { readFileSync } from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

import sitemap from "@/app/sitemap"
import { getCategoryList } from "@/lib/category-lists"
import {
  componentCategories,
  getCategoryComponents,
  getComponentCategoryHref,
  minimumComponents,
} from "@/lib/component-categories"
import { docsCategories, docsComponents } from "@/lib/docs"
import { getEntryStats } from "@/lib/entry-stats"
import { getStudies } from "@/lib/research"
import { minimumSample } from "@/lib/research/stats"

const redirects = readFileSync(
  path.join(process.cwd(), "public/_redirects"),
  "utf8"
)
const sitemapPaths = new Set(sitemap().map((entry) => new URL(entry.url).pathname))

describe("category lists", () => {
  it("only publishes lists that meet the minimum size", () => {
    for (const category of componentCategories) {
      expect(
        getCategoryComponents(category.slug).length,
        category.slug
      ).toBeGreaterThanOrEqual(minimumComponents)
    }
  })

  it("uses the same rows for the title count, the page and the sitemap", () => {
    for (const category of componentCategories) {
      const list = getCategoryList(category.slug)
      expect(list?.count).toBe(getCategoryComponents(category.slug).length)
      expect(list?.components).toEqual(getCategoryComponents(category.slug))
      expect(sitemapPaths.has(getComponentCategoryHref(category.slug))).toBe(true)
    }
  })

  it("redirects every category too small for a page to its parent", () => {
    for (const slug of docsCategories) {
      if (componentCategories.some((category) => category.slug === slug)) continue
      expect(redirects, slug).toContain(`/components/${slug} /components 301`)
      expect(sitemapPaths.has(`/components/${slug}`)).toBe(false)
    }
  })

  it("lists components A to Z, as the summary says", () => {
    for (const category of componentCategories) {
      const names = getCategoryComponents(category.slug).map((item) => item.name)
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
    }
  })
})

describe("links to lists and research", () => {
  it("links each component only to a category list that exists and meets the minimum", () => {
    for (const component of docsComponents) {
      const linked = componentCategories.find(
        (category) => category.slug === component.category
      )
      if (!linked) continue
      expect(getCategoryList(linked.slug)?.count).toBeGreaterThanOrEqual(
        minimumComponents
      )
    }
  })

  it("only lists research with a large enough sample", () => {
    for (const study of getStudies()) {
      expect(study.sample).toBeGreaterThanOrEqual(minimumSample)
      expect(sitemapPaths.has(`/research/${study.slug}`)).toBe(true)
    }
  })

  it("shows the same block count on a component page as in the usage study", () => {
    const ranking = getStudies()
      .find((study) => study.slug === "ui-component-usage")
      ?.tables.find((table) => table.id === "component-ranking")
    for (const component of docsComponents) {
      const row = ranking?.rows.find((item) => item[1] === component.name)
      expect(Number(row?.[2]), component.slug).toBe(
        getEntryStats(component.slug).blocks
      )
    }
  })
})
