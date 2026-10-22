import { describe, expect, it } from "vitest"

import { highlight } from "@/lib/highlight"
import { decodeCompactHtml, encodeCompactHtml } from "@/lib/pro/compact-html"

const samples = [
  `"use client"\n\nimport * as React from "react"\n\nexport function Price({ value }: { value: number }) {\n  return value < 10 && value > 0 ? <span>{value}</span> : null\n}\n`,
  `const empty = ""\n\n\nconst query = "a&b<c"\n`,
  `{\n  "name": "price"\n}\n`,
]

describe("compact html", () => {
  it("rebuilds the exact highlighted html", async () => {
    for (const code of samples) {
      const lang = code.startsWith("{") ? "json" : "tsx"
      const html = await highlight(code, lang, { lineNumbers: true })
      const compact = encodeCompactHtml(code, html)
      expect(compact).not.toBeNull()
      expect(decodeCompactHtml(code, compact!)).toBe(html)
      expect(compact!.runs.length).toBeLessThan(html.length)
    }
  })

  it("refuses html it cannot rebuild", () => {
    expect(encodeCompactHtml("a", "<div>a</div>")).toBeNull()
    expect(
      encodeCompactHtml("ab", "<pre><code><span class=line>a</span></code></pre>")
    ).toBeNull()
  })
})
