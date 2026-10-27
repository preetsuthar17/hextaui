const siteName = "HextaUI"
const siteUrl = "https://hextaui.com"
const siteDescription =
  "Ship your AI app’s chat UI faster with shadcn/ui blocks that already handle streaming, tool calls, voice and agent states."
const siteTitle = "HextaUI — React components and blocks for shadcn/ui"
const siteSummary =
  "HextaUI gets your AI app’s chat UI shipped in days, not weeks: shadcn/ui blocks with streaming, tool calls, voice and agent states already handled, on a free, open-source React component library."
const siteMetaDescription =
  "Ship your AI app’s chat UI in days, not weeks, with shadcn/ui blocks for streaming, tool calls, voice and agent states, on free, open-source React components."
const siteAlternateNames = ["Hexta UI", "Hexta", "hextaui"]
const siteTwitter = "@preetsuthar17"
const siteDefaultImage = "/opengraph-image"
const siteThemeColor = { light: "#ffffff", dark: "#0a0a0a" }
const siteRepository = "https://github.com/preetsuthar17/hextaui"
const siteContactEmail = "hi@preetsuthar.me"
const siteAuthor = "Preet Suthar"
const siteAuthorUrl = "https://twitter.com/preetsuthar17"

const noindexPaths = [
  "/docs/stress",
  "/preview/",
  "/account",
  "/api/",
  "/unsubscribe",
]

const embeddedOnlyPaths = ["/preview/"]

const crawlDisallowPaths = [
  ...noindexPaths.filter((path) => !embeddedOnlyPaths.includes(path)),
  "/r/",
]

const crawlAllowPaths = ["/", "/r/registry.json"]

function isNoindexPath(route: string) {
  return noindexPaths.some((prefix) =>
    prefix.endsWith("/")
      ? route.startsWith(prefix) || `${route}/` === prefix
      : route === prefix || route.startsWith(`${prefix}/`)
  )
}

const unlistedPaths = [/^\/docs\/[^/]+\/examples\//]

function isUnlistedPath(route: string) {
  return unlistedPaths.some((pattern) => pattern.test(route))
}

function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString()
}

export {
  absoluteUrl,
  crawlAllowPaths,
  crawlDisallowPaths,
  isNoindexPath,
  isUnlistedPath,
  noindexPaths,
  siteAlternateNames,
  siteAuthor,
  siteAuthorUrl,
  siteContactEmail,
  siteDefaultImage,
  siteDescription,
  siteMetaDescription,
  siteName,
  siteRepository,
  siteSummary,
  siteThemeColor,
  siteTitle,
  siteTwitter,
  siteUrl,
}
