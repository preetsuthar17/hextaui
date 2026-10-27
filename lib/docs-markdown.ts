import * as React from "react"
import Link from "@/components/site/link"

import { DocsCodeBlock } from "@/components/docs/docs-code-block"
import { DocsCommand } from "@/components/docs/docs-command"
import { DocsComponentPage } from "@/components/docs/docs-component-page"
import {
  DocsCode,
  DocsHeading,
  DocsList,
  DocsParagraph,
  DocsSection,
} from "@/components/docs/docs-content"
import { DocsExample } from "@/components/docs/docs-example"
import { DocsBreadcrumbs } from "@/components/docs/docs-breadcrumbs"
import { DocsInstall, DocsStep } from "@/components/docs/docs-install"
import { DocsPage } from "@/components/docs/docs-page"
import {
  DocsAttributesTable,
  DocsKeyboardTable,
  DocsPropsTable,
  type DocsAttribute,
  type DocsKey,
  type DocsProp,
} from "@/components/docs/docs-props-table"
import { DocsRelated } from "@/components/docs/docs-related"
import { UnlessPro } from "@/components/blocks/unless-pro"
import {
  ContactEmail,
  contactEmail,
  LegalLink,
  LegalPage,
  LegalSection,
} from "@/components/legal/legal-page"
import {
  CompareLinkGrid,
  CompareLinks,
  CompareTable,
  MoreComparisons,
  type CompareLinkItem,
  type CompareRow,
} from "@/components/site/compare"
import { InfoPage, InfoSection } from "@/components/site/info-page"
import { JsonLd } from "@/components/site/json-ld"
import { TrackedLink } from "@/components/site/tracked-link"
import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table"
import { comparisons } from "@/lib/compare"
import {
  docsComponents,
  docsEntries,
  docsGuides,
  docsHooks,
  docsUtilities,
  getDocsComponent,
} from "@/lib/docs"
import { getRegistryKind } from "@/lib/docs-registry"
import { type RelatedLink } from "@/lib/docs-related"
import { readDocsSource } from "@/lib/docs-source"
import { agentNotes } from "@/lib/agent-notes"
import { absoluteUrl, siteName } from "@/lib/site"

type Element = React.ReactElement<Record<string, unknown>>

type DocsPageModule = { default: () => React.ReactNode }

type RenderOptions = { source: boolean; slug: string; exampleNames?: boolean }

type DocsMarkdownSection = { title: string; markdown: string }

function isElement(node: React.ReactNode): node is Element {
  return React.isValidElement(node)
}

function toArray(node: React.ReactNode): React.ReactNode[] {
  if (Array.isArray(node)) {
    return node.flatMap(toArray)
  }
  if (isElement(node) && node.type === React.Fragment) {
    return toArray(node.props.children as React.ReactNode)
  }
  return [node]
}

function inlineCode(value: string) {
  const fence = value.includes("`") ? "``" : "`"
  const pad = value.startsWith("`") || value.endsWith("`") ? " " : ""
  return `${fence}${pad}${value}${pad}${fence}`
}

function inline(node: React.ReactNode): string {
  const children = toArray(node)
  return children
    .map((child, index) => {
      const gap =
        index > 0 && isElement(child) && isElement(children[index - 1])
          ? " "
          : ""
      return `${gap}${inlineNode(child)}`
    })
    .join("")
    .replace(/\s+/g, " ")
}

function inlineNode(child: React.ReactNode): string {
  if (child === null || child === undefined || typeof child === "boolean") {
    return ""
  }
  if (typeof child === "string" || typeof child === "number") {
    return String(child)
  }
  if (!isElement(child)) {
    return ""
  }
  const children = child.props.children as React.ReactNode
  if (child.type === DocsCode || child.type === "code") {
    return inlineCode(inline(children))
  }
  if (
    child.type === "a" ||
    child.type === Link ||
    child.type === LegalLink ||
    child.type === TrackedLink
  ) {
    return `[${inline(children)}](${absoluteUrl(String(child.props.href))})`
  }
  if (child.type === ContactEmail) {
    return `[${contactEmail}](mailto:${contactEmail})`
  }
  if (child.type === "strong" || child.type === "b") {
    return `**${inline(children)}**`
  }
  if (child.type === "em" || child.type === "i") {
    return `_${inline(children)}_`
  }
  return inline(children)
}

