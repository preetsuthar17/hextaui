"use client"

import * as React from "react"

import {
  getCommand,
  packageManagers,
  type PackageManager,
} from "@/lib/package-manager"

type CatalogEntry = {
  slug: string
  title: string
  kind: string
  description: string
  keywords?: string[]
  installable?: boolean
}

type Catalog = { entries: CatalogEntry[] }

type WebMcpTool = {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean }
  execute: (input: Record<string, unknown>) => Promise<string>
}

type ModelContext = {
  registerTool: (
    tool: WebMcpTool,
    options?: { signal?: AbortSignal }
  ) => unknown
}

let catalog: Promise<Catalog> | undefined

function loadCatalog() {
  catalog ??= fetch("/mcp/index.json").then((response) => {
    if (!response.ok) {
      catalog = undefined
      throw new Error("The HextaUI catalog could not be loaded.")
    }
    return response.json() as Promise<Catalog>
  })
  return catalog
}

function score(entry: CatalogEntry, words: string[]) {
  const haystack = [
    entry.slug,
    entry.title,
    entry.description,
    ...(entry.keywords ?? []),
  ]
    .join(" ")
    .toLowerCase()
  return words.reduce(
    (total, word) =>
      total +
      (entry.slug === word ? 5 : 0) +
      (entry.title.toLowerCase().includes(word) ? 3 : 0) +
      (haystack.includes(word) ? 1 : 0),
    0
  )
}

const slugPattern = /^[a-z0-9-]+$/

const tools: WebMcpTool[] = [
  {
    name: "search_hextaui_docs",
    description:
      "Find HextaUI components, hooks and utilities for a UI need, e.g. 'confirm before delete' or 'file upload'. Returns slugs, descriptions and docs URLs.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "What to look for." },
        limit: {
          type: "integer",
          minimum: 1,
          maximum: 20,
          description: "Maximum number of results. Defaults to 8.",
        },
      },
      required: ["query"],
    },
    annotations: { readOnlyHint: true },
    async execute({ query, limit }) {
      const words = String(query ?? "")
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
      const { entries } = await loadCatalog()
      const matches = entries
        .map((entry) => ({ entry, score: score(entry, words) }))
        .filter((match) => match.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, Math.min(Math.max(Number(limit) || 8, 1), 20))
      if (matches.length === 0) {
        return `No HextaUI page matches "${query}". Every page is listed at ${location.origin}/llms.txt.`
      }
      return matches
        .map(
          ({ entry }) =>
            `- ${entry.title} (\`${entry.slug}\`, ${entry.kind}): ${entry.description} ${location.origin}/docs/${entry.slug}.md`
        )
        .join("\n")
    },
  },
  {
    name: "get_hextaui_docs",
    description:
      "Get a HextaUI docs page as Markdown: installation, usage, examples, keyboard support and API reference. Pass a slug from search_hextaui_docs, e.g. 'dialog'.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Docs page slug, e.g. 'button'." },
      },
      required: ["slug"],
    },
    annotations: { readOnlyHint: true },
    async execute({ slug }) {
      const name = String(slug ?? "")
      if (!slugPattern.test(name)) {
        return "Pass a slug such as 'button'. Use search_hextaui_docs to find one."
      }
      const response = await fetch(`/docs/${name}.md`)
      if (!response.ok) {
        return `No HextaUI docs page is named "${name}". Use search_hextaui_docs to find one.`
      }
      return response.text()
    },
  },
  {
    name: "get_hextaui_install_command",
    description:
      "Build the shadcn CLI command that installs HextaUI components into a project.",
    inputSchema: {
      type: "object",
      properties: {
        names: {
          type: "array",
          items: { type: "string" },
          minItems: 1,
          description:
            "Component, hook or utility slugs, e.g. ['button', 'dialog'].",
        },
        packageManager: {
          type: "string",
          enum: [...packageManagers],
          description: "The project's package manager. Defaults to npm.",
        },
      },
      required: ["names"],
    },
    annotations: { readOnlyHint: true },
    async execute({ names, packageManager }) {
      const slugs = (Array.isArray(names) ? names : [])
        .map(String)
        .filter((name) => slugPattern.test(name))
      if (slugs.length === 0) {
        return "Pass at least one slug, e.g. ['button']."
      }
      const manager = packageManagers.includes(packageManager as PackageManager)
        ? (packageManager as PackageManager)
        : "npm"
      return getCommand(
        manager,
        [
          "shadcn@latest",
          "add",
          ...slugs.map((name) => `${location.origin}/r/${name}.json`),
        ],
        "dlx"
      )
    },
  },
]

function getModelContext() {
  const host = document as Document & { modelContext?: ModelContext }
  const fallback = navigator as Navigator & { modelContext?: ModelContext }
  return host.modelContext ?? fallback.modelContext
}

function WebMcp() {
  React.useEffect(() => {
    const context = getModelContext()
    if (!context) {
      return
    }
    const controller = new AbortController()
    for (const tool of tools) {
      Promise.resolve()
        .then(() => context.registerTool(tool, { signal: controller.signal }))
        .catch(() => {})
    }
    return () => controller.abort()
  }, [])

  return null
}

export { tools as webMcpTools, WebMcp }
