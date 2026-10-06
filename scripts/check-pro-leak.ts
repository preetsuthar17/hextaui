import fs from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const blocksDir = path.join(root, "pro/blocks")
const outDir = path.join(root, "out")
const sourceSyntax = /className="|from "|function |=> |const |return \(/

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })
}

function sourceLines(file: string) {
  return fs
    .readFileSync(file, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length >= 24 && sourceSyntax.test(line))
}

function isSource(file: string) {
  return /\.(ts|tsx)$/.test(file) && !file.includes(`${path.sep}generated`)
}

if (!fs.existsSync(blocksDir) || !fs.existsSync(outDir)) {
  process.exit(0)
}

const publicSource = ["app", "components", "hooks", "lib"]
  .map((dir) => path.join(root, dir))
  .filter((dir) => fs.existsSync(dir))
  .flatMap(walk)
  .filter(isSource)
  .map((file) => fs.readFileSync(file, "utf8"))
  .join("\n")

const needles = [
  ...new Set(
    walk(blocksDir)
      .filter(
        (file) =>
          isSource(file) &&
          !path.basename(file).startsWith("usage") &&
          !/\.test\.tsx?$/.test(file)
      )
      .flatMap(sourceLines)
      .filter((line) => !publicSource.includes(line))
  ),
]

const leaks = walk(outDir).flatMap((file) => {
  const text = fs.readFileSync(file, "utf8")
  return needles
    .filter((needle) => text.includes(needle))
    .map((needle) => `${path.relative(root, file)}: ${needle}`)
})

if (leaks.length > 0) {
  console.error(`pro: source leaked into out/\n${leaks.join("\n")}`)
  process.exit(1)
}

console.log(`pro: no source in out/ (${needles.length} markers checked)`)
