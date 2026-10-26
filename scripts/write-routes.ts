import fs from "node:fs"
import path from "node:path"

import { getPagesRoutes } from "../lib/pages-routes.ts"

const root = path.resolve(import.meta.dirname, "..")
const outDir = path.join(root, "out")

const entries = fs
  .readdirSync(outDir, { withFileTypes: true })
  .map((entry) => ({ name: entry.name, directory: entry.isDirectory() }))

const routes = getPagesRoutes(entries)

fs.writeFileSync(
  path.join(outDir, "_routes.json"),
  `${JSON.stringify(routes, null, 2)}\n`
)
console.log(
  `routes: ${routes.exclude.length} static paths skip Pages Functions`
)
