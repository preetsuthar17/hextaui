import { absoluteUrl, siteName, siteRepository, siteSummary } from "@/lib/site"

const mcpName = "com.hextaui/hextaui"
const mcpVersion = "1.0.0"
const mcpDescription =
  "Search HextaUI docs, read component APIs and examples, and get shadcn install commands."
const mcpUrl = absoluteUrl("/mcp")
const mcpProtocolVersions = [
  "2026-07-28",
  "2025-11-25",
  "2025-06-18",
  "2025-03-26",
]

const mcpTools = [
  {
    name: "search_docs",
    description:
      "Search components, hooks, utilities, examples, props and data attributes in plain language.",
  },
  {
    name: "list_components",
    description: "List every component, hook and utility by category.",
  },
  {
    name: "get_component",
    description:
      "Full docs for one page: install command, usage, examples, keyboard, accessibility and API reference.",
  },
  {
    name: "get_component_api",
    description: "Only the API reference and keyboard support of a component.",
  },
  {
    name: "get_component_source",
    description: "The source files the shadcn CLI would install.",
  },
  {
    name: "get_examples",
    description: "The code of any example on a docs page.",
  },
  {
    name: "get_install_command",
    description:
      "One shadcn CLI command for several components, for npm, pnpm, yarn or bun.",
  },
  {
    name: "get_setup",
    description:
      "The installation guide and the conventions generated code should follow.",
  },
]

const repository = { url: siteRepository, source: "github" }

function getMcpServerCard() {
  return {
    name: mcpName,
    title: siteName,
    description: mcpDescription,
    version: mcpVersion,
    websiteUrl: absoluteUrl("/docs/mcp"),
    repository,
    remotes: [
      {
        type: "streamable-http",
        url: mcpUrl,
        supportedProtocolVersions: mcpProtocolVersions,
      },
    ],
    serverInfo: { name: "hextaui", title: siteName, version: mcpVersion },
    transport: { type: "streamable-http", endpoint: "/mcp" },
    authentication: { required: false },
    capabilities: { tools: {}, resources: {}, prompts: {} },
    tools: mcpTools,
    prompts: [
      {
        name: "build-ui",
        description: "Walk from picking HextaUI components to installing them.",
      },
    ],
    resources: [
      {
        uriTemplate: "hextaui://docs/{slug}",
        description: "Each docs page as Markdown.",
      },
    ],
    documentationUrl: absoluteUrl("/docs/mcp"),
  }
}

function getMcpRegistryServer() {
  return {
    $schema:
      "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json",
    name: mcpName,
    title: siteName,
    description: mcpDescription,
    version: mcpVersion,
    websiteUrl: absoluteUrl("/docs/mcp"),
    repository,
    remotes: [{ type: "streamable-http", url: mcpUrl }],
  }
}

function getAiCatalog() {
  return {
    specVersion: "1.0",
    entries: [
      {
        identifier: "urn:air:hextaui.com:mcp:hextaui",
        type: "application/mcp-server-card+json",
        url: absoluteUrl("/.well-known/mcp/server-card.json"),
      },
      {
        identifier: "urn:air:hextaui.com:api:hextaui",
        type: "application/vnd.oai.openapi+json",
        url: absoluteUrl("/openapi.json"),
      },
      {
        identifier: "urn:air:hextaui.com:skill:hextaui",
        type: "text/markdown",
        url: absoluteUrl("/.well-known/agent-skills/hextaui/SKILL.md"),
      },
    ],
  }
}

function getApiCatalog() {
  const describe = (anchor: string) => ({
    anchor,
    "service-desc": [
      {
        href: absoluteUrl("/openapi.json"),
        type: "application/vnd.oai.openapi+json",
      },
    ],
    "service-doc": [{ href: absoluteUrl("/docs/api"), type: "text/html" }],
  })

  return {
    linkset: [
      describe(absoluteUrl("/api")),
      describe(absoluteUrl("/r/registry.json")),
      {
        anchor: mcpUrl,
        "service-desc": [
          {
            href: absoluteUrl("/.well-known/mcp/server-card.json"),
            type: "application/mcp-server-card+json",
          },
        ],
        "service-doc": [{ href: absoluteUrl("/docs/mcp"), type: "text/html" }],
      },
    ],
  }
}

async function sha256(text: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text)
  )
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

async function getAgentSkillsIndex(skill: string) {
  return {
    $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    skills: [
      {
        name: "hextaui",
        type: "skill-md",
        description: `Build React interfaces with ${siteName}: find, read and install accessible shadcn/ui-compatible components. ${siteSummary}`,
        url: absoluteUrl("/.well-known/agent-skills/hextaui/SKILL.md"),
        digest: `sha256:${await sha256(skill)}`,
      },
    ],
  }
}

export {
  getAgentSkillsIndex,
  getAiCatalog,
  getApiCatalog,
  getMcpRegistryServer,
  getMcpServerCard,
  mcpTools,
}
