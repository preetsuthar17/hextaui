import { describe, expect, it } from "vitest"

import { parseSponsorInput, sponsorHref, sponsorLimits } from "@/lib/sponsor"

const valid = {
  name: "Acme",
  headline: "Ship faster with Acme",
  description: "Hosting for React apps.",
  cta: "Try Acme",
  url: "https://acme.com/start?plan=pro",
  email: "ads@acme.com",
}

describe("parseSponsorInput", () => {
  it("accepts and trims a complete card", () => {
    const result = parseSponsorInput({ ...valid, name: "  Acme  " })
    expect(result).toEqual({ ok: true, input: valid })
  })

  it("rejects missing, long or non-string fields", () => {
    expect(parseSponsorInput({ ...valid, cta: "" }).ok).toBe(false)
    expect(parseSponsorInput({ ...valid, cta: 42 }).ok).toBe(false)
    expect(
      parseSponsorInput({
        ...valid,
        headline: "x".repeat(sponsorLimits.headline + 1),
      }).ok
    ).toBe(false)
    expect(parseSponsorInput(null).ok).toBe(false)
  })

  it("only allows https links and real emails", () => {
    expect(parseSponsorInput({ ...valid, url: "http://acme.com" }).ok).toBe(
      false
    )
    expect(parseSponsorInput({ ...valid, url: "javascript:alert(1)" }).ok).toBe(
      false
    )
    expect(parseSponsorInput({ ...valid, email: "acme" }).ok).toBe(false)
  })
})

describe("sponsorHref", () => {
  it("adds UTM tags to external links and keeps their query", () => {
    const href = new URL(sponsorHref(valid.url))
    expect(href.searchParams.get("plan")).toBe("pro")
    expect(href.searchParams.get("utm_source")).toBe("hextaui")
    expect(href.searchParams.get("utm_medium")).toBe("sponsor")
  })

  it("leaves internal links alone", () => {
    expect(sponsorHref("/sponsor")).toBe("/sponsor")
  })
})
