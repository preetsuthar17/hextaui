import { apiError, apiNotFound } from "@/lib/api-error"
import {
  handleMarkdownApi,
  isMarkdownApiPath,
  markdownNotFound,
  serveMarkdown,
} from "@/lib/md/http"
import { htmlPathFor, matchMarkdownRoute } from "@/lib/md/routes"
import { isNoindexPath, siteUrl } from "@/lib/site"

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
  return markdown > 0 && markdown > acceptQuality(accept, "text/html")
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
  const { pathname } = url
  const readable = request.method === "GET" || request.method === "HEAD"
  const markdown = readable && prefersMarkdown(request.headers.get("accept"))

  if (isMarkdownApiPath(pathname)) {
    return handleMarkdownApi(request, assets)
  }

  if (pathname.endsWith(".md")) {
    const path = htmlPathFor(pathname)
    if (matchMarkdownRoute(path)) {
      return serveMarkdown({ request, assets, path, negotiated: false })
    }
    const response = await next()
    return response.status === 404 && readable
      ? markdownNotFound(request, assets, false)
      : response
  }

  if (markdown && isNoindexPath(pathname)) {
    return markdownNotFound(request, assets, true)
  }

  if (matchMarkdownRoute(pathname)) {
    if (markdown) {
      return serveMarkdown({
        request,
        assets,
        path: pathname,
        negotiated: true,
      })
    }
    return withVary(await next(), "Accept")
  }

  const response = await next()

  if (response.status >= 400 && isApiPath(pathname) && !isJson(response)) {
    return response.status === 405
      ? apiError("method_not_allowed", {
          detail: `${request.method} is not supported on ${pathname}.`,
          resolution: `See ${siteUrl}/openapi.json for the methods each endpoint accepts.`,
        })
      : apiNotFound(`${request.method} ${pathname}`)
  }

  if (response.status === 404 && !isApiPath(pathname)) {
    if (markdown) {
      return markdownNotFound(request, assets, true)
    }
    return withVary(response, "Accept")
  }

  return response
}

export { acceptQuality, handleAgentRequest, isApiPath, prefersMarkdown }
