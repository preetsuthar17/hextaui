import { describe, expect, it } from "vitest"

import {
  getAuthMarkdown,
  getBlocksLlms,
  getHomeMarkdown,
  getSkillMarkdown,
} from "@/lib/agent-content"
import {
  getAiCatalog,
  getApiCatalog,
  getArdManifest,
  getMcpServerCard,
  getProtectedResourceMetadata,
  protectedResourceMetadataUrl,
} from "@/lib/agent-manifests"
import { getDocsLlms } from "@/lib/docs-markdown"
import { getProProductJsonLd, getPricingMarkdown } from "@/lib/pricing-info"
import { proPrice } from "@/lib/pro/pricing"
import { accessError } from "@/lib/pro/access"

const frontmatterPattern = /^---\n(?:[\w-]+: "(?:[^"\\]|\\.)*"\n)+---\n/

describe("ARD catalog", () => {
  const { entries } = getArdManifest()

  it("gives every entry the required ARD terms", () => {
    for (const entry of entries) {
      expect(entry.identifier).toMatch(/^urn:air:hextaui\.com(:[a-z0-9._-]+)+$/)
      expect(entry.displayName).toBeTruthy()
      expect(entry.type).toMatch(/^[a-z]+\/[a-z0-9.+-]+$/)
      expect(entry.url).toMatch(/^https:\/\/hextaui\.com\//)
      expect("data" in entry).toBe(false)
      expect(entry.representativeQueries.length).toBeGreaterThanOrEqual(2)
      expect(entry.representativeQueries.length).toBeLessThanOrEqual(5)
      expect(new URL(entry.trustManifest.identity).hostname).toBe("hextaui.com")
    }
  })

  it("serves the same entries at the legacy ai-catalog path", () => {
    expect(getAiCatalog().entries).toEqual(entries)
  })
})

describe("discovery documents", () => {
  it("lists API catalog items", () => {
    const [catalog] = getApiCatalog().linkset
    expect(catalog.anchor).toBe("https://hextaui.com/.well-known/api-catalog")
    expect("item" in catalog && catalog.item.length).toBeGreaterThan(0)
  })

  it("brands the MCP server card", () => {
    const card = getMcpServerCard()
    expect(card.title).toBe("HextaUI")
    expect(card.icons[0].src).toMatch(/^https:\/\/hextaui\.com\//)
  })

  it("describes the bearer-token resource without claiming OAuth", () => {
    const metadata = getProtectedResourceMetadata()
    expect(metadata.resource).toBe("https://hextaui.com")
    expect(metadata.bearer_methods_supported).toEqual(["header"])
    expect("authorization_servers" in metadata).toBe(false)
  })

  it("points Pro 401s at the resource metadata", () => {
    expect(
      accessError({ status: "anonymous" })!.headers.get("www-authenticate")
    ).toBe(`Bearer resource_metadata="${protectedResourceMetadataUrl}"`)
  })
})

describe("Markdown for agents", () => {
  it.each([
    ["index.md", getHomeMarkdown()],
    ["pricing.md", getPricingMarkdown()],
    ["SKILL.md", getSkillMarkdown()],
  ])("opens %s with frontmatter", (_, markdown) => {
    expect(markdown).toMatch(frontmatterPattern)
  })

  it("opens auth.md with its heading", () => {
    expect(getAuthMarkdown()).toMatch(/^# Authenticating with HextaUI\n/)
  })

  it("covers every auth.md section", () => {
    for (const section of [
      "Discover",
      "Pick a method",
      "Register",
      "Claim",
      "Exchange",
      "Use the access_token",
      "Errors",
      "Revocation",
    ]) {
      expect(getAuthMarkdown()).toContain(`\n## ${section}\n`)
    }
  })

  it("takes prices from the pricing module", () => {
    expect(getPricingMarkdown()).toContain(`$${proPrice} one-time`)
    expect(getProProductJsonLd().offers.price).toBe(proPrice)
  })

  it("scopes the section llms.txt files", () => {
    expect(getDocsLlms()).toMatch(/^# HextaUI docs\n/)
    expect(getDocsLlms()).toContain("https://hextaui.com/docs/button.md")
    expect(getBlocksLlms()).toMatch(/^# HextaUI Pro blocks\n/)
  })
})
