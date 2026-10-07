import { cleanup, render } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { WebMcp, webMcpTools } from "@/components/site/web-mcp"

type Registered = {
  name: string
  execute: (input: Record<string, unknown>) => Promise<string>
}

const catalog = {
  entries: [
    {
      slug: "alert-dialog",
      title: "Alert dialog",
      kind: "component",
      description: "A confirmation dialog for destructive actions.",
      keywords: ["confirm", "delete"],
    },
    {
      slug: "button",
      title: "Button",
      kind: "component",
      description: "Buttons with a loading flow.",
    },
  ],
}

function install() {
  const registered: Registered[] = []
  const signals: AbortSignal[] = []
  Object.defineProperty(document, "modelContext", {
    configurable: true,
    value: {
      registerTool: (tool: Registered, options: { signal: AbortSignal }) => {
        registered.push(tool)
        signals.push(options.signal)
      },
    },
  })
  return { registered, signals }
}

afterEach(() => {
  cleanup()
  Reflect.deleteProperty(document, "modelContext")
})

describe("WebMcp", () => {
  it("does nothing without a model context", () => {
    expect(() => render(<WebMcp />)).not.toThrow()
  })

  it("registers read-only tools and unregisters them on unmount", async () => {
    const { registered, signals } = install()
    const { unmount } = render(<WebMcp />)
    await vi.waitFor(() => expect(registered).toHaveLength(3))
    expect(registered.map((tool) => tool.name)).toEqual([
      "search_hextaui_docs",
      "get_hextaui_docs",
      "get_hextaui_install_command",
    ])
    expect(webMcpTools.every((tool) => tool.annotations?.readOnlyHint)).toBe(
      true
    )
    unmount()
    expect(signals.every((signal) => signal.aborted)).toBe(true)
  })

  it("searches the catalog and builds install commands", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) =>
        url === "/mcp/index.json"
          ? Response.json(catalog)
          : new Response("# Button\n")
      )
    )
    const [search, docs, install] = webMcpTools
    expect(await search.execute({ query: "confirm delete" })).toContain(
      "`alert-dialog`"
    )
    expect(await docs.execute({ slug: "button" })).toBe("# Button\n")
    expect(await docs.execute({ slug: "../secret" })).toContain("Pass a slug")
    expect(
      await install.execute({
        names: ["button", "dialog"],
        packageManager: "pnpm",
      })
    ).toBe(
      `pnpm dlx shadcn@latest add ${location.origin}/r/button.json ${location.origin}/r/dialog.json`
    )
    vi.unstubAllGlobals()
  })
})
