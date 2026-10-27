import { absoluteUrl } from "@/lib/site"

type MarkdownLink = { title: string; href: string; description?: string }

type PageDetails = {
  path: string
  updated?: string | Date
  related?: MarkdownLink[]
}

function heading(level: number, text: string) {
  return `${"#".repeat(level)} ${text}`
}

function escapeLinkText(text: string) {
  return text.replace(/([\\[\]])/g, "\\$1")
}

function absoluteHref(href: string) {
  return /^(https?:|mailto:)/.test(href) ? href : absoluteUrl(href)
}

function link(text: string, href: string) {
  return `[${escapeLinkText(text)}](${absoluteHref(href)})`
}

function linkItem({ title, href, description }: MarkdownLink) {
  return `- ${link(title, href)}${description ? ` - ${description}` : ""}`
}

function bullets(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n")
}

function tableCell(text: string) {
  return text.replace(/\|/g, "\\|").replace(/\s+/g, " ").trim()
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

function isoDate(value: string | Date) {
  return (typeof value === "string" ? new Date(value) : value)
    .toISOString()
    .slice(0, 10)
}

function splitFrontmatter(markdown: string) {
  const match = /^---\n[\s\S]*?\n---\n+/.exec(markdown)
  return match
    ? { frontmatter: match[0], body: markdown.slice(match[0].length) }
    : { frontmatter: "", body: markdown }
}

function markdownMeta(markdown: string) {
  const { body } = splitFrontmatter(markdown)
  const title = /^# (.+)$/m.exec(body)?.[1]?.trim() ?? ""
  const summary = /^> (.+)$/m.exec(body)?.[1]?.trim() ?? ""
  return { title, summary }
}

function finishMarkdownPage(markdown: string, details: PageDetails) {
  const { frontmatter, body } = splitFrontmatter(markdown.trim())
  const titleEnd = body.indexOf("\n", body.search(/^# /m))
  let headEnd = titleEnd === -1 ? body.length : titleEnd
  const afterTitle = body.slice(headEnd).replace(/^\n+/, "")
  if (afterTitle.startsWith("> ")) {
    const summaryEnd = afterTitle.search(/\n\n/)
    headEnd =
      body.length -
      afterTitle.length +
      (summaryEnd === -1 ? afterTitle.length : summaryEnd)
  }
  const meta = [
    `Canonical: ${absoluteUrl(details.path)}`,
    ...(details.updated ? [`Last updated: ${isoDate(details.updated)}`] : []),
  ].join("\n")
  const rest = body.slice(headEnd).replace(/^\n+/, "")
  const blocks = [body.slice(0, headEnd), meta, ...(rest ? [rest] : [])]

  const related = details.related?.filter(
    (item, index, all) =>
      all.findIndex((other) => other.href === item.href) === index
  )
  if (related?.length) {
    blocks.push(heading(2, "Related"), related.map(linkItem).join("\n"))
  }

  return `${frontmatter}${blocks.join("\n\n")}\n`
}

function filterSections(markdown: string, keep: (title: string) => boolean) {
  const output: string[] = []
  let fence = ""
  let keeping = true
  for (const line of markdown.split("\n")) {
    const ticks = /^(`{3,})/.exec(line)?.[1]
    if (ticks && (!fence || ticks === fence)) fence = fence ? "" : ticks
    if (!fence && !ticks && line.startsWith("## "))
      keeping = keep(line.slice(3))
    if (keeping) output.push(line)
  }
  return output.join("\n").replace(/\n{3,}/g, "\n\n")
}

function approximateTokens(text: string) {
  return Math.ceil(text.length / 4)
}

export {
  absoluteHref,
  approximateTokens,
  bullets,
  escapeLinkText,
  fence,
  filterSections,
  finishMarkdownPage,
  heading,
  isoDate,
  link,
  linkItem,
  markdownMeta,
  splitFrontmatter,
  table,
  tableCell,
  type MarkdownLink,
}
