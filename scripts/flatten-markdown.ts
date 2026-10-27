import fs from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const outDir = path.join(root, "out")
const markdownDir = path.join(outDir, "md")

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return entry.name.endsWith(".md") ? [full] : []
  })
}

let count = 0

for (const file of walk(markdownDir)) {
  const target = path.join(outDir, path.relative(markdownDir, file))
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.renameSync(file, target)
  count += 1
}

fs.rmSync(markdownDir, { recursive: true, force: true })

console.log(`markdown: moved ${count} Markdown pages next to their HTML`)
