import type { PageDoc, PlacedSection } from "@/lib/page-builder/doc"
import {
  collectTags,
  dependencyNames,
  h,
  printImports,
  printNode,
  registryNames,
} from "@/lib/page-builder/node"
import { getSection, kindInfo } from "@/lib/page-builder/registry"

type ExportFile = {
  path: string
  name: string
  content: string
  kind: "page" | "section" | "pro"
}

type PageExport = {
  files: ExportFile[]
  registry: string[]
  dependencies: string[]
  proBlocks: { name: string; title: string }[]
}

const siteOrigin = "https://hextaui.com"
const sectionsDir = "components/sections"

function pascal(value: string) {
  return value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("")
}

function kebab(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .toLowerCase()
}

function componentSource(name: string, tags: Set<string>, body: string) {
  const imports = printImports(tags)
  return `${imports ? `${imports}\n\n` : ""}export function ${name}() {\n  return (\n${body}\n  )\n}\n`
}

function proPlaceholder(placed: Extract<PlacedSection, { type: "pro" }>) {
  return h(
    "section",
    { className: "px-6 py-20" },
    h(
      "div",
      {
        className:
          "mx-auto flex max-w-6xl flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-16 text-center",
      },
      h(
        "p",
        { className: "text-sm font-medium" },
        `${placed.title} (HextaUI Pro)`
      ),
      h(
        "p",
        { className: "max-w-md text-sm text-pretty text-muted-foreground" },
        `Install it with npx shadcn@latest add @hextaui-pro/${placed.name} and render it here.`
      ),
      h(
        "a",
        {
          href: `${siteOrigin}/blocks/${placed.name}`,
          className: "text-sm underline underline-offset-4",
        },
        "View the block"
      )
    )
  )
}

function uniqueName(base: string, used: Map<string, number>) {
  const count = (used.get(base) ?? 0) + 1
  used.set(base, count)
  return count === 1 ? base : `${base}${count}`
}

function exportPage(doc: PageDoc): PageExport {
  const used = new Map<string, number>()
  const allTags = new Set<string>()
  const files: ExportFile[] = []
  const placedNames: { name: string; kind: string; file: string }[] = []
  const proBlocks: { name: string; title: string }[] = []

  for (const placed of doc.sections) {
    if (placed.type === "pro") {
      const name = uniqueName(`Pro${pascal(placed.name)}`, used)
      const node = proPlaceholder(placed)
      const tags = collectTags(node)
      const file = `${sectionsDir}/${kebab(name)}.tsx`
      files.push({
        path: file,
        name,
        kind: "pro",
        content: componentSource(name, tags, printNode(node, "    ")),
      })
      placedNames.push({ name, kind: "pro", file })
      if (!proBlocks.some((block) => block.name === placed.name)) {
        proBlocks.push({ name: placed.name, title: placed.title })
      }
      continue
    }
    const section = getSection(placed.sectionId)
    if (!section) continue
    const name = uniqueName(kindInfo(section.kind).component, used)
    const node = section.build(placed.props)
    const tags = collectTags(node)
    for (const tag of tags) allTags.add(tag)
    const file = `${sectionsDir}/${kebab(name)}.tsx`
    files.push({
      path: file,
      name,
      kind: "section",
      content: componentSource(name, tags, printNode(node, "    ")),
    })
    placedNames.push({ name, kind: section.kind, file })
  }

  const firstBody = placedNames.findIndex((item) => item.kind !== "navbar")
  const head = placedNames.slice(
    0,
    firstBody === -1 ? placedNames.length : firstBody
  )
  const rest = placedNames.slice(head.length)
  let footerStart = rest.length
  while (footerStart > 0 && rest[footerStart - 1].kind === "footer")
    footerStart -= 1
  const body = rest.slice(0, footerStart)
  const tail = rest.slice(footerStart)

  const importLines = placedNames
    .map(
      (item) =>
        `import { ${item.name} } from "@/${item.file.replace(/\.tsx$/, "")}"`
    )
    .join("\n")
  const tagLine = (item: { name: string }, indent: string) =>
    `${indent}<${item.name} />`
  const mainBlock = body.length
    ? `      <main>\n${body.map((item) => tagLine(item, "        ")).join("\n")}\n      </main>`
    : "      <main />"
  const pageBody = [
    ...head.map((item) => tagLine(item, "      ")),
    mainBlock,
    ...tail.map((item) => tagLine(item, "      ")),
  ].join("\n")
  const page = `${importLines ? `${importLines}\n\n` : ""}export default function Page() {\n  return (\n    <div className="flex min-h-svh flex-col bg-background text-foreground">\n${pageBody}\n    </div>\n  )\n}\n`

  return {
    files: [
      { path: "app/page.tsx", name: "Page", kind: "page", content: page },
      ...files,
    ],
    registry: registryNames(allTags),
    dependencies: dependencyNames(allTags),
    proBlocks,
  }
}

function registryUrl(name: string) {
  return `${siteOrigin}/r/${name}.json`
}

function pageInstallCommand(encoded: string) {
  return `npx shadcn@latest add ${siteOrigin}/r/pages/${encoded}.json`
}

function componentsInstallCommand(result: PageExport) {
  return result.registry.length
    ? `npx shadcn@latest add ${result.registry.map(registryUrl).join(" ")}`
    : null
}

function proInstallCommand(result: PageExport) {
  return result.proBlocks.length
    ? `npx shadcn@latest add ${result.proBlocks.map((block) => `@hextaui-pro/${block.name}`).join(" ")}`
    : null
}

function registryItem(result: PageExport, encoded: string) {
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "landing-page",
    type: "registry:block",
    title: "Landing page",
    description: "A landing page composed with the HextaUI Page Builder.",
    docs: `Edit it at ${siteOrigin}/tools/page-builder#p=${encoded}`,
    dependencies: result.dependencies,
    registryDependencies: result.registry.map(registryUrl),
    files: result.files.map((file) => ({
      path: file.path,
      type: file.kind === "page" ? "registry:page" : "registry:component",
      target: file.path,
      content: file.content,
    })),
  }
}

export {
  componentsInstallCommand,
  exportPage,
  pageInstallCommand,
  proInstallCommand,
  registryItem,
  registryUrl,
  type ExportFile,
  type PageExport,
}
