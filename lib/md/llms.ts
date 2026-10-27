import { agentWhenNotToUse, agentWhenToUse } from "@/lib/agent-content"
import { agentNotes } from "@/lib/agent-notes"
import { docsComponents, docsHooks, docsUtilities } from "@/lib/docs"
import {
  bullets,
  heading,
  isoDate,
  link,
  markdownMeta,
  splitFrontmatter,
} from "@/lib/md/format"
import {
  listMarkdownRoutes,
  renderMarkdownRoute,
  type MarkdownRoute,
  type MarkdownSection,
} from "@/lib/md/registry"
import { markdownPathFor } from "@/lib/md/routes"
import { priceLabel, proPlanInfo } from "@/lib/pricing-info"
import { proBlocks } from "@/lib/pro/catalog"
import { getResearchLlms } from "@/lib/research/markdown"
import {
  absoluteUrl,
  siteAuthor,
  siteContactEmail,
  siteName,
  siteRepository,
  siteSummary,
} from "@/lib/site"

type CatalogEntry = MarkdownRoute & {
  url: string
  markdown: string
  title: string
  summary: string
}

const llmsFullBudget = 500_000

const sectionOrder: MarkdownSection[] = [
  "core",
  "docs",
  "content",
  "compare",
  "legal",
]

const rendered = new Map<string, Promise<string | null>>()

function renderCached(path: string, full = false) {
  const key = `${full ? "full" : "md"}:${path}`
  if (!rendered.has(key)) rendered.set(key, renderMarkdownRoute(path, { full }))
  return rendered.get(key)!
}

function generatedDate() {
  return isoDate(new Date(process.env.NEXT_PUBLIC_BUILT_AT ?? Date.now()))
}

async function getMarkdownCatalog(): Promise<CatalogEntry[]> {
  const routes = await listMarkdownRoutes()
  const entries = await Promise.all(
    routes.map(async (route) => {
      const markdown = await renderCached(route.path)
      if (!markdown) return null
      return {
        ...route,
        url: absoluteUrl(route.path),
        markdown: absoluteUrl(markdownPathFor(route.path)),
        ...markdownMeta(markdown),
      }
    })
  )
  return entries.filter((entry): entry is CatalogEntry => entry !== null)
}

function siteFacts() {
  const plans = proPlanInfo
    .map((plan) => `${plan.shortName} ${priceLabel(plan)}`)
    .join(", ")
  return `${siteName} is made by ${siteAuthor}, an independent developer based in India. The ${docsComponents.length} components, ${docsHooks.length} hooks and ${docsUtilities.length} utilities are free and MIT licensed; ${siteName} Pro is a one-time payment for ${proBlocks.length} blocks and every future one (${plans}). It is for developers building React and Next.js apps with shadcn/ui and Tailwind CSS v4. Contact: ${siteContactEmail}. Source: ${siteRepository}.`
}

function catalogLine(entry: CatalogEntry, label = entry.title) {
  return `- ${link(label, entry.markdown)}${entry.summary ? `: ${entry.summary}` : ""}`
}

function lines(entries: CatalogEntry[]) {
  return entries.map((entry) => catalogLine(entry)).join("\n")
}

