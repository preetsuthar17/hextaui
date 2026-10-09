import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

import { highlight } from "@/lib/highlight"

const root = path.resolve(import.meta.dirname, "..")

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })
}

function textOf(html: string) {
  const template = document.createElement("template")
  template.innerHTML = html
  return template.content.textContent
}

const sources = [
  ...walk(path.join(root, "components/examples")),
  ...walk(path.join(root, "components/ui")),
  ...walk(path.join(root, "hooks")),
].filter((file) => /\.tsx?$/.test(file) && !/\.test\.tsx?$/.test(file))

describe("highlight", () => {
  it("keeps the exact source text of every example and component", async () => {
    for (const file of sources) {
      const code = fs.readFileSync(file, "utf8").trimEnd()
      expect(textOf(await highlight(code)), file).toBe(code)
    }
  }, 120_000)

  it("maps every token color to a class instead of an inline style", async () => {
    for (const file of sources) {
      const html = await highlight(fs.readFileSync(file, "utf8"))
      expect(html, file).not.toMatch(/<span style=/)
    }
  }, 120_000)

  it("keeps line numbers and highlighted lines", async () => {
    const html = await highlight("const a = 1\nconst b = 2", "tsx", {
      lineNumbers: true,
      highlightLines: "2",
    })
    expect(html).toContain("data-line-numbers")
    expect(html).toContain("--code-digits:1ch")
    expect(html.match(/data-highlighted/g)).toHaveLength(1)
  })
})
