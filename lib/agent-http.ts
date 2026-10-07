import { apiError, apiNotFound } from "@/lib/api-error"
import { siteUrl } from "@/lib/site"

type Next = () => Promise<Response>
type Assets = (path: string) => Promise<Response>

const markdownTypes = ["text/markdown", "text/x-markdown"]

function acceptQuality(accept: string, type: string) {
  let best = -1
  let bestSpecificity = -1

  for (const part of accept.split(",")) {
    const [range = "", ...params] = part.trim().toLowerCase().split(";")
    const [major, minor] = range.trim().split("/")
    const [typeMajor, typeMinor] = type.split("/")
    const specificity =
      major === typeMajor && minor === typeMinor
        ? 2
        : major === typeMajor && minor === "*"
          ? 1
          : major === "*" && minor === "*"
            ? 0
            : -1
    if (specificity < bestSpecificity || specificity < 0) {
      continue
    }

    const q = params
      .map((param) => param.trim().match(/^q=([0-9.]+)$/)?.[1])
      .find(Boolean)
    const quality = q === undefined ? 1 : Number(q)
    if (specificity > bestSpecificity || quality > best) {
      best = Number.isFinite(quality) ? quality : 0
      bestSpecificity = specificity
    }
  }

  return best
}

function prefersMarkdown(accept: string | null) {
  if (!accept) {
    return false
  }
  const lower = accept.toLowerCase()
  if (!markdownTypes.some((type) => lower.includes(type))) {
    return false
  }
  const markdown = Math.max(
    ...markdownTypes.map((type) => acceptQuality(accept, type))
  )
  return markdown > 0 && markdown >= acceptQuality(accept, "text/html")
}

const aiAgentPattern =
  /\b(GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-User|Claude-SearchBot|anthropic-ai|PerplexityBot|Perplexity-User|Google-Extended|Applebot-Extended|DeepSeekBot|ora-agent|cohere-ai|MistralAI-User)\b/i

function isAiAgent(userAgent: string | null) {
  return userAgent ? aiAgentPattern.test(userAgent) : false
}

function withVary(response: Response, ...headers: string[]) {
  const vary = response.headers.get("vary")
  const values = vary ? vary.split(",").map((value) => value.trim()) : []
  const missing = headers.filter(
    (header) =>
      !values.some((value) => value.toLowerCase() === header.toLowerCase())
  )
  if (missing.length === 0) {
    return response
  }
  const next = new Response(response.body, response)
  next.headers.set("vary", [...values, ...missing].filter(Boolean).join(", "))
  return next
}

async function markdownResponse(
  assets: Assets,
  path: string,
  status: number,
  method: string
) {
  const source = await assets(path)
  if (!source.ok) {
    return null
  }
  const body = await source.text()
  return new Response(method === "HEAD" ? null : body, {
    status,
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      vary: status === 200 ? "Accept, User-Agent" : "Accept",
      "cache-control":
        status === 200 ? "public, max-age=0, must-revalidate" : "no-store",
      "access-control-allow-origin": "*",
      ...(status === 200 ? {} : { "x-robots-tag": "noindex" }),
    },
  })
}

function isApiPath(pathname: string) {
  return (
    pathname === "/api" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/r/pro/")
  )
}

function isJson(response: Response) {
  return /json/i.test(response.headers.get("content-type") ?? "")
}

async function handleAgentRequest(
  request: Request,
  next: Next,
  assets: Assets
) {
  const url = new URL(request.url)
  const readable = request.method === "GET" || request.method === "HEAD"
  const markdown = readable && prefersMarkdown(request.headers.get("accept"))

  if (url.pathname === "/" && readable) {
    if (markdown || isAiAgent(request.headers.get("user-agent"))) {
      const response = await markdownResponse(
        assets,
        "/index.md",
        200,
        request.method
      )
      if (response) {
        return response
      }
    }
    return withVary(await next(), "Accept", "User-Agent")
  }

  const response = await next()

  if (response.status >= 400 && isApiPath(url.pathname) && !isJson(response)) {
    return response.status === 405
      ? apiError("method_not_allowed", {
          detail: `${request.method} is not supported on ${url.pathname}.`,
          resolution: `See ${siteUrl}/openapi.json for the methods each endpoint accepts.`,
        })
      : apiNotFound(`${request.method} ${url.pathname}`)
  }

  if (response.status === 404 && !isApiPath(url.pathname)) {
    if (markdown) {
      const notFound = await markdownResponse(
        assets,
        "/404.md",
        404,
        request.method
      )
      if (notFound) {
        return notFound
      }
    }
    return withVary(response, "Accept")
  }

  return response
}

export {
  acceptQuality,
  handleAgentRequest,
  isAiAgent,
  isApiPath,
  prefersMarkdown,
}
