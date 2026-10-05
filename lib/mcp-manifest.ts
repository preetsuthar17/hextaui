type McpEntryKind = "component" | "hook" | "utility"

type McpExampleSummary = {
  name: string
  title: string
}

type McpExample = McpExampleSummary & {
  description?: string
}

type McpEntrySummary = {
  slug: string
  title: string
  kind: McpEntryKind
  category?: string
  description: string
  keywords?: string[]
  installable: boolean
  examples: McpExampleSummary[]
}

type McpSection = {
  title: string
  markdown: string
}

type McpEntry = Omit<McpEntrySummary, "examples"> & {
  examples: McpExample[]
  dependencies: string[]
  registryDependencies: string[]
  files: string[]
  sections: McpSection[]
}

type McpGuide = {
  slug: string
  title: string
  description: string
}

type McpIndex = {
  categories: string[]
  guides: McpGuide[]
  entries: McpEntrySummary[]
}

const mcpIndexPath = "/mcp/index.json"

const mcpSearchPath = "/docs/search.json"

function getMcpEntryPath(slug: string) {
  return `/mcp/docs/${slug}.json`
}

export { getMcpEntryPath, mcpIndexPath, mcpSearchPath }
export type {
  McpEntry,
  McpEntryKind,
  McpEntrySummary,
  McpExample,
  McpExampleSummary,
  McpGuide,
  McpIndex,
  McpSection,
}
