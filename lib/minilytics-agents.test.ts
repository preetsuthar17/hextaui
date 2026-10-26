import { describe, expect, it, vi } from "vitest"

import { isMaybeAgent, trackAgent } from "@/lib/minilytics-agents"

const chrome =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"

function request(path: string, headers: Record<string, string> = {}) {
  return new Request(`https://hextaui.com${path}`, { headers })
}

describe("isMaybeAgent", () => {
  it("ignores people browsing pages", () => {
    expect(
      isMaybeAgent(
        request("/docs/button", { "user-agent": chrome }),
        "/docs/button"
      )
    ).toBe(false)
  })

  it("flags crawlers, assistants and tools", () => {
    for (const ua of [
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)",
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Claude-User/1.0)",
      "curl/8.7.1",
      "node",
      "",
    ]) {
      expect(isMaybeAgent(request("/", { "user-agent": ua }), "/")).toBe(true)
    }
  })

  it("flags files only agents ask for", () => {
    for (const path of [
      "/llms.txt",
      "/docs/llms.txt",
      "/robots.txt",
      "/r/button.json",
      "/docs/button.md",
    ]) {
      expect(isMaybeAgent(request(path, { "user-agent": chrome }), path)).toBe(
        true
      )
    }
  })

  it("flags Markdown requests and signed agents", () => {
    expect(
      isMaybeAgent(
        request("/", { "user-agent": chrome, accept: "text/markdown" }),
        "/"
      )
    ).toBe(true)
    expect(
      isMaybeAgent(
        request("/", {
          "user-agent": chrome,
          "signature-agent": '"https://chatgpt.com"',
        }),
        "/"
      )
    ).toBe(true)
  })
})

describe("trackAgent", () => {
  it("does nothing without an API key or for people", () => {
    const waitUntil = vi.fn()
    trackAgent(
      request("/", { "user-agent": "GPTBot/1.2" }),
      waitUntil,
      undefined
    )
    trackAgent(request("/", { "user-agent": chrome }), waitUntil, "ml_test")
    trackAgent(
      request("/stats/event", { "user-agent": "node" }),
      waitUntil,
      "ml_test"
    )
    expect(waitUntil).not.toHaveBeenCalled()
  })

  it("reports agents in the background", async () => {
    const fetchMock = vi.fn(async () => new Response(null))
    vi.stubGlobal("fetch", fetchMock)
    const pending: Promise<unknown>[] = []
    trackAgent(
      request("/docs/button.md", {
        "user-agent": "GPTBot/1.2",
        "cf-connecting-ip": "203.0.113.7",
        "cf-ipcountry": "US",
      }),
      (promise) => pending.push(promise),
      "ml_test",
      200
    )
    await Promise.all(pending)
    vi.unstubAllGlobals()

    expect(fetchMock).toHaveBeenCalledOnce()
    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ]
    expect(url).toBe(
      "https://preet-datafast.preetsutharxd.workers.dev/api/v1/agents"
    )
    expect(init.headers).toMatchObject({ authorization: "Bearer ml_test" })
    expect(JSON.parse(String(init.body))).toMatchObject({
      url: "https://hextaui.com/docs/button.md",
      ua: "GPTBot/1.2",
      status: 200,
      ip: "203.0.113.7",
      country: "US",
    })
  })
})