function cell(node: React.ReactNode) {
  return inline(node).trim().replace(/\|/g, "\\|")
}

function codeCell(value: string | undefined) {
  return value ? inlineCode(value.replace(/\|/g, "\\|")) : "–"
}

function table(head: string[], rows: string[][]) {
  return [
    `| ${head.join(" | ")} |`,
    `| ${head.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n")
}

function fence(code: string, lang = "tsx", title?: string) {
  const source = code.trimEnd()
  const ticks = source.includes("```") ? "````" : "```"
  const meta = title ? ` title="${title}"` : ""
  return `${ticks}${lang}${meta}\n${source}\n${ticks}`
}

function heading(level: number, text: string) {
  return `${"#".repeat(level)} ${text}`
}

function linkList(
  links: { href: string; title: string; description?: string }[]
) {
  return links
    .map(
      (link) =>
        `- [${link.title}](${absoluteUrl(link.href)})${link.description ? ` - ${link.description}` : ""}`
    )
    .join("\n")
}

function findAll(node: React.ReactNode, type: React.ElementType): Element[] {
  return toArray(node).flatMap((child) => {
    if (!isElement(child)) return []
    if (child.type === type) return [child]
    return findAll(child.props.children as React.ReactNode, type)
  })
}

const markdownElementTypes = new Set<unknown>([
  DocsComponentPage,
  DocsPage,
  DocsSection,
  DocsHeading,
  DocsParagraph,
  DocsList,
  DocsCodeBlock,
  DocsExample,
  DocsInstall,
  DocsStep,
  DocsCommand,
  DocsCode,
  DocsPropsTable,
  DocsKeyboardTable,
  DocsAttributesTable,
  DocsRelated,
  DocsBreadcrumbs,
  InfoPage,
  InfoSection,
  LegalPage,
  LegalSection,
  LegalLink,
  ContactEmail,
  CompareTable,
  CompareLinks,
  CompareLinkGrid,
  MoreComparisons,
  JsonLd,
  Link,
  TrackedLink,
  UnlessPro,
  Table,
])

function isClientReference(type: unknown) {
  return (
    typeof type === "function" &&
    (type as { $$typeof?: symbol }).$$typeof ===
      Symbol.for("react.client.reference")
  )
}

async function expandTree(node: React.ReactNode): Promise<React.ReactNode> {
  if (Array.isArray(node)) {
    return Promise.all(node.map(expandTree))
  }
  if (!isElement(node)) {
    return node
  }
  if (
    typeof node.type === "function" &&
    !markdownElementTypes.has(node.type) &&
    !isClientReference(node.type)
  ) {
    const render = node.type as (props: unknown) => React.ReactNode
    return expandTree(await render(node.props))
  }
  if (node.props.children === undefined) {
    return node
  }
  return React.cloneElement(
    node,
    undefined,
    await expandTree(node.props.children as React.ReactNode)
  )
}

async function blocks(
  node: React.ReactNode,
  options: RenderOptions
): Promise<string[]> {
  const output: string[] = []

  for (const child of toArray(node)) {
    if (typeof child === "string" || typeof child === "number") {
      const text = inline(child).trim()
      if (text) {
        output.push(text)
      }
      continue
    }
    if (!isElement(child)) {
      continue
    }
    output.push(...(await element(child, options)))
  }

  return output
}

async function element(
  node: Element,
  options: RenderOptions
): Promise<string[]> {
  const props = node.props
  const children = props.children as React.ReactNode

  if (node.type === DocsComponentPage) {
    const component = getDocsComponent(String(props.slug))
    return [
      ...pageHeader(component.name, component.description),
      ...(await blocks(children, options)),
    ]
  }

  if (node.type === DocsPage) {
    return [
      ...pageHeader(
        String(props.title),
        props.description ? inline(props.description as React.ReactNode) : ""
      ),
      ...(await blocks(children, options)),
    ]
  }

  if (node.type === DocsSection) {
    const description = props.description
      ? inline(props.description as React.ReactNode).trim()
      : ""
    return [
      heading(Number(props.level ?? 2), String(props.title)),
      ...(description ? [description] : []),
      ...(await blocks(children, options)),
    ]
  }

  if (node.type === InfoPage) {
    return [
      heading(1, String(props.title)),
      `> ${String(props.lead)}`,
      ...(await blocks(children, options)),
    ]
  }

  if (node.type === LegalPage) {
    return [
      heading(1, String(props.title)),
      `> ${String(props.description)}`,
      ...(await blocks(children, options)),
    ]
  }

  if (node.type === InfoSection || node.type === LegalSection) {
    return [
      heading(2, String(props.title)),
      ...(await blocks(children, options)),
    ]
  }

  if (node.type === DocsStep) {
    return [
      heading(3, `Step ${String(props.step)}: ${String(props.title)}`),
      ...(await blocks(children, options)),
    ]
  }

  if (node.type === UnlessPro) {
    return blocks(children, options)
  }

  if (node.type === DocsRelated) {
    const links = props.links as RelatedLink[]
    if (links.length === 0) return []
    return [
      heading(2, String(props.title)),
      ...(props.description ? [String(props.description)] : []),
      linkList(links),
    ]
  }

  if (node.type === CompareTable) {
    const columns = props.columns as string[]
    const rows = (props.rows as CompareRow[]).map((row) => [
      cell(row.label),
      ...row.values.map((value) => cell(value)),
    ])
    return [table([String(props.rowHeader ?? ""), ...columns], rows)]
  }

  if (node.type === CompareLinks || node.type === CompareLinkGrid) {
    return [linkList(props.items as CompareLinkItem[])]
  }

  if (node.type === MoreComparisons) {
    return [
      heading(2, "More comparisons"),
      linkList([
        { href: "/compare", title: "All comparisons" },
        ...comparisons.filter((page) => page.href !== props.current),
      ]),
    ]
  }

  if (node.type === Table) {
    const rows = findAll(children, TableRow).map((row) =>
      toArray(row.props.children as React.ReactNode)
        .filter(
          (item): item is Element =>
            isElement(item) &&
            (item.type === TableHead || item.type === TableCell)
        )
        .map((item) => cell(item.props.children as React.ReactNode))
    )
    const [head, ...body] = rows
    return head ? [table(head, body)] : []
  }

  if (
    node.type === JsonLd ||
    node.type === DocsBreadcrumbs ||
    node.type === "nav" ||
    node.type === "form" ||
    node.type === "script"
  ) {
    return []
  }

  if (
    node.type === "h1" ||
    node.type === "h2" ||
    node.type === "h3" ||
    node.type === "h4"
  ) {
    const text = inline(children).trim()
    return text ? [heading(Number(String(node.type).slice(1)), text)] : []
  }

  if (node.type === DocsHeading) {
    return [heading(Number(props.level ?? 2), inline(children).trim())]
  }

  if (node.type === DocsParagraph || node.type === "p") {
    const text = inline(children).trim()
    return text ? [text] : []
  }

  if (
    (node.type === "ul" || node.type === "ol") &&
    !toArray(children)
      .filter(isElement)
      .every((item) => item.type === "li")
  ) {
    return blocks(children, options)
  }

  if (node.type === DocsList || node.type === "ul" || node.type === "ol") {
    const ordered = node.type === "ol"
    const items = toArray(children)
      .filter(isElement)
      .map((item, index) => {
        const marker = ordered ? `${index + 1}.` : "-"
        return `${marker} ${inline(item.props.children as React.ReactNode).trim()}`
      })
    return items.length > 0 ? [items.join("\n")] : []
  }

  if (node.type === DocsCodeBlock) {
    return [
      fence(
        String(props.code),
        props.lang ? String(props.lang) : "tsx",
        props.title ? String(props.title) : undefined
      ),
    ]
  }

  if (node.type === DocsExample) {
    const file = `components/examples/${String(props.file)}.tsx`
    const code = options.source
      ? [fence(await readDocsSource(file), "tsx", file)]
      : []
    if (!props.title) {
      return code
    }
    const description = props.description
      ? inline(props.description as React.ReactNode).trim()
      : ""
    return [
      heading(Number(props.level ?? 3), String(props.title)),
      ...(description ? [description] : []),
      ...(options.exampleNames
        ? [`Example: ${inlineCode(getDocsExampleName(String(props.file)))}`]
        : []),
      ...code,
    ]
  }

  if (node.type === DocsInstall) {
    const dependencies = props.dependencies as string[]
    const files = props.files as string[]
    const kind = getRegistryKind(files)
    const install = [
      heading(2, "Installation"),
      heading(3, "CLI"),
      fence(
        `npx shadcn@latest add ${absoluteUrl(`/r/${options.slug}.json`)}`,
        "bash"
      ),
      kind === "component"
        ? "This adds the component, the HextaUI theme tokens and any HextaUI components it depends on."
        : `This adds the ${kind} and anything it depends on.`,
      heading(3, "Manual"),
      ...(kind === "component"
        ? [
            `Add the HextaUI theme tokens (${absoluteUrl("/docs/installation#theme")}) to your global CSS if you haven't yet, then install the dependencies.`,
          ]
        : []),
      ...(dependencies.length > 0
        ? [fence(`pnpm add ${dependencies.join(" ")}`, "bash")]
        : []),
    ]
    if (!options.source) {
      return [
        ...install,
        `Copy ${files.map(inlineCode).join(", ")} into your project. Their source is in this page's Markdown.`,
      ]
    }
    const sources = await Promise.all(
      files.map(async (file) =>
        fence(
          await readDocsSource(file),
          file.endsWith(".tsx") ? "tsx" : "ts",
          file
        )
      )
    )
    return [
      ...install,
      "Copy and paste the following code into your project.",
      ...sources,
      "Update the import paths to match your project setup.",
    ]
  }

  if (node.type === DocsCommand) {
    const packages = (props.packages as string[]).join(" ")
    return [
      fence(
        props.mode === "dlx" ? `npx ${packages}` : `pnpm add ${packages}`,
        "bash"
      ),
    ]
  }

  if (node.type === DocsPropsTable) {
    const rows = (props.props as DocsProp[]).map((prop) => [
      codeCell(prop.name),
      codeCell(prop.type),
      codeCell(prop.default),
      prop.description ? cell(prop.description) : "",
    ])
    return [table(["Prop", "Type", "Default", "Description"], rows)]
  }

  if (node.type === DocsKeyboardTable) {
    const rows = (props.keys as DocsKey[]).map((row) => [
      row.keys.map((key) => codeCell(key)).join(" "),
      cell(row.description),
    ])
    return [table(["Key", "Action"], rows)]
  }

  if (node.type === DocsAttributesTable) {
    const rows = (props.attributes as DocsAttribute[]).map((attribute) => [
      codeCell(attribute.name),
      cell(attribute.description),
    ])
    return [table([String(props.label ?? "Attribute"), "Description"], rows)]
  }

  return blocks(children, options)
}

