import {
  absoluteUrl,
  siteName,
  siteRepository,
  siteSummary,
  siteUrl,
} from "@/lib/site"

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

const mcpIcons = [
  { src: absoluteUrl("/hextaui-logo.svg"), mimeType: "image/svg+xml" },
  {
    src: absoluteUrl("/hextaui-logo.png"),
    mimeType: "image/png",
    sizes: ["1040x1040"],
  },
]

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
    icons: mcpIcons,
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
    icons: mcpIcons,
    remotes: [{ type: "streamable-http", url: mcpUrl }],
  }
}

const trustManifest = {
  identity: siteUrl,
  identityType: "https",
  provenance: [{ relation: "source", sourceId: siteRepository }],
}

function getArdEntries() {
  return [
    {
      identifier: "urn:air:hextaui.com:mcp:hextaui",
      displayName: `${siteName} MCP server`,
      type: "application/mcp-server-card+json",
      url: absoluteUrl("/.well-known/mcp/server-card.json"),
      description: mcpDescription,
      capabilities: mcpTools.map((tool) => tool.name),
      representativeQueries: [
        "which HextaUI component should I use for a confirm dialog",
        "show the props of the HextaUI combobox",
        "get the shadcn install command for HextaUI button and dialog",
      ],
      tags: ["react", "shadcn-ui", "ui-components", "documentation"],
      version: mcpVersion,
      trustManifest,
    },
    {
      identifier: "urn:air:hextaui.com:api:hextaui",
      displayName: `${siteName} API`,
      type: "application/vnd.oai.openapi+json",
      url: absoluteUrl("/openapi.json"),
      description:
        "HTTP API for the HextaUI shadcn registry, docs catalog, account and Pro blocks.",
      representativeQueries: [
        "download the source of the HextaUI data table",
        "list every HextaUI registry item",
        "fetch a HextaUI Pro block with an API token",
      ],
      tags: ["registry", "openapi", "shadcn-ui"],
      trustManifest,
    },
    {
      identifier: "urn:air:hextaui.com:skill:hextaui",
      displayName: `${siteName} agent skill`,
      type: "application/ai-skill+md",
      url: absoluteUrl("/.well-known/agent-skills/hextaui/SKILL.md"),
      description:
        "How an agent should find, read and install HextaUI components in a shadcn/ui project.",
      representativeQueries: [
        "build a settings page with HextaUI components",
        "add an accessible select to my shadcn project",
      ],
      tags: ["skill", "react", "shadcn-ui"],
      trustManifest,
    },
  ]
}

function getArdManifest() {
  return { specVersion: "0.91", entries: getArdEntries() }
}

function getAiCatalog() {
  return { specVersion: "1.0", entries: getArdEntries() }
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
      {
        anchor: absoluteUrl("/.well-known/api-catalog"),
        item: [
          { href: absoluteUrl("/api"), type: "application/json" },
          { href: absoluteUrl("/r/registry.json"), type: "application/json" },
          { href: mcpUrl, type: "application/json" },
        ],
      },
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

const protectedResourceMetadataUrl = absoluteUrl(
  "/.well-known/oauth-protected-resource"
)

function getProtectedResourceMetadata() {
  return {
    resource: siteUrl,
    resource_name: `${siteName} API`,
    resource_documentation: absoluteUrl("/docs/api"),
    resource_policy_uri: absoluteUrl("/legal/terms"),
    resource_tos_uri: absoluteUrl("/legal/terms"),
    bearer_methods_supported: ["header"],
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
  getArdManifest,
  getApiCatalog,
  getMcpRegistryServer,
  getMcpServerCard,
  getProtectedResourceMetadata,
  mcpIcons,
  mcpTools,
  protectedResourceMetadataUrl,
}
