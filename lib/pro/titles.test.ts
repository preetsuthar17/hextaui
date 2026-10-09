import { describe, expect, it } from "vitest"

import { proBlocks } from "@/lib/pro/catalog"
import { getProBlockTitle, proBlockTitles } from "@/lib/pro/titles"

describe("Pro block titles", () => {
  it("only overrides blocks that exist", () => {
    const names = new Set(proBlocks.map((block) => block.name))
    for (const name of Object.keys(proBlockTitles)) {
      expect(names.has(name), name).toBe(true)
    }
  })

  it("names React and stays short enough for search results", () => {
    for (const block of proBlocks) {
      const title = getProBlockTitle(block)
      expect(title, block.name).toMatch(/React/)
      expect(title.length, title).toBeLessThanOrEqual(60)
    }
  })

  it("falls back to the block title for new blocks", () => {
    expect(getProBlockTitle({ name: "new-block", title: "New Block" })).toBe(
      "New Block block for React & shadcn/ui"
    )
  })
})
