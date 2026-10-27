const markdownRoutePatterns = [
  "/",
  "/pricing",
  "/about",
  "/contact",
  "/changelog",
  "/sponsor",
  "/components",
  "/components/:category",
  "/blocks",
  "/blocks/:name",
  "/docs",
  "/docs/:slug",
  "/docs/:slug/examples/:example",
  "/blog",
  "/blog/:slug",
  "/compare",
  "/compare/:slug",
  "/compare/shadcn-ui/:component",
  "/legal/:page",
  "/research",
  "/research/:topic",
  "/tools",
  "/tools/:slug",
] as const

const markdownSkippedRoutes: Record<string, string> = {
  "/account": "Signed-in account page; private to each user.",
  "/unsubscribe": "Email unsubscribe confirmation; noindex, no content.",
  "/docs/stress": "Internal stress-test page; noindex.",
  "/preview/blocks/[name]":
    "Bare block previews embedded in iframes; noindex, no prose.",
  "/[lang]":
    "Machine translations of the English pages; the English Markdown is canonical.",
}

type MarkdownRoutePattern = (typeof markdownRoutePatterns)[number]

const patternExpressions = markdownRoutePatterns.map(
  (pattern) =>
    [
      pattern,
      new RegExp(`^${pattern.replace(/:[a-z]+/g, "[a-z0-9][a-z0-9-]*")}$`),
    ] as const
)

function normalizeMarkdownPath(path: string) {
  const trimmed = path.replace(/\/+$/, "")
  return trimmed === "" || trimmed === "/index" ? "/" : trimmed
}

function matchMarkdownRoute(path: string): MarkdownRoutePattern | null {
  const route = normalizeMarkdownPath(path)
  return (
    patternExpressions.find(([, expression]) => expression.test(route))?.[0] ??
    null
  )
}

function markdownPathFor(path: string) {
  const route = normalizeMarkdownPath(path)
  return route === "/" ? "/index.md" : `${route}.md`
}

function htmlPathFor(markdownPath: string) {
  return normalizeMarkdownPath(markdownPath.replace(/\.md$/, ""))
}

export {
  htmlPathFor,
  markdownPathFor,
  markdownRoutePatterns,
  markdownSkippedRoutes,
  matchMarkdownRoute,
  normalizeMarkdownPath,
  type MarkdownRoutePattern,
}
