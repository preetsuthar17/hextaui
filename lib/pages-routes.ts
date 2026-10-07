type OutEntry = { name: string; directory: boolean; children?: OutEntry[] }

type FunctionRoutes = { files: string[]; directories: string[] }

const pagesConfigFiles = new Set([
  "_headers",
  "_redirects",
  "_routes.json",
  "_worker.js",
])
const maxRules = 100

function excludeEntries(
  entries: OutEntry[],
  prefix: string,
  functions: FunctionRoutes,
  exclude: Set<string>
) {
  for (const { name, directory, children } of entries) {
    if (name.startsWith(".") && name !== ".well-known") continue
    if (pagesConfigFiles.has(name)) continue
    const route = `${prefix}/${name}`

    if (directory) {
      if (functions.directories.includes(route)) continue
      if (functions.files.includes(route)) {
        excludeEntries(children ?? [], route, functions, exclude)
        continue
      }
      exclude.add(`${route}/*`)
      continue
    }
    if (route === "/index.html") continue
    exclude.add(route)
    if (name.endsWith(".html")) exclude.add(route.slice(0, -5))
  }
}

function getPagesRoutes(entries: OutEntry[], functions: FunctionRoutes) {
  const exclude = new Set<string>()
  excludeEntries(entries, "", functions, exclude)
  for (const file of functions.files) exclude.delete(file)

  const routes = {
    version: 1,
    description:
      "Functions run for /, /api/*, /mcp, /r/* and unknown paths. Static pages and assets never invoke them.",
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

export { getPagesRoutes, type FunctionRoutes, type OutEntry }
