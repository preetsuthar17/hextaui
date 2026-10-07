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

const assets = async (path: string) =>
  path === "/index.md"
    ? new Response("# HextaUI\n")
    : path === "/404.md"
      ? new Response("# Page not found\n\nSee https://hextaui.com/llms.txt\n")
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
    ["text/html, text/markdown", true],
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
    expect(response.headers.get("vary")).toBe("Accept, User-Agent")
    expect(await response.text()).toBe("# HextaUI\n")
  })

  it("keeps HTML for browsers and varies on Accept", async () => {
    const response = await handleAgentRequest(
      request("/", "text/html,*/*;q=0.8"),
      async () => html(),
      assets
    )
    expect(response.headers.get("content-type")).toContain("text/html")
    expect(response.headers.get("vary")).toBe(
      "accept-encoding, Accept, User-Agent"
    )
    expect(await response.text()).toContain("<h1>")
  })

  it.each([
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2; +https://openai.com/gptbot",
    "PerplexityBot/1.0",
  ])("serves Markdown on the homepage to AI agent %s", async (userAgent) => {
    const response = await handleAgentRequest(
      request("/", "text/html", "GET", userAgent),
      async () => html(),
      assets
    )
    expect(response.headers.get("content-type")).toContain("text/markdown")
  })

  it("keeps HTML for search engines and browsers", async () => {
    for (const userAgent of [
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 15_0) AppleWebKit/605.1.15 Safari/605.1.15",
    ]) {
      const response = await handleAgentRequest(
        request("/", "text/html", "GET", userAgent),
        async () => html(),
        assets
      )
      expect(response.headers.get("content-type")).toContain("text/html")
    }
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