async function getLlmsTxt() {
  const catalog = (await getMarkdownCatalog()).filter((entry) => entry.listed)
  const by = (predicate: (entry: CatalogEntry) => boolean) =>
    catalog.filter(predicate)
  const core = by((entry) => entry.section === "core")
  const docs = by((entry) => entry.section === "docs")
  const blocks = by((entry) => entry.pattern === "/blocks/:name")
  const posts = by((entry) => entry.pattern === "/blog/:slug")
  const categories = by((entry) => entry.pattern === "/components/:category")
  const compare = by((entry) => entry.section === "compare")
  const legal = by((entry) => entry.section === "legal")
  const research = by((entry) => entry.pattern.startsWith("/research"))
  const tools = by((entry) => entry.pattern.startsWith("/tools"))
  const examples = (await listMarkdownRoutes()).filter(
    (route) => route.pattern === "/docs/:slug/examples/:example"
  ).length

  return `${[
    heading(1, siteName),
    `> ${siteSummary}`,
    siteFacts(),
    [
      "Notes for agents:",
      bullets(agentNotes),
      `- Every page has a Markdown version: append \`.md\` to its URL (${absoluteUrl("/pricing.md")}, ${absoluteUrl("/index.md")} for the home page), or request it with \`Accept: text/markdown\`.`,
    ].join("\n"),
    [`Use ${siteName} when:`, bullets(agentWhenToUse)].join("\n"),
    [`Do not use it when:`, bullets(agentWhenNotToUse)].join("\n"),
    getResearchLlms(),
    heading(2, "Core pages"),
    lines(core),
    heading(2, "Docs"),
    lines(docs),
    heading(2, "Blocks"),
    lines(blocks),
    heading(2, "Blog"),
    lines(posts),
    ...(research.length > 0 ? [heading(2, "Research"), lines(research)] : []),
    ...(tools.length > 0 ? [heading(2, "Free tools"), lines(tools)] : []),
    heading(2, "Component categories"),
    lines(categories),
    heading(2, "Comparisons"),
    lines(compare),
    heading(2, "Machine-readable"),
    [
      `- ${link("Full content", "/llms-full.txt")}: every core, docs, block, blog, comparison and legal page in one file`,
      `- ${link("Markdown catalog", "/api/md/_catalog")}: every Markdown URL with its title and summary, including ${examples} example pages`,
      `- ${link("Sitemap", "/sitemap.xml")}: every indexable HTML page`,
      `- ${link("AI usage policy", "/ai.txt")}: what AI systems may and may not do with this content`,
      `- ${link("OpenAPI", "/openapi.json")}: every HTTP endpoint`,
      `- ${link("MCP server", "/docs/mcp.md")}: read-only Streamable HTTP server at ${absoluteUrl("/mcp")}`,
      `- ${link("shadcn registry", "/r/registry.json")}: install any component with \`npx shadcn@latest add ${absoluteUrl("/r/<name>.json")}\``,
      `- ${link("Agent skill", "/.well-known/agent-skills/hextaui/SKILL.md")}: how an agent should find, read and install ${siteName} components`,
    ].join("\n"),
    heading(2, "Optional"),
    [
      lines(legal),
      `- ${link("Docs index", "/docs/llms.txt")}: only the docs pages, with every example page`,
      `- ${link("Pro blocks index", "/blocks/llms.txt")}: the ${siteName} Pro blocks and how to install them`,
      `- ${link("Blog index", "/blog/llms.txt")}: every article`,
    ].join("\n"),
    "<!-- Generated from lib/md/registry.ts. Keep in sync with /robots.txt and /ai.txt. -->",
  ].join("\n\n")}\n`
}

async function getLlmsFullTxt() {
  const routes = (await listMarkdownRoutes())
    .filter((route) => route.full)
    .sort(
      (a, b) =>
        sectionOrder.indexOf(a.section) - sectionOrder.indexOf(b.section)
    )
  const pages = await Promise.all(
    routes.map(async (route) => ({
      route,
      markdown: await renderCached(route.path, true),
    }))
  )
  const all = await listMarkdownRoutes()
  const left = all.filter((route) => !route.full).length

  const output = `${[
    `# ${siteName} - full content`,
    `> ${siteSummary}`,
    `Generated: ${generatedDate()}`,
    `Limits: docs pages keep their overview, usage and accessibility notes, and block pages their overview; each ends with a link to its own Markdown for installation, examples, the API reference and source. ${left} example, component-comparison and category pages are left out. ${absoluteUrl("/api/md/_catalog")} lists every Markdown URL.`,
    ...pages.flatMap(({ route, markdown }) =>
      markdown
        ? [
            `---\n<!-- source: ${absoluteUrl(route.path)} -->\n\n${splitFrontmatter(markdown).body.trim()}`,
          ]
        : []
    ),
  ].join("\n\n")}\n`

  if (output.length > llmsFullBudget) {
    console.warn(
      `llms-full.txt is ${output.length} characters, over the ${llmsFullBudget} budget.`
    )
  }
  return output
}

export { getLlmsFullTxt, getLlmsTxt, getMarkdownCatalog, renderCached }
