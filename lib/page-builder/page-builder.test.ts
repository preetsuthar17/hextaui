import path from "node:path"

import ts from "typescript"
import { describe, expect, it } from "vitest"

import {
  decodeDoc,
  encodeDoc,
  placePro,
  placeSection,
  readHashParams,
  writeHashParams,
  type PageDoc,
} from "@/lib/page-builder/doc"
import {
  componentsInstallCommand,
  exportPage,
  pageInstallCommand,
  proInstallCommand,
  registryItem,
} from "@/lib/page-builder/export"
import { h, printNode } from "@/lib/page-builder/node"
import { sections, starterSections } from "@/lib/page-builder/registry"
import { crc32, createZip } from "@/lib/page-builder/zip"

const pro = [{ name: "chat-thread", title: "Chat Thread", category: "ai" }]

function docOf(ids: string[]): PageDoc {
  return {
    sections: ids.flatMap((id) => {
      const placed = placeSection(id)
      return placed ? [placed] : []
    }),
  }
}

function fullDoc(): PageDoc {
  const doc = docOf(sections.map((section) => section.id))
  doc.sections.splice(3, 0, placePro(pro[0]))
  return doc
}

function strip(doc: PageDoc | null) {
  return doc?.sections.map((placed) =>
    placed.type === "pro"
      ? { pro: placed.name }
      : { id: placed.sectionId, props: placed.props }
  )
}

function hasComments(source: string) {
  const scanner = ts.createScanner(
    ts.ScriptTarget.Latest,
    false,
    ts.LanguageVariant.JSX,
    source
  )
  for (
    let token = scanner.scan();
    token !== ts.SyntaxKind.EndOfFileToken;
    token = scanner.scan()
  ) {
    if (
      token === ts.SyntaxKind.SingleLineCommentTrivia ||
      token === ts.SyntaxKind.MultiLineCommentTrivia
    ) {
      return true
    }
  }
  return false
}

describe("page doc encoding", () => {
  it("round-trips every section and Pro placeholders", async () => {
    const doc = fullDoc()
    const encoded = await encodeDoc(doc)
    expect(encoded).toMatch(/^1[A-Za-z0-9_-]+$/)
    expect(strip(await decodeDoc(encoded, pro))).toEqual(strip(doc))
  })

  it("keeps edited props and stores only the changes", async () => {
    const doc = docOf(["hero-centered"])
    const placed = doc.sections[0]
    if (placed.type !== "section") throw new Error("expected a section")
    placed.props = {
      ...placed.props,
      headline: "Ship faster { with } <care> & “quotes”",
    }
    const encoded = await encodeDoc(doc)
    const plain = await encodeDoc(docOf(["hero-centered"]))
    expect(encoded.length).toBeGreaterThan(plain.length)
    expect(plain.length).toBeLessThan(40)
    const decoded = await decodeDoc(encoded, pro)
    const first = decoded?.sections[0]
    expect(first?.type === "section" && first.props.headline).toBe(
      "Ship faster { with } <care> & “quotes”"
    )
  })

  it("rejects garbage, unknown sections, unknown Pro blocks and unsafe links", async () => {
    expect(await decodeDoc("", pro)).toBeNull()
    expect(await decodeDoc("2abc", pro)).toBeNull()
    expect(await decodeDoc("1!!!", pro)).toBeNull()
    expect(await decodeDoc("1AAAA", pro)).toBeNull()
    expect(await decodeDoc(`1${"A".repeat(9000)}`, pro)).toBeNull()

    const doc = docOf(["hero-centered"])
    doc.sections.push(
      placePro({ name: "not-a-block", title: "Nope", category: "ai" })
    )
    const placed = doc.sections[0]
    if (placed.type !== "section") throw new Error("expected a section")
    placed.props = { ...placed.props, primaryHref: "javascript:alert(1)" }
    const decoded = await decodeDoc(await encodeDoc(doc), pro)
    expect(decoded?.sections).toHaveLength(1)
    const first = decoded?.sections[0]
    expect(first?.type === "section" && first.props.primaryHref).toBe("/signup")
  })

  it("reads and writes the hash without dropping the theme", () => {
    expect(readHashParams("#p=1abc&t=xyz")).toEqual({
      page: "1abc",
      theme: "xyz",
    })
    expect(writeHashParams("#t=xyz&x=1", "1abc")).toBe("#x=1&p=1abc")
    expect(writeHashParams("#p=1abc", null)).toBe("")
  })
})

describe("TSX printer", () => {
  it("escapes text that JSX would read as code", () => {
    const out = printNode(h("p", { title: 'say "hi"' }, "a {b} <c> & d"))
    expect(out).toBe('<p title={"say \\"hi\\""}>{"a {b} <c> & d"}</p>')
  })

  it("prints element props", () => {
    const out = printNode(
      h("Button", { nativeButton: false, render: h("a", { href: "/x" }) }, "Go")
    )
    expect(out).toBe(
      '<Button nativeButton={false} render={<a href="/x" />}>Go</Button>'
    )
  })
})

