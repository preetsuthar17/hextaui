import { describe, expect, it } from "vitest"

import {
  clampDescription,
  documentTitle,
  metadataTitle,
  pageMetadata,
  textWidth,
} from "@/lib/metadata"

describe("clampDescription", () => {
  it("keeps short descriptions as they are", () => {
    expect(clampDescription("A short one.")).toBe("A short one.")
  })

  it("keeps whole sentences that fit", () => {
    const text = `${"First sentence goes here. ".repeat(5).trim()} ${"x".repeat(80)}.`
    const result = clampDescription(text)
    expect(result).toBe("First sentence goes here. ".repeat(5).trim())
    expect(result.length).toBeLessThanOrEqual(160)
  })

  it("cuts at a word when the sentences that fit are too short to describe the page", () => {
    const text = `Short opener. ${"Then a long second sentence with detail ".repeat(5).trim()}.`
    const result = clampDescription(text)
    expect(result.startsWith("Short opener. Then a long")).toBe(true)
    expect(result.endsWith("…")).toBe(false)
    expect(text.startsWith(result)).toBe(true)
    expect(text[result.length]).toBe(" ")
    expect(result.length).toBeLessThanOrEqual(160)
  })

  it("cuts one long sentence at a word without an ellipsis", () => {
    const text = `${"wording ".repeat(30).trim()}.`
    const result = clampDescription(text)
    expect(result.endsWith("wording")).toBe(true)
    expect(result.length).toBeLessThanOrEqual(160)
  })

  it("never ends on a dangling word or comma", () => {
    const text = `${"Handles sold-out sizes, ".repeat(6)}missing combinations and back-in-stock emails for every product.`
    const result = clampDescription(text)
    expect(result).not.toMatch(/(,|\band|\bfor|\bthe)$/)
    expect(result.length).toBeLessThanOrEqual(160)
  })

  it("measures CJK text at double width", () => {
    expect(textWidth("ボタン")).toBe(6)
    const text = "すべてのバリアントとサイズのボタンです、".repeat(6)
    expect(textWidth(clampDescription(text))).toBeLessThanOrEqual(160)
  })

  it("does not split on decimals or versions", () => {
    const text = `Built on Tailwind CSS v4.1 and React 19.2 for every screen size you ship to. ${"Then a long tail of detail. ".repeat(6).trim()}`
    expect(
      clampDescription(text).startsWith(
        "Built on Tailwind CSS v4.1 and React 19.2"
      )
    ).toBe(true)
  })
})

describe("pageMetadata", () => {
  it("uses the clamped description everywhere", () => {
    const long = `${"Streaming answers with tool calls. ".repeat(8).trim()}`
    const metadata = pageMetadata({ path: "/x", title: "X", description: long })
    expect(metadata.description?.length).toBeLessThanOrEqual(160)
    expect(metadata.openGraph?.description).toBe(metadata.description)
    expect(metadata.twitter?.description).toBe(metadata.description)
  })
})

describe("documentTitle", () => {
  it("adds the site name when it fits in 60 characters", () => {
    expect(documentTitle("Pricing")).toBe("Pricing — HextaUI")
  })

  it("drops the site name instead of cutting the title", () => {
    const title = "useToday: a React date hook that rolls over at midnight"
    expect(documentTitle(title)).toBe(title)
  })

  it("round-trips through metadataTitle", () => {
    const metadata = pageMetadata({ path: "/pricing", title: "Pricing" })
    expect(metadata.title).toEqual({ absolute: "Pricing — HextaUI" })
    expect(metadataTitle(metadata)).toBe("Pricing")
  })
})

describe("pageMetadata options", () => {
  it("marks noindex pages noindex, follow with the default image", () => {
    const metadata = pageMetadata({
      path: "/account",
      title: "Account",
      noindex: true,
    })
    expect(metadata.robots).toEqual({ index: false, follow: true })
    expect(metadata.openGraph?.images).toEqual([
      expect.objectContaining({ url: "/opengraph-image" }),
    ])
  })

  it("leaves robots alone for indexable pages", () => {
    expect(pageMetadata({ path: "/x", title: "X" }).robots).toBeUndefined()
  })

  it("sets article dates and the site handle", () => {
    const metadata = pageMetadata({
      path: "/blog/x",
      title: "X",
      type: "article",
      publishedTime: "2026-10-22",
    })
    expect(metadata.openGraph).toMatchObject({
      type: "article",
      publishedTime: "2026-10-22",
      modifiedTime: "2026-10-22",
    })
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      site: "@preetsuthar17",
    })
  })
})
