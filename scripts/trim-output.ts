import fs from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const outDir = path.join(root, "out")
const docsDir = path.join(outDir, "docs")
const fileLimit = 19_500

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })
}

function removeEmptyDirs(dir: string) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) removeEmptyDirs(path.join(dir, entry.name))
  }
  if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir)
}

let removed = 0

for (const slug of fs.existsSync(docsDir) ? fs.readdirSync(docsDir) : []) {
  const examplesDir = path.join(docsDir, slug, "examples")
  if (!fs.existsSync(examplesDir)) continue
  for (const file of walk(examplesDir)) {
    if (!file.endsWith(".txt")) continue
    fs.rmSync(file)
    removed += 1
  }
  removeEmptyDirs(examplesDir)
}

const total = walk(outDir).length

console.log(
  `output: removed ${removed} navigation payloads from example pages, ${total} files left (limit ${fileLimit})`
)

if (total > fileLimit) {
  console.error(
    `output: ${total} files is over ${fileLimit}. Cloudflare Pages rejects deployments over 20,000 files.`
  )
  process.exit(1)
}