describe("page export", () => {
  const doc = fullDoc()
  const result = exportPage(doc)

  it("writes a page and one file per section, with no comments", () => {
    expect(result.files[0].path).toBe("app/page.tsx")
    expect(result.files).toHaveLength(doc.sections.length + 1)
    expect(new Set(result.files.map((file) => file.path)).size).toBe(
      result.files.length
    )
    for (const file of result.files)
      expect(hasComments(file.content), file.path).toBe(false)
    expect(result.registry).toEqual(["accordion", "avatar", "badge", "button"])
    expect(result.dependencies).toEqual(["@tabler/icons-react"])
    expect(result.proBlocks).toEqual([
      { name: "chat-thread", title: "Chat Thread" },
    ])
  })

  it("transpiles every generated file", () => {
    for (const file of result.files) {
      const output = ts.transpileModule(file.content, {
        fileName: file.path,
        reportDiagnostics: true,
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
          target: ts.ScriptTarget.ES2022,
        },
      })
      expect(output.diagnostics, file.path).toEqual([])
    }
  })

  it("type-checks against the real HextaUI components", () => {
    const root = process.cwd()
    const virtual = new Map(
      result.files.map((file) => [
        path.join(
          root,
          file.path === "app/page.tsx"
            ? "components/sections/index.tsx"
            : file.path
        ),
        file.content,
      ])
    )
    const config = ts.readConfigFile(
      path.join(root, "tsconfig.json"),
      ts.sys.readFile
    )
    const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root)
    const host = ts.createCompilerHost({ ...parsed.options, noEmit: true })
    const readFile = host.readFile
    const fileExists = host.fileExists
    host.readFile = (name) => virtual.get(name) ?? readFile(name)
    const directoryExists = host.directoryExists?.bind(host)
    const sectionsDir = path.join(root, "components/sections")
    host.fileExists = (name) => virtual.has(name) || fileExists(name)
    host.directoryExists = (name) =>
      name === sectionsDir ||
      (directoryExists?.(name) ?? ts.sys.directoryExists(name))
    const program = ts.createProgram(
      [...virtual.keys()],
      { ...parsed.options, noEmit: true },
      host
    )
    const diagnostics = ts
      .getPreEmitDiagnostics(program)
      .filter((item) => item.file && virtual.has(item.file.fileName))
      .map(
        (item) =>
          `${item.file?.fileName}: ${ts.flattenDiagnosticMessageText(item.messageText, "\n")}`
      )
    expect(diagnostics).toEqual([])
  }, 60_000)

  it("keeps navbars and footers outside main", () => {
    const page = exportPage(docOf(starterSections)).files[0].content
    expect(page.indexOf("<Navbar />")).toBeLessThan(page.indexOf("<main>"))
    expect(page.indexOf("<Footer />")).toBeGreaterThan(page.indexOf("</main>"))
  })

  it("builds install commands and a valid registry item", async () => {
    const encoded = await encodeDoc(doc)
    expect(pageInstallCommand(encoded)).toBe(
      `npx shadcn@latest add https://hextaui.com/r/pages/${encoded}.json`
    )
    expect(componentsInstallCommand(result)).toContain(
      "https://hextaui.com/r/button.json"
    )
    expect(proInstallCommand(result)).toBe(
      "npx shadcn@latest add @hextaui-pro/chat-thread"
    )
    const item = registryItem(result, encoded)
    expect(item.type).toBe("registry:block")
    expect(item.registryDependencies).toContain(
      "https://hextaui.com/r/accordion.json"
    )
    expect(
      item.files.every(
        (file) => file.content.length > 0 && file.target === file.path
      )
    ).toBe(true)
    expect(JSON.stringify(item)).not.toMatch(/hextaui-pro\/chat-thread\.json/)
  })
})

describe("zip", () => {
  it("writes a readable store-only archive", () => {
    const zip = createZip([
      { path: "app/page.tsx", content: "export default 1\n" },
      {
        path: "components/sections/hero.tsx",
        content: "export const a = “b”\n",
      },
    ])
    const view = new DataView(zip.buffer)
    expect(view.getUint32(0, true)).toBe(0x04034b50)
    const end = zip.length - 22
    expect(view.getUint32(end, true)).toBe(0x06054b50)
    expect(view.getUint16(end + 10, true)).toBe(2)
    const nameLength = view.getUint16(26, true)
    const size = view.getUint32(18, true)
    const data = zip.slice(30 + nameLength, 30 + nameLength + size)
    expect(new TextDecoder().decode(data)).toBe("export default 1\n")
    expect(view.getUint32(14, true)).toBe(crc32(data))
    expect(crc32(new TextEncoder().encode("hello"))).toBe(0x3610a686)
  })
})
