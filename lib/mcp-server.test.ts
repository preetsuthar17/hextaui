import {
  Client,
  StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client"
import { afterEach, describe, expect, it } from "vitest"

import { packDocsSearchIndex } from "@/lib/docs-search-query"
import type { McpEntry, McpIndex } from "@/lib/mcp-manifest"
import { createMcpFetch, type AssetLoader } from "@/lib/mcp-server"

const index: McpIndex = {
  categories: ["actions", "overlays"],
  guides: [
    {
      slug: "installation",
      title: "Installation",
      description: "Add HextaUI to a project.",
    },
  ],
  entries: [
    {
      slug: "alert-dialog",
      title: "Alert dialog",
      kind: "component",
      category: "overlays",
      description: "A confirmation dialog for destructive actions.",
      keywords: ["confirm", "delete"],
      installable: true,
      examples: [{ name: "alert-dialog-demo", title: "Demo" }],
    },
    {
      slug: "button",
      title: "Button",
      kind: "component",
      category: "actions",
      description: "Buttons with a loading flow.",
      installable: true,
      examples: [],
    },
    {
      slug: "dialog",
      title: "Dialog",
      kind: "component",
      category: "overlays",
      description: "A window over the page.",
      keywords: ["modal"],
      installable: true,
      examples: [
        { name: "dialog-demo", title: "Demo" },
        { name: "dialog-form", title: "Form" },
      ],
    },
    {
      slug: "use-autosize",
      title: "useAutosize",
      kind: "hook",
      description: "Grows a textarea with its content.",
      installable: true,
      examples: [],
    },
    {
      slug: "shimmer",
      title: "Shimmer",
      kind: "utility",
      description: "A shimmer sweep for loading text.",
      installable: false,
      examples: [],
    },
  ],
}

function entry(slug: string, extra: Partial<McpEntry> = {}): McpEntry {
  const summary = index.entries.find((item) => item.slug === slug)!
  return {
    ...summary,
    dependencies: ["@base-ui/react@^1.8.0"],
    registryDependencies: ["theme", "button"],
    files: [`components/ui/${slug}.tsx`],
    sections: [
      { title: "Installation", markdown: "## Installation\n\nCopy by hand." },
      { title: "Usage", markdown: `## Usage\n\nUse ${summary.title}.` },
      { title: "Composition", markdown: "## Composition\n\nDialog" },
      { title: "Keyboard", markdown: "## Keyboard\n\n| Key | Action |" },
      {
        title: "API reference",
        markdown: "## API reference\n\n### DialogContent\n\n| Prop |",
      },
    ],
    ...extra,
  }
}

const search = packDocsSearchIndex({
  installable: ["dialog"],
  records: [
    {
      href: "/docs/dialog#dialogcontent",
      page: "dialog",
      title: "showCloseButton",
      kind: "prop",
      trail: ["API reference", "DialogContent"],
      type: "boolean",
      default: "true",
      text: "Shows the corner close button.",
    },
  ],
})

const registryItem = (name: string, path: string, content: string) => ({
  name,
  title: name,
  dependencies: ["cn"],
  registryDependencies: [
    "https://hextaui.com/r/theme.json",
    "https://hextaui.com/r/button.json",
  ],
  files: [{ path, content }],
})

const assets: Record<string, unknown> = {
  "/mcp/index.json": index,
  "/docs/search.json": search,
  "/mcp/docs/dialog.json": entry("dialog", {
    examples: [
      { name: "dialog-demo", title: "Demo" },
      { name: "dialog-form", title: "Form", description: "A form inside." },
    ],
  }),
  "/mcp/docs/alert-dialog.json": entry("alert-dialog"),
  "/mcp/docs/button.json": entry("button"),
  "/mcp/docs/shimmer.json": entry("shimmer", { files: [] }),
  "/r/dialog.json": registryItem(
    "dialog",
    "components/ui/dialog.tsx",
    "export function Dialog() {}"
  ),
  "/r/safe-area.json": registryItem(
    "safe-area",
    "components/ui/safe-area.tsx",
    "export function SafeArea() {}"
  ),
  "/r/dialog-demo.json": registryItem(
    "dialog-demo",
    "components/examples/dialog/demo.tsx",
    "export function DialogDemo() {}"
  ),
  "/r/dialog-form.json": registryItem(
    "dialog-form",
    "components/examples/dialog/form.tsx",
    "export function DialogForm() {}"
  ),
  "/docs/installation.md": "# Installation\n\nRun the CLI.",
}

const fixtureLoader: AssetLoader = async (path) => {
  if (!(path in assets)) {
    return new Response("Not found", { status: 404 })
  }
  const value = assets[path]
  return typeof value === "string" ? new Response(value) : Response.json(value)
}

const clients: Client[] = []

afterEach(async () => {
  await Promise.all(clients.splice(0).map((client) => client.close()))
})

async function connect(
  era: "legacy" | "modern" = "legacy",
  load: AssetLoader = fixtureLoader
) {
  const mcp = createMcpFetch(load)
  const client = new Client(
    { name: "test", version: "1.0.0" },
    era === "modern"
      ? { versionNegotiation: { mode: { pin: "2026-07-28" } } }
      : {}
  )
  await client.connect(
    new StreamableHTTPClientTransport(new URL("https://hextaui.com/mcp"), {
      fetch: (url, init) => mcp(new Request(url, init)),
    })
  )
  clients.push(client)
  return client
}

async function call(
  client: Client,
  name: string,
  args: Record<string, unknown> = {}
) {
  const result = await client.callTool({ name, arguments: args })
  const content = result.content as { type: string; text: string }[]
  return { text: content[0]?.text ?? "", isError: result.isError === true }
}

describe("HextaUI MCP server", () => {
  it.each(["legacy", "modern"] as const)(
    "serves tools over the %s protocol",
    async (era) => {
      const client = await connect(era)
      const { tools } = await client.listTools()
      expect(tools.map((tool) => tool.name)).toEqual([
        "search_docs",
        "list_components",
        "get_component",
        "get_component_api",
        "get_component_source",
        "get_examples",
        "get_install_command",
        "get_setup",
      ])
      expect(tools.every((tool) => tool.annotations?.readOnlyHint)).toBe(true)
      const { text } = await call(client, "get_component", { name: "dialog" })
      expect(text).toContain("# Dialog")
    }
  )

  it("sends usage instructions on connect", async () => {
    const client = await connect()
    expect(client.getInstructions()).toContain("search_docs")
    expect(client.getInstructions()).toContain("`render` prop")
  })

  it("finds pages by keyword and props by name", async () => {
    const client = await connect()
    const pages = await call(client, "search_docs", { query: "modal" })
    expect(pages.text).toContain("**Dialog** (component `dialog`)")
    const props = await call(client, "search_docs", {
      query: "showCloseButton",
    })
    expect(props.text).toContain(
      "**showCloseButton** (prop in Dialog › API reference › DialogContent: `boolean`, default `true`, `dialog`)"
    )
  })

  it("falls back to matching some words of a phrase", async () => {
    const client = await connect()
    const { text } = await call(client, "search_docs", {
      query: "ask to confirm before you delete a file",
    })
    expect(text).toContain("Closest matches")
    expect(text.split("\n")[2]).toContain("`alert-dialog`")
  })

  it("adds partial matches after a few exact ones", async () => {
    const client = await connect()
    const { text } = await call(client, "search_docs", {
      query: "confirm modal",
    })
    const lines = text.split("\n").filter((line) => line.startsWith("- "))
    expect(lines[0]).toContain("`alert-dialog`")
    expect(lines[1]).toContain("`dialog`")
  })

  it("resolves names, titles and part names to entries", async () => {
    const client = await connect()
    for (const name of [
      "Dialog",
      "@hextaui/dialog",
      "https://hextaui.com/r/dialog.json",
      "DialogContent",
    ]) {
      const { text } = await call(client, "get_component_api", { name })
      expect(text).toMatch(/^# Dialog API/)
    }
    const alert = await call(client, "get_component_api", {
      name: "AlertDialogContent",
    })
    expect(alert.text).toMatch(/^# Alert dialog API/)
  })

  it("suggests close names for an unknown one", async () => {
    const client = await connect()
    const { text, isError } = await call(client, "get_component", {
      name: "modal window",
    })
    expect(isError).toBe(true)
    expect(text).toContain(
      'no component, hook or utility called "modal window"'
    )
    expect(text).toContain("`dialog`")
  })

  it("replaces the copy-by-hand install with the CLI command", async () => {
    const client = await connect()
    const { text } = await call(client, "get_component", {
      name: "dialog",
      packageManager: "pnpm",
    })
    expect(text).toContain(
      "pnpm dlx shadcn@latest add https://hextaui.com/r/dialog.json"
    )
    expect(text).not.toContain("Copy by hand")
    expect(text).toContain("the HextaUI items `button`")
    expect(text).toContain("the demo is `dialog-demo`")
  })

  it("keeps the docs install section for theme-only utilities", async () => {
    const client = await connect()
    const { text } = await call(client, "get_component", { name: "shimmer" })
    expect(text).toContain("Copy by hand")
    const source = await call(client, "get_component_source", {
      name: "shimmer",
    })
    expect(source.text).toContain("ships with the HextaUI theme tokens")
  })

  it("returns only the API and keyboard sections", async () => {
    const client = await connect()
    const { text } = await call(client, "get_component_api", {
      name: "dialog",
    })
    expect(text).toContain("## Composition")
    expect(text).toContain("## Keyboard")
    expect(text).toContain("## API reference")
    expect(text).not.toContain("## Usage")
  })

  it("returns source for docs entries and plain registry items", async () => {
    const client = await connect()
    const dialog = await call(client, "get_component_source", {
      name: "dialog",
    })
    expect(dialog.text).toContain(
      '```tsx title="components/ui/dialog.tsx"\nexport function Dialog() {}\n```'
    )
    expect(dialog.text).toContain("HextaUI dependencies: `button`")
    const safeArea = await call(client, "get_component_source", {
      name: "Safe area",
    })
    expect(safeArea.text).toContain("export function SafeArea() {}")
    const missing = await call(client, "get_component_source", {
      name: "nope",
    })
    expect(missing.isError).toBe(true)
  })

  it("returns the demo by default and named examples on request", async () => {
    const client = await connect()
    const demo = await call(client, "get_examples", { component: "dialog" })
    expect(demo.text).toContain("export function DialogDemo() {}")
    expect(demo.text).toContain("## More examples\n\n- `dialog-form`: Form")
    const form = await call(client, "get_examples", {
      component: "dialog",
      examples: ["form", "dialog-form"],
    })
    expect(form.text.match(/export function DialogForm/g)).toHaveLength(1)
    expect(form.text).toContain("A form inside.")
    const unknown = await call(client, "get_examples", {
      component: "dialog",
      examples: ["nested"],
    })
    expect(unknown.isError).toBe(true)
    expect(unknown.text).toContain("`dialog-demo`, `dialog-form`")
  })

  it("builds one install command for many items", async () => {
    const client = await connect()
    const { text } = await call(client, "get_install_command", {
      items: ["dialog", "Dialog", "button", "shimmer"],
      packageManager: "bun",
    })
    expect(text).toContain(
      "bunx --bun shadcn@latest add https://hextaui.com/r/dialog.json https://hextaui.com/r/button.json\n"
    )
    expect(text).toContain("@hextaui/dialog @hextaui/button")
    expect(text).toContain("`shimmer` comes with the theme tokens")
  })

  it("lists entries by category and kind", async () => {
    const client = await connect()
    const overlays = await call(client, "list_components", {
      category: "overlays",
    })
    expect(overlays.text).toContain("## Overlays")
    expect(overlays.text).toContain("`dialog` Dialog")
    expect(overlays.text).not.toContain("`button`")
    const hooks = await call(client, "list_components", { kind: "hook" })
    expect(hooks.text).toContain("## Hooks\n\n- `use-autosize` useAutosize")
    const none = await call(client, "list_components", { category: "nope" })
    expect(none.text).toContain("No entries match")
  })

  it("returns the setup guide with conventions", async () => {
    const client = await connect()
    const { text } = await call(client, "get_setup")
    expect(text).toContain("# Installation")
    expect(text).toContain("## Conventions")
  })

  it("exposes docs as resources and a build prompt", async () => {
    const client = await connect()
    const { resources } = await client.listResources()
    expect(resources.map((resource) => resource.uri)).toContain(
      "hextaui://docs/dialog"
    )
    const { contents } = await client.readResource({
      uri: "hextaui://docs/dialog",
    })
    expect((contents[0] as { text: string }).text).toContain("# Dialog")
    const prompt = await client.getPrompt({
      name: "build-ui",
      arguments: { task: "a settings page" },
    })
    expect(JSON.stringify(prompt.messages)).toContain("a settings page")
  })

  it("does not cache a failed asset load", async () => {
    let failures = 1
    const client = await connect("legacy", async (path) => {
      if (path === "/mcp/index.json" && failures > 0) {
        failures -= 1
        return new Response("Unavailable", { status: 503 })
      }
      return fixtureLoader(path)
    })
    const first = await call(client, "list_components")
    expect(first.isError).toBe(true)
    expect(first.text).toContain("returned 503")
    const second = await call(client, "list_components")
    expect(second.isError).toBe(false)
  })
})

describe("HTTP handling", () => {
  const mcp = createMcpFetch(fixtureLoader)

  it("answers CORS preflight", async () => {
    const response = await mcp(
      new Request("https://hextaui.com/mcp", { method: "OPTIONS" })
    )
    expect(response.status).toBe(204)
    expect(response.headers.get("access-control-allow-origin")).toBe("*")
  })

  it("sends browsers to the docs", async () => {
    const response = await mcp(
      new Request("https://hextaui.com/mcp", {
        headers: { accept: "text/html,application/xhtml+xml" },
      })
    )
    expect(response.status).toBe(302)
    expect(response.headers.get("location")).toBe(
      "https://hextaui.com/docs/mcp"
    )
  })

  it("adds CORS headers to MCP responses", async () => {
    const response = await mcp(
      new Request("https://hextaui.com/mcp", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json, text/event-stream",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "initialize",
          params: {
            protocolVersion: "2025-06-18",
            capabilities: {},
            clientInfo: { name: "test", version: "1.0.0" },
          },
        }),
      })
    )
    expect(response.status).toBe(200)
    expect(response.headers.get("access-control-allow-origin")).toBe("*")
  })
})
