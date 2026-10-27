import { describe, expect, it } from "vitest"

import { handleAgentRequest, prefersMarkdown } from "@/lib/agent-http"

const html = (status = 200) =>
  new Response("<!doctype html><h1>HextaUI</h1>", {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      vary: "accept-encoding",
    },
  })

const files: Record<string, string> = {
  "/index.md": "# HextaUI\n",
  "/pricing.md":
    "# HextaUI pricing\n\n> Free and Pro.\n\nCanonical: https://hextaui.com/pricing\nLast updated: 2026-10-08\n\nBody\n",
  "/404.md": "# Page not found\n\nSee https://hextaui.com/llms.txt\n",
  "/markdown-catalog.json": '{"count":1}',
}

const assets = async (path: string) =>
  path in files
    ? new Response(files[path])
    : new Response("missing", { status: 404 })

function request(
  path: string,
  accept?: string,
  method = "GET",
  userAgent?: string
) {
  return new Request(`https://hextaui.com${path}`, {
    method,
    headers: {
      ...(accept ? { accept } : {}),
      ...(userAgent ? { "user-agent": userAgent } : {}),
    },
  })
}

describe("prefersMarkdown", () => {
  it.each([
    ["text/markdown", true],
    ["text/markdown, text/html;q=0.9", true],
    ["text/x-markdown", true],
    ["text/html, text/markdown", false],
    ["text/markdown, text/html", false],
    ["text/html, text/markdown;q=0.5", false],
    ["text/markdown;q=0", false],
    ["text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", false],
    ["*/*", false],
    [null, false],
  ])("%s → %s", (accept, expected) => {
    expect(prefersMarkdown(accept)).toBe(expected)
  })
})

