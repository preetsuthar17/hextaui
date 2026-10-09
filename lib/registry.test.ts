import fs from "node:fs"
import path from "node:path"

import { registryItemSchema, registrySchema } from "shadcn/schema"
import { describe, expect, it } from "vitest"

import registry from "@/registry.json"

const root = path.resolve(import.meta.dirname, "..")
const itemUrl = /^https:\/\/hextaui\.com\/r\/([a-z0-9-]+)\.json$/
const names = new Set(registry.items.map((item) => item.name))

function failures<T>(values: T[], check: (value: T) => string | null) {
  return values.map(check).filter((value): value is string => value !== null)
}

describe("registry.json", () => {
  it("is a valid shadcn registry named hextaui", () => {
    const parsed = registrySchema.safeParse(registry)
    expect(parsed.error?.issues ?? []).toEqual([])
    expect(registry.name).toBe("hextaui")
    expect(registry.homepage).toBe("https://hextaui.com")
  })

  it("has unique kebab-case item names", () => {
    expect(names.size).toBe(registry.items.length)
    expect(
      failures(registry.items, (item) =>
        /^[a-z0-9]+(-[a-z0-9]+)*$/.test(item.name) ? null : item.name
      )
    ).toEqual([])
  })

  it("passes the registry item schema the shadcn health check uses", () => {
    expect(
      failures(registry.items, (item) => {
        const parsed = registryItemSchema.safeParse(item)
        if (!parsed.success) {
          return `${item.name}: ${parsed.error.issues
            .map((issue) => `${issue.path.join(".")} ${issue.message}`)
            .join("; ")}`
        }
        return parsed.data.name === item.name ? null : `${item.name}: name`
      })
    ).toEqual([])
  })

  it("gives every item a title and description", () => {
    expect(
      failures(registry.items, (item) =>
        item.title?.trim() && item.description?.trim() ? null : item.name
      )
    ).toEqual([])
  })

  it("points every file at a source that exists", () => {
    expect(
      failures(
        registry.items.flatMap((item) =>
          (item.files ?? []).map((file) => ({ item: item.name, file }))
        ),
        ({ item, file }) =>
          fs.existsSync(path.join(root, file.path))
            ? null
            : `${item}: ${file.path}`
      )
    ).toEqual([])
  })

  it("only depends on public hextaui items that exist", () => {
    expect(
      failures(
        registry.items.flatMap((item) =>
          (item.registryDependencies ?? []).map((dependency) => ({
            item: item.name,
            dependency,
          }))
        ),
        ({ item, dependency }) => {
          const name = dependency.match(itemUrl)?.[1]
          return name && names.has(name) ? null : `${item}: ${dependency}`
        }
      )
    ).toEqual([])
  })
})
