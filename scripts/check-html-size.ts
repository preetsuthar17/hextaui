import fs from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const outDir = path.join(root, "out")
const budget = 1_500_000
const exempt = new Set(["out/docs/stress.html"])

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return entry.name.endsWith(".html") ? [full] : []
  })
}

function format(bytes: number) {
  return `${(bytes / 1_000_000).toFixed(2)} MB`
}

if (!fs.existsSync(outDir)) {
  process.exit(0)
}

const pages = walk(outDir)
  .map((file) => ({
    file: path.relative(root, file),
    size: fs.statSync(file).size,
  }))
  .sort((a, b) => b.size - a.size)

const checked = pages.filter((page) => !exempt.has(page.file))
const over = checked.filter((page) => page.size > budget)

if (over.length > 0) {
  console.error(
    `html: ${over.length} ${over.length === 1 ? "page is" : "pages are"} over ${format(budget)}\n${over
      .map((page) => `  ${format(page.size)}  ${page.file}`)
      .join("\n")}`
  )
  process.exit(1)
}

console.log(
  `html: ${checked.length} pages under ${format(budget)} (exempt: ${[...exempt].join(", ")}), largest:\n${checked
    .slice(0, 5)
    .map((page) => `  ${format(page.size)}  ${page.file}`)
    .join("\n")}`
)
