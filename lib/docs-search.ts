import * as React from "react"

import { DocsComponentPage } from "@/components/docs/docs-component-page"
import {
  DocsHeading,
  DocsList,
  DocsParagraph,
  DocsSection,
} from "@/components/docs/docs-content"
import { DocsExample } from "@/components/docs/docs-example"
import { DocsInstall } from "@/components/docs/docs-install"
import { DocsPage } from "@/components/docs/docs-page"
import {
  DocsAttributesTable,
  DocsKeyboardTable,
  DocsPropsTable,
  type DocsAttribute,
  type DocsKey,
  type DocsProp,
} from "@/components/docs/docs-props-table"
import { getDocsExampleHref, getDocsSlug } from "@/lib/docs"
import {
  docsMarkdownPages,
  isElement,
  loadDocsPage,
  toArray,
} from "@/lib/docs-markdown"
import {
  blockPageSlug,
  docsPageHref,
  packDocsSearchIndex,
  searchPageHref,
  type DocsSearchBlock,
  type DocsSearchRecord,
} from "@/lib/docs-search-query"
import { readDocsSource } from "@/lib/docs-source"
import { categoryTitle, proBlocks, type ProBlock } from "@/lib/pro/catalog"
import { blockKeywords } from "@/lib/pro/keywords"

type WalkContext = {
  slug: string
  trail: string[]
  current: DocsSearchRecord | null
  heading: string | null
  records: DocsSearchRecord[]
}

const textLimit = 320
const detailLimit = 160
const blockTextLimit = 480
const blockPropLimit = 120

function clip(value: string, limit: number) {
  return value.length > limit
    ? `${value.slice(0, limit).replace(/\s+\S*$/, "")}…`
    : value
}

function plain(node: React.ReactNode): string {
  return toArray(node)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child)
      }
      if (!isElement(child)) {
        return ""
      }
      const text = plain(child.props.children as React.ReactNode)
      return child.type === "li" ? `${text.replace(/\.$/, "")}. ` : text
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim()
}

function appendText(record: DocsSearchRecord | null, value: string) {
  if (!record || !value) {
    return
  }
  const text = record.text ? `${record.text} ${value}` : value
  record.text = clip(text, textLimit)
}

function addSection(
  context: WalkContext,
  {
    title,
    id,
    kind,
    text,
  }: {
    title: string
    id: string
    kind: DocsSearchRecord["kind"]
    text?: string
  }
) {
  const record: DocsSearchRecord = {
    href: `${docsPageHref(context.slug)}#${id}`,
    page: context.slug,
    title,
    kind,
    trail: context.trail.filter((title) => title !== "API reference"),
    ...(text ? { text } : {}),
  }
  context.records.push(record)
  return record
}

function walk(node: React.ReactNode, context: WalkContext) {
  for (const child of toArray(node)) {
    if (!isElement(child)) {
      continue
    }
    const props = child.props
    const children = props.children as React.ReactNode

    if (child.type === DocsComponentPage || child.type === DocsPage) {
      walk(children, context)
      continue
    }

    if (child.type === DocsSection) {
      const title = String(props.title)
      const record = addSection(context, {
        title,
        id: props.id ? String(props.id) : getDocsSlug(title),
        kind: context.trail.includes("API reference") ? "api" : "section",
        text: plain(props.description as React.ReactNode),
      })
      walk(children, {
        ...context,
        trail: [...context.trail, title],
        current: record,
      })
      continue
    }

    if (child.type === DocsExample) {
      if (!props.title) {
        continue
      }
      const title = String(props.title)
      const file = String(props.file)
      const record = addSection(context, {
        title,
        id: getDocsSlug(title),
        kind: "example",
        text: plain(props.description as React.ReactNode),
      })
      if (file.split("/")[0] === context.slug) {
        record.href = getDocsExampleHref(file)
      }
      continue
    }

    if (child.type === DocsInstall) {
      addSection(context, {
        title: "Installation",
        id: "installation",
        kind: "section",
        text: "Install with the shadcn CLI, or copy the source and its dependencies by hand.",
      })
      continue
    }

    if (child.type === DocsHeading) {
      const title = plain(children)
      const level = Number(props.level ?? 2)
      const trail =
        level === 3 && context.heading
          ? [...context.trail, context.heading]
          : context.trail
      if (level === 2) {
        context.heading = title
      }
      context.current = addSection(
        { ...context, trail },
        { title, id: String(props.id), kind: "section" }
      )
      continue
    }

    if (
      child.type === DocsParagraph ||
      child.type === DocsList ||
      child.type === "p" ||
      child.type === "ul" ||
      child.type === "ol"
    ) {
      appendText(context.current, plain(children))
      continue
    }

    if (child.type === DocsPropsTable && context.current) {
      for (const prop of props.props as DocsProp[]) {
        context.records.push({
          href: context.current.href,
          page: context.slug,
          title: prop.name,
          kind: "prop",
          trail: context.current.trail.concat(context.current.title),
          ...(prop.type ? { type: prop.type } : {}),
          ...(prop.default ? { default: prop.default } : {}),
          ...(prop.description
            ? {
                text: clip(
                  plain(prop.description as React.ReactNode),
                  detailLimit
                ),
              }
            : {}),
        })
      }
      continue
    }

    if (child.type === DocsAttributesTable && context.current) {
      for (const attribute of props.attributes as DocsAttribute[]) {
        context.records.push({
          href: context.current.href,
          page: context.slug,
          title: attribute.name,
          kind: "attribute",
          trail: context.current.trail.concat(context.current.title),
          ...(props.label ? { type: String(props.label) } : {}),
          text: clip(
            plain(attribute.description as React.ReactNode),
            detailLimit
          ),
        })
      }
      continue
    }

    if (child.type === DocsKeyboardTable) {
      appendText(
        context.current,
        (props.keys as DocsKey[])
          .map((row) => `${row.keys.join(" ")} ${plain(row.description)}`)
          .join(". ")
      )
      continue
    }

    walk(children, context)
  }
}

