type OutEntry = { name: string; directory: boolean }

const pagesConfigFiles = new Set([
  "_headers",
  "_redirects",
  "_routes.json",
  "_worker.js",
])
const assetDirectories = new Set(["_next", "_not-found", "og", "preview"])
const assetFiles = new Set(["opengraph-image"])
const assetExtension = /\.(png|jpe?g|gif|webp|avif|svg|ico|webmanifest)$/
const maxRules = 100

function isRscPayload(name: string, siblings: OutEntry[]) {
  if (!name.endsWith(".txt")) return false
  if (name.startsWith("__next.")) return true
  const page = `${name.slice(0, -4)}.html`
  return siblings.some((entry) => entry.name === page)
}

function excludeAssets(entries: OutEntry[], exclude: Set<string>) {
  for (const { name, directory } of entries) {
    if (name.startsWith(".") || pagesConfigFiles.has(name)) continue
    const route = `/${name}`
    if (directory) {
      if (assetDirectories.has(name)) exclude.add(`${route}/*`)
      continue
    }
    if (
      assetFiles.has(name) ||
      assetExtension.test(name) ||
      isRscPayload(name, entries) ||
      name === "_not-found.html"
    ) {
      exclude.add(route)
    }
  }
}

function getPagesRoutes(entries: OutEntry[]) {
  const exclude = new Set<string>()
  excludeAssets(entries, exclude)
  for (const rule of [...exclude]) {
    if (rule.endsWith("/*")) exclude.delete(rule.slice(0, -2))
  }

  const routes = {
    version: 1,
    description:
      "Functions run for pages, Markdown, llms.txt, the registry and the API so AI agents can be counted. Build assets, images and RSC payloads skip them; _redirects still applies through next().",
    include: ["/*"],
    exclude: [...exclude].sort(),
  }

  const rules = routes.include.length + routes.exclude.length
  if (rules > maxRules) {
    throw new Error(
      `_routes.json has ${rules} rules; Cloudflare Pages allows ${maxRules}.`
    )
  }
  const long = routes.exclude.find((rule) => rule.length > 100)
  if (long) {
    throw new Error(`_routes.json rule is over 100 characters: ${long}`)
  }

  return routes
}

export { getPagesRoutes, type OutEntry }
