import * as React from "react"

import { DocsExample } from "@/components/docs/docs-example"
import {
  docsCategories,
  docsComponents,
  docsEntries,
  docsGuides,
  docsHooks,
  docsKeywords,
} from "@/lib/docs"
import {
  docsInlineText,
  getDocsExampleName,
  getDocsSections,
  isElement,
  loadDocsPage,
  toArray,
} from "@/lib/docs-markdown"
import { readDocsSource } from "@/lib/docs-source"
import type {
  McpEntry,
  McpEntryKind,
  McpEntrySummary,
  McpExample,
  McpIndex,
} from "@/lib/mcp-manifest"

type RegistryItem = {
  name: string
  type: string
  dependencies?: string[]
  registryDependencies?: string[]
  files?: { path: string }[]
}

let registryRequest: Promise<Map<string, RegistryItem>> | null = null

function readRegistry() {
  registryRequest ??= readDocsSource("registry.json").then((source) => {
    const registry = JSON.parse(source) as { items: RegistryItem[] }
    return new Map(registry.items.map((item) => [item.name, item]))
  })
  return registryRequest
}

function getKind(slug: string): McpEntryKind {
  if (docsComponents.some((item) => item.slug === slug)) {
    return "component"
  }
  if (docsHooks.some((item) => item.slug === slug)) {
    return "hook"
  }
  return "utility"
}

function collectExamples(node: React.ReactNode, examples: McpExample[]) {
  for (const child of toArray(node)) {
    if (!isElement(child)) {
      continue
    }
    if (child.type === DocsExample) {
      const description = child.props.description
        ? docsInlineText(child.props.description as React.ReactNode).trim()
        : ""
      examples.push({
        name: getDocsExampleName(String(child.props.file)),
        title: child.props.title ? String(child.props.title) : "Demo",
        ...(description ? { description } : {}),
      })
      continue
    }
    collectExamples(child.props.children as React.ReactNode, examples)
  }
  return examples
}

async function getExamples(slug: string) {
  const { default: Page } = await loadDocsPage(slug)
  return collectExamples(await Page(), [])
}

function registryName(url: string) {
  return url.replace(/^.*\/r\//, "").replace(/\.json$/, "")
}

async function getMcpEntryBase(slug: string) {
  const entry = docsEntries.find((item) => item.slug === slug)
  if (!entry) {
    throw new Error(`No docs entry for ${slug}`)
  }
  const registry = await readRegistry()
  const keywords = docsKeywords[slug]
  const examples = await getExamples(slug)
  const missing = examples.filter((example) => !registry.has(example.name))
  if (missing.length > 0) {
    throw new Error(
      `${slug} shows examples missing from registry.json: ${missing.map((example) => example.name).join(", ")}. Run pnpm registry:sync.`
    )
  }

  return {
    slug,
    title: entry.name,
    kind: getKind(slug),
    ...(entry.category ? { category: entry.category } : {}),
    description: entry.description,
    ...(keywords ? { keywords } : {}),
    installable: registry.has(slug),
    examples,
  }
}

async function getMcpEntrySummary(slug: string): Promise<McpEntrySummary> {
  const entry = await getMcpEntryBase(slug)
  return {
    ...entry,
    examples: entry.examples.map(({ name, title }) => ({ name, title })),
  }
}

async function getMcpEntry(slug: string): Promise<McpEntry> {
  const [base, registry, sections] = await Promise.all([
    getMcpEntryBase(slug),
    readRegistry(),
    getDocsSections(slug),
  ])
  const item = registry.get(slug)
  if (sections.length === 0) {
    throw new Error(`${slug} rendered no docs sections for the MCP manifest`)
  }

  return {
    ...base,
    dependencies: item?.dependencies ?? [],
    registryDependencies: (item?.registryDependencies ?? []).map(registryName),
    files: (item?.files ?? []).map((file) => file.path),
    sections,
  }
}

async function getMcpIndex(): Promise<McpIndex> {
  return {
    categories: [...docsCategories],
    guides: docsGuides,
    entries: await Promise.all(
      docsEntries.map((entry) => getMcpEntrySummary(entry.slug))
    ),
  }
}

const mcpEntrySlugs = docsEntries.map((entry) => entry.slug)

export { getMcpEntry, getMcpIndex, mcpEntrySlugs }
