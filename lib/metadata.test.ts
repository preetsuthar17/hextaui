import { describe, expect, it } from "vitest"

import { clampDescription, pageMetadata } from "@/lib/metadata"

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
    expect(result.endsWith("…")).toBe(true)
    expect(result.length).toBeLessThanOrEqual(160)
  })

  it("cuts one long sentence at a word with an ellipsis", () => {
    const text = `${"word ".repeat(60).trim()}.`
    const result = clampDescription(text)
    expect(result.endsWith("word…")).toBe(true)
    expect(result.length).toBeLessThanOrEqual(160)
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
