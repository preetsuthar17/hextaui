const siteName = "HextaUI"
const siteUrl = "https://hextaui.com"
const siteDescription =
  "Practical shadcn/ui blocks built for AI products, with the hard states handled."
const siteTitle = "HextaUI — React components and blocks for shadcn/ui"
const siteSummary =
  "HextaUI is practical shadcn/ui blocks built for AI products, with streaming, tool calls and every other hard state handled, on a free, open-source React component library."
const siteAlternateNames = ["Hexta UI", "Hexta", "hextaui"]
const siteTwitter = "@preetsuthar17"
const siteRepository = "https://github.com/preetsuthar17/hextaui"
const siteContactEmail = "hi@preetsuthar.me"
const siteAuthor = "Preet Suthar"

const noindexPaths = [
  "/docs/stress",
  "/preview/",
  "/account",
  "/api/",
  "/unsubscribe",
]

function isNoindexPath(route: string) {
  return noindexPaths.some((prefix) =>
    prefix.endsWith("/")
      ? route.startsWith(prefix) || `${route}/` === prefix
      : route === prefix || route.startsWith(`${prefix}/`)
  )
}

function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString()
}

export {
  absoluteUrl,
  isNoindexPath,
  noindexPaths,
  siteAlternateNames,
  siteAuthor,
  siteContactEmail,
  siteDescription,
  siteName,
  siteRepository,
  siteSummary,
  siteTitle,
  siteTwitter,
  siteUrl,
}
