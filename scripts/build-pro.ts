import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

import { highlight } from "../lib/highlight.ts"

const root = path.resolve(import.meta.dirname, "..")
const proDir = path.join(root, "pro")
const blocksDir = path.join(proDir, "blocks")
const outDir = path.join(root, "lib/pro/generated")
const registryBase = "https://hextaui.com/r"
const proRepo = "github.com/preetsuthar17/hextaui-pro.git"

type BlockMeta = {
  title: string
  description: string
  category: string
  component: string
  entry?: string
  dependencies?: string[]
  usage?: { file: string; title: string; description: string }[]
  docs?: BlockDocs
}

type BlockDocs = {
  overview?: string[]
  anatomy?: { name: string; description: string }[]
  api?: {
    component: string
    description?: string
    props: {
      name: string
      type: string
      default?: string
      description?: string
    }[]
  }[]
  keyboard?: { keys: string[]; description: string }[]
  accessibility?: string[]
}

function ensureCheckout() {
  if (fs.existsSync(blocksDir)) return
  const token = process.env.HEXTAUI_PRO_TOKEN
  if (!token) {
    console.log(
      "pro: no checkout and no HEXTAUI_PRO_TOKEN, building without Pro blocks"
    )
    return
  }
  execFileSync(
    "git",
    [
      "clone",
      "--depth",
      "1",
      `https://x-access-token:${token}@${proRepo}`,
      proDir,
    ],
    { stdio: ["ignore", "ignore", "inherit"] }
  )
}

function listFiles(dir: string, base = dir): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return listFiles(full, base)
    if (
      entry.name === "block.json" ||
      /^usage(-[a-z0-9-]+)?\.tsx$/.test(entry.name) ||
      /\.test\.tsx?$/.test(entry.name)
    ) {
      return []
    }
    return [path.relative(base, full)]
  })
}

function withoutTemplates(source: string) {
  return source.replace(/`(?:\\[\s\S]|[^`\\])*`/g, "``")
}

function registryDependencies(sources: string[]) {
  const deps = new Set<string>()
  for (const source of sources.map(withoutTemplates)) {
    for (const [, kind, name] of source.matchAll(
      /from "@\/(components\/ui|hooks|lib)\/([a-z0-9-]+)"/g
    )) {
      if (kind === "lib" && name === "utils") continue
      deps.add(`${registryBase}/${name}.json`)
    }
    for (const [, block] of source.matchAll(/from "\.\.\/([a-z0-9-]+)\//g)) {
      deps.add(`@hextaui-pro/${block}`)
    }
  }
  if (
    sources.some((source) =>
      /animate-shimmer|text-shimmer|ease-out-quint/.test(source)
    )
  ) {
    deps.add(`${registryBase}/theme.json`)
  }
  return [...deps].sort()
}

function packageDependencies(sources: string[], extra: string[] = []) {
  const deps = new Set(extra)
  for (const source of sources.map(withoutTemplates)) {
    for (const [, spec] of source.matchAll(
      /from "([^"./@][^"]*|@[^"/]+\/[^"]+)"/g
    )) {
      const name = spec.startsWith("@")
        ? spec.split("/").slice(0, 2).join("/")
        : spec.split("/")[0]
      if (name === "@" || ["react", "react-dom", "next"].includes(name))
        continue
      deps.add(name)
    }
  }
  return [...deps].sort()
}

function lang(file: string) {
  const extension = path.extname(file).slice(1)
  return extension === "ts" || extension === "css" || extension === "json"
    ? extension
    : "tsx"
}

async function main() {
  ensureCheckout()
  fs.mkdirSync(outDir, { recursive: true })

  const names = fs.existsSync(blocksDir)
    ? fs
        .readdirSync(blocksDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort()
    : []

  const catalog = []
  const items: Record<string, unknown> = {}
  const previewImports: string[] = []

  for (const name of names) {
    const dir = path.join(blocksDir, name)
    const meta = JSON.parse(
      fs.readFileSync(path.join(dir, "block.json"), "utf8")
    ) as BlockMeta
    const entryFile = meta.entry ?? `${name}.tsx`
    const files = listFiles(dir).sort((a, b) =>
      a === entryFile ? -1 : b === entryFile ? 1 : a.localeCompare(b)
    )
    const usage = (meta.usage ?? []).map((example) => ({
      title: example.title,
      description: example.description,
      code: fs
        .readFileSync(path.join(dir, example.file), "utf8")
        .replaceAll('from "./', `from "@/components/blocks/${name}/`),
    }))
    const sources = files.map((file) =>
      fs.readFileSync(path.join(dir, file), "utf8")
    )
    if (!files.includes(entryFile)) {
      throw new Error(`pro: ${name} needs an entry file ${entryFile}`)
    }

    catalog.push({
      name,
      title: meta.title,
      description: meta.description,
      category: meta.category,
      files: files.map((file) => `components/blocks/${name}/${file}`),
      usage,
      docs: meta.docs ?? {},
    })

    items[name] = {
      registry: {
        $schema: "https://ui.shadcn.com/schema/registry-item.json",
        name,
        type: "registry:block",
        title: meta.title,
        description: meta.description,
        categories: [meta.category],
        dependencies: packageDependencies(sources, meta.dependencies),
        registryDependencies: registryDependencies(sources),
        files: files.map((file, index) => ({
          path: `components/blocks/${name}/${file}`,
          type: "registry:component",
          target: `components/blocks/${name}/${file}`,
          content: sources[index],
        })),
      },
      files: await Promise.all(
        files.map(async (file, index) => ({
          path: `components/blocks/${name}/${file}`,
          code: sources[index],
          html: await highlight(sources[index], lang(file), {
            lineNumbers: true,
          }),
        }))
      ),
    }

    previewImports.push(
      `  "${name}": dynamic(() =>\n    import("@/pro/blocks/${name}/${entryFile.replace(/\.tsx$/, "")}").then((mod) => mod.${meta.component})\n  ),`
    )
  }

  fs.writeFileSync(
    path.join(outDir, "catalog.json"),
    `${JSON.stringify(catalog, null, 2)}\n`
  )
  fs.writeFileSync(path.join(outDir, "items.json"), JSON.stringify(items))
  fs.writeFileSync(
    path.join(outDir, "previews.tsx"),
    `"use client"\n\nimport dynamic from "next/dynamic"\nimport type { ComponentType } from "react"\n\nconst previews: Record<string, ComponentType> = {\n${previewImports.join("\n")}\n}\n\nexport { previews }\n`
  )

  console.log(
    `pro: generated ${names.length} block${names.length === 1 ? "" : "s"}`
  )
}

await main()
