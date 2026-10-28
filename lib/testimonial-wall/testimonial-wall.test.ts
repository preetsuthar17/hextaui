import { describe, expect, it } from "vitest"

import {
  defaultWallFrame,
  frameLimits,
  normalizeFrame,
} from "@/lib/testimonial-wall/frame"
import {
  findTweetUrls,
  parseCsv,
  parseImport,
  parseTweetUrl,
} from "@/lib/testimonial-wall/import"
import {
  defaultWallOptions,
  normalizeOptions,
  normalizeTestimonial,
  normalizeWallState,
  wallLimits,
} from "@/lib/testimonial-wall/model"
import { parseTweetOembed, tweetOembedUrl } from "@/lib/testimonial-wall/oembed"
import { seedTestimonials } from "@/lib/testimonial-wall/seed"
import {
  decodeWallState,
  encodeWallState,
  readShareHash,
  shareHash,
} from "@/lib/testimonial-wall/share"

describe("normalizeTestimonial", () => {
  it("accepts common field names and cleans values", () => {
    expect(
      normalizeTestimonial({
        Author: "  Ada   Lane ",
        username: "@@ada_lane!",
        Quote: "Great   tool.\r\n\r\n\r\nWould buy again.",
        link: "https://twitter.com/ada_lane/status/1",
        createdAt: "2026-03-04T10:00:00Z",
        stars: "4.6",
      })
    ).toEqual({
      name: "Ada Lane",
      handle: "ada_lane",
      body: "Great tool.\n\nWould buy again.",
      source: "x",
      url: "https://twitter.com/ada_lane/status/1",
      date: "2026-03-04",
      rating: 5,
    })
  })

  it("rejects entries without a name or body and unsafe URLs", () => {
    expect(normalizeTestimonial({ name: "No body" })).toBeNull()
    expect(normalizeTestimonial({ body: "No name" })).toBeNull()
    expect(normalizeTestimonial("text")).toBeNull()
    const item = normalizeTestimonial({
      name: "A",
      body: "B",
      url: "javascript:alert(1)",
      avatarUrl: "data:image/png;base64,AAAA",
      rating: 9,
      date: "not a date",
    })
    expect(item).toEqual({ name: "A", body: "B" })
  })

  it("caps long fields", () => {
    const item = normalizeTestimonial({
      name: "x".repeat(500),
      body: "y".repeat(5000),
    })
    expect(item?.name.length).toBe(wallLimits.name)
    expect(item?.body.length).toBe(wallLimits.body)
  })

  it("parses written dates as calendar days", () => {
    expect(
      normalizeTestimonial({ name: "A", body: "B", date: "October 3, 2026" })
        ?.date
    ).toBe("2026-10-03")
  })
})

describe("normalizeOptions", () => {
  it("falls back to defaults for unknown values", () => {
    expect(
      normalizeOptions({ layout: "spiral", columns: 9, show: { date: "yes" } })
    ).toEqual(defaultWallOptions)
    expect(
      normalizeOptions({ layout: "grid", columns: 2, show: { date: true } })
    ).toMatchObject({
      layout: "grid",
      columns: 2,
      show: { ...defaultWallOptions.show, date: true },
    })
  })
})

describe("parseImport", () => {
  it("reads a JSON array or an object with testimonials", () => {
    const array = parseImport('[{"name":"A","text":"Hello"},{"name":"B"}]')
    expect(array).toEqual({
      ok: true,
      testimonials: [{ name: "A", body: "Hello" }],
      skipped: 1,
    })
    const wrapped = parseImport(
      '{"testimonials":[{"author":"C","quote":"Hi"}]}'
    )
    expect(wrapped.ok && wrapped.testimonials).toEqual([
      { name: "C", body: "Hi" },
    ])
  })

  it("reads CSV with quotes, commas and newlines", () => {
    const csv =
      'name,body,rating\n"Lee, Jr.","Fast.\nReally ""fast"".",5\nKim,Nice,'
    expect(parseCsv(csv)).toEqual([
      { name: "Lee, Jr.", body: 'Fast.\nReally "fast".', rating: "5" },
      { name: "Kim", body: "Nice", rating: "" },
    ])
    const result = parseImport(csv)
    expect(result.ok && result.testimonials.length).toBe(2)
  })

  it("reads tab-separated rows from spreadsheets", () => {
    const result = parseImport("Name\tTestimonial\nAi\tLove it, truly")
    expect(result.ok && result.testimonials).toEqual([
      { name: "Ai", body: "Love it, truly" },
    ])
  })

  it("explains bad input", () => {
    expect(parseImport("   ").ok).toBe(false)
    expect(parseImport("[{").ok).toBe(false)
    expect(parseImport("name,body\n,").ok).toBe(false)
  })

  it("keeps at most the testimonial limit", () => {
    const rows = Array.from({ length: 80 }, (_, i) => ({
      name: `N${i}`,
      body: "B",
    }))
    const result = parseImport(JSON.stringify(rows))
    expect(result.ok && result.testimonials.length).toBe(
      wallLimits.testimonials
    )
    expect(result.ok && result.skipped).toBe(20)
  })
})

