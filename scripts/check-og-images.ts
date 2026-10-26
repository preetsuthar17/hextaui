import fs from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const outDir = path.join(root, "out")
const fallback = "/opengraph-image"
const skipped = new Set(["/404", "/_not-found"])

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return entry.name.endsWith(".html") ? [full] : []
  })
}

function routeOf(file: string) {
  const route = `/${path.relative(outDir, file).replace(/\\/g, "/")}`
    .replace(/\.html$/, "")
    .replace(/\/index$/, "")
  return route === "" ? "/" : route
}

function metaContents(html: string, name: string) {
  const pattern = new RegExp(
    `<meta (?:property|name)="${name}" content="([^"]+)"`,
    "g"
  )
  return [...html.matchAll(pattern)].map((match) => match[1])
}

const problems: string[] = []
let checked = 0

for (const file of walk(outDir)) {
  const route = routeOf(file)
  if (skipped.has(route)) continue
  const html = fs.readFileSync(file, "utf8")
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html)

  for (const name of ["og:image", "twitter:image"]) {
    const images = metaContents(html, name)
    if (images.length === 0) {
      problems.push(`${route}: no ${name}`)
      continue
    }
    for (const image of images) {
      const { pathname } = new URL(image.replaceAll("&amp;", "&"))
      if (pathname === fallback && !noindex && route !== "/") {
        problems.push(`${route}: ${name} is the generic image, add it to lib/og-pages.ts`)
      }
      if (!fs.existsSync(path.join(outDir, pathname))) {
        problems.push(`${route}: ${name} ${pathname} was not built`)
      }
    }
  }
  checked++
}

if (problems.length > 0) {
  console.error(`og images: ${problems.length} problems`)
  for (const problem of problems.slice(0, 50)) console.error(`  ${problem}`)
  process.exit(1)
}

console.log(`og images: ${checked} pages point at a built image`)
