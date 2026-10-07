import fs from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

import { getSkillMarkdown } from "@/lib/agent-content"

const root = process.cwd()
const readJson = (file: string) =>
  JSON.parse(fs.readFileSync(path.join(root, file), "utf8"))

describe("Agent Plugin", () => {
  it("has a valid plugin.json", () => {
    const manifest = readJson("plugin.json")
    expect(manifest.$schema).toBe(
      "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json"
    )
    expect(manifest.name).toMatch(/^[a-z0-9](?:[a-z0-9]|[.-](?=[a-z0-9]))*$/)
    expect(Object.keys(manifest)).toEqual(
      expect.not.arrayContaining(["skills", "mcpServers"])
    )
    expect(Object.keys(manifest.author).sort()).toEqual([
      "email",
      "name",
      "url",
    ])
  })

  it("points mcp.json at the hosted server", () => {
    const config = readJson("mcp.json")
    expect(Object.keys(config).sort()).toEqual(["$schema", "mcpServers"])
    expect(config.mcpServers.hextaui).toEqual({
      type: "streamable-http",
      url: "https://hextaui.com/mcp",
    })
  })

  it("ships the same skill the site serves", async () => {
    await expect(getSkillMarkdown()).toMatchFileSnapshot(
      path.join(root, "skills/hextaui/SKILL.md")
    )
  })
})
