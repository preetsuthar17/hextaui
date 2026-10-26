import { minilyticsOrigin } from "@/lib/minilytics"

const agentsEndpoint = `${minilyticsOrigin}/api/v1/agents`

const maybeAgentPattern =
  /bot|crawl|spider|agent|fetch|-user|claude|openai|gpt|perplexity|gemini|cursor|codex|copilot|headless|python|node|curl|wget|go-http|java|okhttp|axios|undici|ruby|rust|scrapy/i
const agentPathPattern =
  /^\/(llms(-full)?\.txt|robots\.txt|r\/.+\.json)$|\.mdx?$|\/llms\.txt$/

function isMaybeAgent(request: Request, pathname: string) {
  const headers = request.headers
  const userAgent = headers.get("user-agent") ?? ""
  return (
    Boolean(headers.get("signature-agent")) ||
    maybeAgentPattern.test(userAgent) ||
    !userAgent.startsWith("Mozilla/") ||
    agentPathPattern.test(pathname) ||
    (headers.get("accept") ?? "").includes("text/markdown")
  )
}

function trackAgent(
  request: Request,
  waitUntil: (promise: Promise<unknown>) => void,
  apiKey: string | undefined,
  status?: number
) {
  if (!apiKey) return
  const pathname = new URL(request.url).pathname
  if (pathname.startsWith("/stats/") || !isMaybeAgent(request, pathname)) {
    return
  }
  const headers = request.headers
  waitUntil(
    fetch(agentsEndpoint, {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        url: request.url,
        ua: headers.get("user-agent") ?? "",
        accept: headers.get("accept") ?? "",
        status,
        signature_agent: headers.get("signature-agent"),
        ip: headers.get("cf-connecting-ip") ?? headers.get("x-forwarded-for"),
        country: headers.get("cf-ipcountry"),
        referer: headers.get("referer"),
      }),
    }).catch(() => {})
  )
}

export { isMaybeAgent, trackAgent }