describe("tweet URLs", () => {
  it("accepts x.com and twitter.com status links only", () => {
    expect(parseTweetUrl("https://x.com/hexta_ui/status/123?s=20")).toEqual({
      handle: "hexta_ui",
      id: "123",
      url: "https://x.com/hexta_ui/status/123",
    })
    expect(
      parseTweetUrl("https://mobile.twitter.com/a/status/9/photo/1")?.id
    ).toBe("9")
    expect(parseTweetUrl("https://evil.com/a/status/1")).toBeNull()
    expect(parseTweetUrl("https://x.com.evil.com/a/status/1")).toBeNull()
    expect(parseTweetUrl("https://x.com/a/likes")).toBeNull()
    expect(parseTweetUrl("ftp://x.com/a/status/1")).toBeNull()
  })

  it("finds unique links in pasted text", () => {
    expect(
      findTweetUrls(
        "see https://x.com/a/status/1 and https://twitter.com/a/status/1, https://x.com/b/status/2"
      ).map((tweet) => tweet.id)
    ).toEqual(["1", "2"])
  })
})

describe("parseTweetOembed", () => {
  const tweet = parseTweetUrl("https://x.com/ada_dev/status/42")!

  it("builds the oEmbed request", () => {
    const url = new URL(tweetOembedUrl(tweet))
    expect(url.origin).toBe("https://publish.x.com")
    expect(url.searchParams.get("url")).toBe("https://x.com/ada_dev/status/42")
    expect(url.searchParams.get("omit_script")).toBe("1")
  })

  it("reads the author, text and date", () => {
    expect(
      parseTweetOembed(
        {
          author_name: "Ada Dev",
          author_url: "https://twitter.com/ada_dev",
          html: '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Loving this &amp; that.<br><br>So good &#8212; <a href="https://t.co/abc">https://t.co/abc</a> <a href="https://t.co/pic">pic.twitter.com/xyz</a></p>&mdash; Ada (@ada_dev) <a href="https://twitter.com/ada_dev/status/42?ref_src=twsrc%5Etfw">October 3, 2026</a></blockquote>\n',
        },
        tweet
      )
    ).toEqual({
      name: "Ada Dev",
      handle: "ada_dev",
      body: "Loving this & that.\n\nSo good —",
      source: "x",
      url: "https://x.com/ada_dev/status/42",
      date: "2026-10-03",
    })
  })

  it("returns null for unexpected payloads", () => {
    expect(parseTweetOembed(null, tweet)).toBeNull()
    expect(
      parseTweetOembed({ html: "<div>no paragraph</div>" }, tweet)
    ).toBeNull()
  })
})

describe("share links", () => {
  it("round-trips the wall state through the URL hash", async () => {
    const state = {
      testimonials: seedTestimonials,
      options: {
        ...defaultWallOptions,
        layout: "marquee" as const,
        rows: 1 as const,
      },
    }
    const encoded = await encodeWallState(state)
    expect(encoded).toMatch(/^w1\.[A-Za-z0-9_-]+$/)
    const hash = shareHash(encoded)
    expect(await decodeWallState(readShareHash(hash)!)).toEqual(state)
  })

  it("compresses the payload", async () => {
    const encoded = await encodeWallState({
      testimonials: seedTestimonials,
      options: defaultWallOptions,
    })
    expect(encoded.length).toBeLessThan(JSON.stringify(seedTestimonials).length)
  })

  it("rejects tampered or foreign hashes", async () => {
    expect(await decodeWallState("w2.abc")).toBeNull()
    expect(await decodeWallState("w1.%%%")).toBeNull()
    expect(await decodeWallState("w1.AAAA")).toBeNull()
    expect(readShareHash("#other=1")).toBeNull()
  })

  it("round-trips the frame and drops default frame values", async () => {
    const frame = {
      ...defaultWallFrame,
      background: "graphite" as const,
      title: "Teams ship faster",
    }
    const state = {
      testimonials: seedTestimonials.slice(0, 2),
      options: defaultWallOptions,
      frame,
    }
    expect(await decodeWallState(await encodeWallState(state))).toEqual(state)
    expect(
      await decodeWallState(
        await encodeWallState({ ...state, frame: defaultWallFrame })
      )
    ).toEqual({ ...state, frame: defaultWallFrame })
  })

  it("normalizes a broken frame", () => {
    expect(
      normalizeFrame({ background: "neon", padding: 3, title: 4 })
    ).toEqual(defaultWallFrame)
    expect(
      normalizeFrame({ title: `  ${"a".repeat(200)}  ` }).title
    ).toHaveLength(frameLimits.title)
  })

  it("normalizes decoded state", () => {
    expect(
      normalizeWallState({
        testimonials: [{ name: "A", body: "B", url: "javascript:x" }, 4],
        options: { layout: "grid" },
      })
    ).toEqual({
      testimonials: [{ name: "A", body: "B" }],
      options: { ...defaultWallOptions, layout: "grid" },
    })
  })
})