function getDocsExampleName(file: string) {
  return file.replace("/", "-")
}

function pageHeader(title: string, description: string) {
  return [
    heading(1, title),
    ...(description ? [`> ${description.trim()}`] : []),
  ]
}

function loadDocsPage(slug: string): Promise<DocsPageModule> {
  return slug === ""
    ? import("../app/docs/page")
    : import(`../app/docs/${slug}/page`)
}

function findDocsElement(
  node: React.ReactNode,
  type: React.ElementType
): Element | undefined {
  for (const child of toArray(node)) {
    if (!isElement(child)) {
      continue
    }
    if (child.type === type) {
      return child
    }
    const found = findDocsElement(child.props.children as React.ReactNode, type)
    if (found) {
      return found
    }
  }
  return undefined
}

async function renderDocsPage(slug: string, options: RenderOptions) {
  const { default: Page } = await loadDocsPage(slug)
  return blocks(await Page(), options)
}

function sectionTitle(node: React.ReactNode) {
  if (!isElement(node)) {
    return "Overview"
  }
  if (node.type === DocsSection) {
    return String(node.props.title)
  }
  if (node.type === DocsInstall) {
    return "Installation"
  }
  return "Overview"
}

async function getDocsSections(slug: string): Promise<DocsMarkdownSection[]> {
  const { default: Page } = await loadDocsPage(slug)
  const tree = await Page()
  const page =
    findDocsElement(tree, DocsComponentPage) ?? findDocsElement(tree, DocsPage)
  const sections: DocsMarkdownSection[] = []

  for (const child of toArray(page?.props.children as React.ReactNode)) {
    const markdown = (
      await blocks(child, { source: false, slug, exampleNames: true })
    ).join("\n\n")
    if (!markdown) {
      continue
    }
    const title = sectionTitle(child)
    const previous = sections.at(-1)
    if (title === "Overview" && previous?.title === "Overview") {
      previous.markdown = `${previous.markdown}\n\n${markdown}`
    } else {
      sections.push({ title, markdown })
    }
  }

  return sections
}