function firstSentence(value: string) {
  return value.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? value
}

function indexBlock(block: ProBlock) {
  const { overview, anatomy, api, keyboard, accessibility } = block.docs
  const page = blockPageSlug(block.name)
  const href = (id: string) => `${searchPageHref(page)}#${id}`
  const records: DocsSearchRecord[] = []
  const add = (record: Omit<DocsSearchRecord, "page">) => {
    records.push({ page, ...record })
  }

  for (const example of block.usage) {
    add({
      href: href(getDocsSlug(example.title)),
      title: example.title,
      kind: "example",
      trail: ["Usage"],
      ...(example.description
        ? { text: clip(example.description, detailLimit) }
        : {}),
    })
  }

  if (anatomy?.length) {
    add({
      href: href("anatomy"),
      title: "Anatomy",
      kind: "section",
      trail: [],
    })
    for (const part of anatomy) {
      add({
        href: href("anatomy"),
        title: part.name,
        kind: "attribute",
        trail: ["Anatomy"],
        type: "Part",
        text: clip(part.description, detailLimit),
      })
    }
  }

  for (const entry of api ?? []) {
    const anchor = href(getDocsSlug(entry.component))
    add({
      href: anchor,
      title: entry.component,
      kind: "api",
      trail: [],
      ...(entry.description
        ? { text: clip(entry.description, detailLimit) }
        : {}),
    })
    for (const prop of entry.props) {
      add({
        href: anchor,
        title: prop.name,
        kind: "prop",
        trail: [entry.component],
        ...(prop.type ? { type: prop.type } : {}),
        ...(prop.default ? { default: prop.default } : {}),
        ...(prop.description
          ? { text: clip(prop.description, blockPropLimit) }
          : {}),
      })
    }
  }

  if (keyboard?.length) {
    add({
      href: href("keyboard"),
      title: "Keyboard",
      kind: "section",
      trail: [],
      text: clip(
        keyboard
          .map((row) => `${row.keys.join(" ")} ${row.description}`)
          .join(". "),
        textLimit
      ),
    })
  }

  if (accessibility?.length) {
    add({
      href: href("accessibility"),
      title: "Accessibility",
      kind: "section",
      trail: [],
      text: clip(accessibility.join(" "), textLimit),
    })
  }

  const category = categoryTitle(block.category)
  const summary: DocsSearchBlock = {
    name: block.name,
    title: block.title,
    description: block.description,
    category,
    keywords: [
      ...new Set([
        category,
        ...(blockKeywords[block.name] ?? []),
        ...(overview?.length ? [firstSentence(overview[0])] : []),
      ]),
    ],
    text: [
      overview?.length ? clip(overview.join(" "), blockTextLimit) : "",
      ...(anatomy ?? []).map((part) => part.name),
    ]
      .filter(Boolean)
      .join(" "),
    ...(block.free ? { free: true } : {}),
  }

  return { summary, records }
}

async function readInstallable() {
  const registry = JSON.parse(await readDocsSource("registry.json")) as {
    items: { name: string; type: string }[]
  }
  return registry.items
    .filter((item) => item.type !== "registry:theme" && item.name !== "all")
    .map((item) => item.name)
}

async function getDocsSearchIndex() {
  const pages = await Promise.all(
    docsMarkdownPages.map(async (slug) => {
      const { default: Page } = await loadDocsPage(slug)
      const context: WalkContext = {
        slug,
        trail: [],
        current: null,
        heading: null,
        records: [],
      }
      walk(await Page(), context)
      return context.records
    })
  )

  const blocks = proBlocks.map(indexBlock)

  return packDocsSearchIndex({
    records: [...pages.flat(), ...blocks.flatMap((block) => block.records)],
    installable: await readInstallable(),
    blocks: blocks.map((block) => block.summary),
  })
}

export { getDocsSearchIndex }