describe("handleAgentRequest", () => {
  it("serves Markdown for the homepage when asked", async () => {
    const response = await handleAgentRequest(
      request("/", "text/markdown"),
      async () => html(),
      assets
    )
    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8"
    )
    expect(response.headers.get("vary")).toBe("Accept")
    expect(response.headers.get("x-robots-tag")).toBe("noindex, follow")
    expect(response.headers.get("content-location")).toBe(
      "https://hextaui.com/"
    )
    expect(await response.text()).toBe("# HextaUI\n")
  })

  it("keeps HTML for browsers and varies on Accept", async () => {
    const response = await handleAgentRequest(
      request("/", "text/html,*/*;q=0.8"),
      async () => html(),
      assets
    )
    expect(response.headers.get("content-type")).toContain("text/html")
    expect(response.headers.get("vary")).toBe("accept-encoding, Accept")
    expect(await response.text()).toContain("<h1>")
  })

  it.each([
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  ])("keeps HTML for %s unless Accept asks for Markdown", async (userAgent) => {
    for (const accept of ["*/*", "text/html", undefined]) {
      const response = await handleAgentRequest(
        request("/", accept, "GET", userAgent),
        async () => html(),
        assets
      )
      expect(response.headers.get("content-type")).toContain("text/html")
    }
  })

  it("serves the .md suffix with Markdown headers", async () => {
    const response = await handleAgentRequest(
      request("/pricing.md"),
      async () => html(404),
      assets
    )
    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8"
    )
    expect(Number(response.headers.get("x-markdown-tokens"))).toBeGreaterThan(0)
    expect(response.headers.get("x-robots-tag")).toBe("noindex, follow")
    expect(response.headers.get("content-location")).toBe(
      "https://hextaui.com/pricing"
    )
    expect(response.headers.get("link")).toBe(
      '<https://hextaui.com/pricing>; rel="canonical"'
    )
    expect(response.headers.get("last-modified")).toBe(
      "Thu, 08 Oct 2026 00:00:00 GMT"
    )
    expect(response.headers.get("access-control-allow-origin")).toBe("*")
    expect(response.headers.get("vary")).toBeNull()
  })

  it("negotiates content routes and varies on Accept", async () => {
    const markdown = await handleAgentRequest(
      request("/pricing", "text/markdown, text/html;q=0.5"),
      async () => html(),
      assets
    )
    expect(markdown.headers.get("content-type")).toContain("text/markdown")
    expect(markdown.headers.get("vary")).toBe("Accept")

    const page = await handleAgentRequest(
      request("/pricing"),
      async () => html(),
      assets
    )
    expect(page.headers.get("content-type")).toContain("text/html")
    expect(page.headers.get("vary")).toContain("Accept")
  })

  it("never negotiates files and non-content routes", async () => {
    for (const path of ["/llms.txt", "/robots.txt", "/sitemap.xml"]) {
      const ok = html()
      expect(
        await handleAgentRequest(
          request(path, "text/markdown"),
          async () => ok,
          assets
        )
      ).toBe(ok)
    }
  })

  it("serves /api/md and the catalog", async () => {
    const page = await handleAgentRequest(
      request("/api/md/pricing"),
      async () => html(404),
      assets
    )
    expect(page.headers.get("content-type")).toContain("text/markdown")
    const catalog = await handleAgentRequest(
      request("/api/md/_catalog"),
      async () => html(404),
      assets
    )
    expect(await catalog.json()).toEqual({ count: 1 })
    const missing = await handleAgentRequest(
      request("/api/md/account"),
      async () => html(404),
      assets
    )
    expect(missing.status).toBe(404)
    expect(missing.headers.get("content-type")).toContain("text/markdown")
  })

  it("answers Markdown requests for private pages with a Markdown 404", async () => {
    const response = await handleAgentRequest(
      request("/account", "text/markdown"),
      async () => html(),
      assets
    )
    expect(response.status).toBe(404)
    expect(response.headers.get("content-type")).toContain("text/markdown")
  })

  it("returns a Markdown 404 for unknown .md URLs", async () => {
    for (const path of ["/does-not-exist.md", "/blog/nope.md"]) {
      const response = await handleAgentRequest(
        request(path),
        async () => html(404),
        assets
      )
      expect(response.status, path).toBe(404)
      expect(response.headers.get("content-type")).toContain("text/markdown")
    }
  })

  it("answers preflight requests", async () => {
    const response = await handleAgentRequest(
      request("/pricing.md", undefined, "OPTIONS"),
      async () => html(),
      assets
    )
    expect(response.status).toBe(204)
    expect(response.headers.get("access-control-allow-methods")).toContain(
      "GET"
    )
  })

  it("sends no Markdown body for HEAD", async () => {
    const response = await handleAgentRequest(
      request("/", "text/markdown", "HEAD"),
      async () => html(),
      assets
    )
    expect(response.headers.get("content-type")).toContain("text/markdown")
    expect(await response.text()).toBe("")
  })

  it("returns a Markdown 404 that keeps the status", async () => {
    const response = await handleAgentRequest(
      request("/nope", "text/markdown"),
      async () => html(404),
      assets
    )
    expect(response.status).toBe(404)
    expect(response.headers.get("content-type")).toContain("text/markdown")
    expect(await response.text()).toContain("llms.txt")
  })

  it("keeps the HTML 404 for browsers", async () => {
    const response = await handleAgentRequest(
      request("/nope", "text/html"),
      async () => html(404),
      assets
    )
    expect(response.status).toBe(404)
    expect(response.headers.get("content-type")).toContain("text/html")
    expect(response.headers.get("vary")).toContain("Accept")
  })

  it("turns HTML errors under /api into problem JSON", async () => {
    const response = await handleAgentRequest(
      request("/api/nope", "text/html"),
      async () => html(404),
      assets
    )
    expect(response.status).toBe(404)
    expect(response.headers.get("content-type")).toBe(
      "application/problem+json"
    )
    const body = await response.json()
    expect(body).toMatchObject({
      status: 404,
      code: "not_found",
      title: "Not found",
    })
    expect(body.detail).toContain("GET /api/nope")
    expect(body.resolution).toContain("openapi.json")
  })

  it("maps 405 to method_not_allowed", async () => {
    const response = await handleAgentRequest(
      request("/api/checkout"),
      async () => html(405),
      assets
    )
    expect((await response.json()).code).toBe("method_not_allowed")
  })

  it("leaves JSON API errors and other responses alone", async () => {
    const json = Response.json({ error: "Sign in first" }, { status: 401 })
    expect(
      await handleAgentRequest(
        request("/api/account"),
        async () => json,
        assets
      )
    ).toBe(json)

    const ok = html()
    expect(
      await handleAgentRequest(request("/mcp"), async () => ok, assets)
    ).toBe(ok)
  })
})
