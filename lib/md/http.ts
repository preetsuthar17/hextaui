import { approximateTokens } from "@/lib/md/format"
import {
  markdownPathFor,
  matchMarkdownRoute,
  normalizeMarkdownPath,
} from "@/lib/md/routes"
import { absoluteUrl, siteName } from "@/lib/site"

type Assets = (path: string) => Promise<Response>

type MarkdownRequest = {
  request: Request
  assets: Assets
  path: string
  negotiated: boolean
}

const markdownCatalogAsset = "/markdown-catalog.json"
const markdownApiPrefix = "/api/md"

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, HEAD, OPTIONS",
  "access-control-allow-headers": "Accept, Content-Type",
  "access-control-expose-headers":
    "Content-Location, Last-Modified, Link, X-Markdown-Tokens",
  "access-control-max-age": "86400",
}

const fallbackNotFound = `# Page not found

> There is no ${siteName} page at this URL.

- [llms.txt](${absoluteUrl("/llms.txt")}): every page as Markdown
- [Markdown catalog](${absoluteUrl("/api/md/_catalog")}): every Markdown URL
- [Sitemap](${absoluteUrl("/sitemap.xml")}): every public page
`

function lastModified(markdown: string) {
  const date = /^Last updated: (\d{4}-\d{2}-\d{2})$/m.exec(markdown)?.[1]
  return date ? new Date(`${date}T00:00:00Z`).toUTCString() : null
}

function cacheControl(path: string) {
  return /:/.test(matchMarkdownRoute(path) ?? ":")
    ? "public, s-maxage=3600, stale-while-revalidate=86400"
    : "public, s-maxage=86400, stale-while-revalidate=604800"
}

function preflight() {
  return new Response(null, {
    status: 204,
    headers: { ...corsHeaders, allow: "GET, HEAD, OPTIONS" },
  })
}

function methodNotAllowed() {
  return new Response(`# Method not allowed\n\nUse GET or HEAD.\n`, {
    status: 405,
    headers: {
      ...corsHeaders,
      allow: "GET, HEAD, OPTIONS",
      "content-type": "text/markdown; charset=utf-8",
      "x-robots-tag": "noindex",
    },
  })
}

async function markdownNotFound(
  request: Request,
  assets: Assets,
  negotiated: boolean
) {
  const source = await assets("/404.md").catch(() => null)
  const body = source?.ok ? await source.text() : fallbackNotFound
  return new Response(request.method === "HEAD" ? null : body, {
    status: 404,
    headers: {
      ...corsHeaders,
      "content-type": "text/markdown; charset=utf-8",
      "x-markdown-tokens": String(approximateTokens(body)),
      "x-robots-tag": "noindex",
      "cache-control": "no-store",
      ...(negotiated ? { vary: "Accept" } : {}),
    },
  })
}

async function serveMarkdown({
  request,
  assets,
  path,
  negotiated,
}: MarkdownRequest) {
  if (request.method === "OPTIONS") return preflight()
  if (request.method !== "GET" && request.method !== "HEAD") {
    return methodNotAllowed()
  }

  const route = normalizeMarkdownPath(path)
  const source = matchMarkdownRoute(route)
    ? await assets(markdownPathFor(route))
    : null
  if (!source?.ok) return markdownNotFound(request, assets, negotiated)

  const body = await source.text()
  const canonical = absoluteUrl(route)
  const modified = lastModified(body)
  return new Response(request.method === "HEAD" ? null : body, {
    status: 200,
    headers: {
      ...corsHeaders,
      "content-type": "text/markdown; charset=utf-8",
      "x-markdown-tokens": String(approximateTokens(body)),
      "x-robots-tag": "noindex, follow",
      "content-location": canonical,
      link: `<${canonical}>; rel="canonical"`,
      "cache-control": cacheControl(route),
      ...(modified ? { "last-modified": modified } : {}),
      ...(negotiated ? { vary: "Accept" } : {}),
    },
  })
}

async function serveMarkdownCatalog(request: Request, assets: Assets) {
  const source = await assets(markdownCatalogAsset)
  if (!source.ok) return markdownNotFound(request, assets, false)
  const body = await source.text()
  return new Response(request.method === "HEAD" ? null : body, {
    headers: {
      ...corsHeaders,
      "content-type": "application/json; charset=utf-8",
      "x-robots-tag": "noindex",
      "cache-control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  })
}

function isMarkdownApiPath(pathname: string) {
  return (
    pathname === markdownApiPrefix ||
    pathname.startsWith(`${markdownApiPrefix}/`)
  )
}

function handleMarkdownApi(request: Request, assets: Assets) {
  if (request.method === "OPTIONS") return preflight()
  if (request.method !== "GET" && request.method !== "HEAD") {
    return methodNotAllowed()
  }
  const { pathname } = new URL(request.url)
  const rest = pathname.slice(markdownApiPrefix.length).replace(/\.md$/, "")
  if (rest === "/_catalog") return serveMarkdownCatalog(request, assets)
  return serveMarkdown({
    request,
    assets,
    path: rest || "/",
    negotiated: false,
  })
}

export {
  handleMarkdownApi,
  isMarkdownApiPath,
  markdownCatalogAsset,
  markdownNotFound,
  serveMarkdown,
}