async function getDocsMarkdown(slug: string, { source = true } = {}) {
  const output = await renderDocsPage(slug, { source, slug })

  if (source && docsEntries.some((item) => item.slug === slug)) {
    output.push(
      heading(2, "Notes for AI assistants"),
      agentNotes.map((note) => `- ${note}`).join("\n"),
      `Every ${siteName} doc: ${absoluteUrl("/llms.txt")}`
    )
  }

  return `${output.join("\n\n")}\n`
}

const docsMarkdownPages = [
  ...docsGuides.map((item) => item.slug),
  ...docsEntries.map((item) => item.slug),
]

function getDocsMarkdownHref(slug: string) {
  return slug === "" ? "/docs.md" : `/docs/${slug}.md`
}

function list(entries: typeof docsEntries) {
  return entries
    .map(
      (entry) =>
        `- [${entry.name}](${absoluteUrl(getDocsMarkdownHref(entry.slug))}): ${entry.description}`
    )
    .join("\n")
}

function guideList() {
  return docsGuides
    .map(
      (guide) =>
        `- [${guide.title}](${absoluteUrl(getDocsMarkdownHref(guide.slug))}): ${guide.description}`
    )
    .join("\n")
}

function getDocsLlms() {
  return `${[
    heading(1, `${siteName} docs`),
    `> Every ${siteName} docs page as Markdown: guides, components, hooks and utilities. Each component page has installation, usage, examples, keyboard support and an API reference.`,
    agentNotes.map((note) => `- ${note}`).join("\n"),
    heading(2, "Guides"),
    guideList(),
    heading(2, "Components"),
    list(docsComponents),
    heading(2, "Hooks"),
    list(docsHooks),
    heading(2, "Utilities"),
    list(docsUtilities),
    heading(2, "Optional"),
    `- [Site index](${absoluteUrl("/llms.txt")}): what ${siteName} is, when to use it, and every developer resource.`,
  ].join("\n\n")}\n`
}

export {
  blocks as renderMarkdownBlocks,
  expandTree,
  codeCell as docsCodeCell,
  docsMarkdownPages,
  fence as docsFence,
  findDocsElement,
  getDocsExampleName,
  getDocsSections,
  inline as docsInlineText,
  isElement,
  toArray,
  getDocsMarkdown,
  getDocsLlms,
  getDocsMarkdownHref,
  heading as docsHeading,
  loadDocsPage,
  table as docsTable,
  cell as docsCell,
}
