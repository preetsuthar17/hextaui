import fs from "node:fs"
import path from "node:path"

import { getPagesRoutes, type OutEntry } from "../lib/pages-routes.ts"

const root = path.resolve(import.meta.dirname, "..")
const outDir = path.join(root, "out")
const functionsDir = path.join(root, "functions")

function read(dir: string, depth: number): OutEntry[] {
  return fs.readdirSync(dir, { withFileTypes: true }).map((entry) => ({
    name: entry.name,
    directory: entry.isDirectory(),
    children:
      entry.isDirectory() && depth > 0
        ? read(path.join(dir, entry.name), depth - 1)
        : undefined,
  }))
}

const functions = fs.readdirSync(functionsDir, { withFileTypes: true })

const routes = getPagesRoutes(read(outDir, 1), {
  files: functions
    .filter((entry) => entry.isFile() && !entry.name.startsWith("_"))
    .map((entry) => `/${entry.name.replace(/\.ts$/, "")}`),
  directories: functions
    .filter((entry) => entry.isDirectory())
    .map((entry) => `/${entry.name}`),
})

fs.writeFileSync(
  path.join(outDir, "_routes.json"),
  `${JSON.stringify(routes, null, 2)}\n`
)
console.log(
  `routes: ${routes.exclude.length} static paths skip Pages Functions`
)
