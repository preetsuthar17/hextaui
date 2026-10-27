import { afterEach, describe, expect, it, vi } from "vitest"

import { onRequestGet } from "@/functions/api/tools/oembed"

function call(url?: string) {
  const request = new Request(
    `https://hextaui.com/api/tools/oembed${url === undefined ? "" : `?url=${encodeURIComponent(url)}`}`
  )
  return onRequestGet({ request })
}

const oembed = {
  author_name: "Sample Author",
  author_url: "https://twitter.com/sample_author",
  html: '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Works great.</p>&mdash; Sample Author (@sample_author) <a href="https://twitter.com/sample_author/status/7">March 2, 2026</a></blockquote>',
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("GET /api/tools/oembed", () => {
  it("returns the post as a testimonial", async () => {
    const fetch = vi.fn(async () => Response.json(oembed))
    vi.stubGlobal("fetch", fetch)
    const response = await call("https://x.com/sample_author/status/7?s=20")
    expect(response.status).toBe(200)
    expect(response.headers.get("cache-control")).toContain("max-age=86400")
    expect(await response.json()).toEqual({
      testimonial: {
        name: "Sample Author",
        handle: "sample_author",
        body: "Works great.",
        source: "x",
        url: "https://x.com/sample_author/status/7",
        date: "2026-03-02",
      },
    })
    expect(String(fetch.mock.calls[0]?.[0 as never])).toMatch(
      /^https:\/\/publish\.x\.com\/oembed\?/
    )
  })

  it("refuses links that are not X posts without calling out", async () => {
    const fetch = vi.fn()
    vi.stubGlobal("fetch", fetch)
    for (const url of [
      undefined,
      "https://example.com/a/status/1",
      "x".repeat(600),
    ]) {
      const response = await call(url)
      expect(response.status).toBe(400)
      expect(response.headers.get("content-type")).toBe(
        "application/problem+json"
      )
    }
    expect(fetch).not.toHaveBeenCalled()
  })

  it("maps upstream failures to problem details", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("", { status: 404 }))
    )
    expect((await call("https://x.com/a/status/1")).status).toBe(404)
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("", { status: 500 }))
    )
    expect((await call("https://x.com/a/status/1")).status).toBe(502)
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("not json"))
    )
    expect((await call("https://x.com/a/status/1")).status).toBe(502)
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Promise.reject(new Error("timeout")))
    )
    const failed = await call("https://x.com/a/status/1")
    expect(failed.status).toBe(502)
    expect((await failed.json()).code).toBe("upstream_error")
  })
})
