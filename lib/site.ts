const siteName = "HextaUI"
const siteUrl = "https://hextaui.com"
const siteDescription =
  "Ready-to-use foundation components/blocks built on top of shadcn/ui."
const siteTitle = "HextaUI — React components and blocks for shadcn/ui"
const siteSummary =
  "HextaUI is an open-source React component library on shadcn/ui and Tailwind CSS: accessible components and blocks with motion and states already handled."
const siteAlternateNames = ["Hexta UI", "Hexta", "hextaui"]
const siteTwitter = "@preetsuthar17"
const siteRepository = "https://github.com/preetsuthar17/hextaui"

const noindexPaths = ["/docs/stress", "/preview/", "/account", "/api/"]

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
  siteDescription,
  siteName,
  siteRepository,
  siteSummary,
  siteTitle,
  siteTwitter,
  siteUrl,
}
