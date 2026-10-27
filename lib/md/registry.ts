import type * as React from "react"
import type { Metadata } from "next"

import sitemap from "@/app/sitemap"
import { LegalPage, legalPages } from "@/components/legal/legal-page"
import { getHomeMarkdown } from "@/lib/agent-content"
import { getBlogIndexMarkdown, getBlogPostMarkdown } from "@/lib/blog-content"
import { blogPosts, getBlogHref, getBlogPost, isBlogSlug } from "@/lib/blog"
import { changelog, changelogGroups } from "@/lib/changelog"
import { comparisons } from "@/lib/compare"
import {
  componentCategories,
  getCategoryComponents,
  getComponentCategory,
  getComponentCategoryHref,
} from "@/lib/component-categories"
import { docsComponents, docsEntries, getDocsExampleHref } from "@/lib/docs"
import { getAllDocsExamples, getDocsExampleMarkdown } from "@/lib/docs-examples"
import {
  docsMarkdownPages,
  expandTree,
  findDocsElement,
  getDocsMarkdown,
  renderMarkdownBlocks,
} from "@/lib/docs-markdown"
import { getProBlocksUsing, getRelatedDocs } from "@/lib/docs-related"
import {
  bullets,
  filterSections,
  finishMarkdownPage,
  heading,
  linkItem,
  type MarkdownLink,
} from "@/lib/md/format"
import {
  markdownPathFor,
  matchMarkdownRoute,
  normalizeMarkdownPath,
  type MarkdownRoutePattern,
} from "@/lib/md/routes"
import { getPricingMarkdown, pricingUpdated } from "@/lib/pricing-info"
import { blockSections, getProBlock, proBlocks } from "@/lib/pro/catalog"
import { getStudies, getStudy, getStudyHref } from "@/lib/research"
import {
  getResearchIndexMarkdown,
  getStudyMarkdown,
} from "@/lib/research/markdown"
import {
  getShadcnComparison,
  getShadcnComparisonHref,
  getShadcnComparisons,
} from "@/lib/shadcn-compare"
import { absoluteUrl, siteName } from "@/lib/site"

type MarkdownSection = "core" | "docs" | "content" | "compare" | "legal"

type RenderOptions = { full: boolean }

type Rendered = {
  markdown: string
  updated?: string
  related?: MarkdownLink[]
}

type MarkdownRenderer = {
  pattern: MarkdownRoutePattern
  section: MarkdownSection
  full?: boolean
  listed?: boolean
  paths: () => string[] | Promise<string[]>
  render: (path: string, options: RenderOptions) => Promise<Rendered | null>
}

type MarkdownRoute = {
  path: string
  pattern: MarkdownRoutePattern
  section: MarkdownSection
  full: boolean
  listed: boolean
}

type PageModule = {
  default: (props: never) => React.ReactNode | Promise<React.ReactNode>
  metadata?: Metadata
}

const sitePages: Record<string, () => Promise<PageModule>> = {
  "/about": () => import("@/app/about/page"),
  "/contact": () => import("@/app/contact/page"),
  "/sponsor": () => import("@/app/sponsor/page"),
  "/compare": () => import("@/app/compare/page"),
  "/compare/ai-elements": () => import("@/app/compare/ai-elements/page"),
  "/compare/assistant-ui": () => import("@/app/compare/assistant-ui/page"),
  "/compare/prompt-kit": () => import("@/app/compare/prompt-kit/page"),
  "/compare/shadcn-ui": () => import("@/app/compare/shadcn-ui/page"),
  "/compare/shadcn-ai-chat-templates": () =>
    import("@/app/compare/shadcn-ai-chat-templates/page"),
  "/legal/license": () => import("@/app/legal/license/page"),
  "/legal/privacy": () => import("@/app/legal/privacy/page"),
  "/legal/refunds": () => import("@/app/legal/refunds/page"),
  "/legal/terms": () => import("@/app/legal/terms/page"),
}

const loadBlockPage = (): Promise<PageModule> =>
  import("@/app/blocks/(detail)/[name]/page")
const loadShadcnComparisonPage = (): Promise<PageModule> =>
  import("@/app/compare/shadcn-ui/[component]/page")

function metadataText(metadata: Metadata | undefined) {
  const title = metadata?.title
  const text =
    typeof title === "string"
      ? title
      : title && "absolute" in title
        ? title.absolute
        : ""
  return {
    title: text.replace(/ — HextaUI$/, ""),
    description: metadata?.description ? String(metadata.description) : "",
  }
}

async function renderPageTree(
  load: () => Promise<PageModule>,
  { params, expand = false }: { params?: object; expand?: boolean } = {}
) {
  const page = await load()
  const rendered = await page.default(
    (params ? { params: Promise.resolve(params) } : {}) as never
  )
  const tree = expand ? await expandTree(rendered) : rendered
  const parts = await renderMarkdownBlocks(tree, { source: false, slug: "" })
  const first = parts.findIndex((part) => part.startsWith("# "))
  const { title, description } = metadataText(page.metadata)
  const body = first === -1 ? [heading(1, title), ...parts] : parts.slice(first)
  if (!body[1]?.startsWith("> ") && description) {
    body.splice(1, 0, `> ${description}`)
  }
  return { markdown: `${body.join("\n\n")}\n`, tree }
}

async function renderSitePage(path: string) {
  const load = sitePages[path]
  if (!load) return null
  const { markdown, tree } = await renderPageTree(load, {
    expand: path === "/sponsor",
  })
  const legal = findDocsElement(tree, LegalPage)
  return {
    markdown,
    ...(legal ? { updated: String(legal.props.updated) } : {}),
  }
}

const docsFullSections = new Set([
  "Installation",
  "Examples",
  "API reference",
  "Keyboard",
  "Theme",
  "Notes for AI assistants",
])

function compactForFull(
  markdown: string,
  path: string,
  keep: (title: string) => boolean
) {
  return `${filterSections(markdown, keep).trim()}\n\nInstallation, examples, theming, keyboard support, API reference and source: ${absoluteUrl(markdownPathFor(path))}\n`
}

function slugOf(path: string, index: number) {
  return path.split("/")[index] ?? ""
}

function componentLink(slug: string): MarkdownLink {
  const component = docsEntries.find((entry) => entry.slug === slug)
  return {
    title: component?.name ?? slug,
    href: `/docs/${slug}`,
    description: component?.description,
  }
}

function getComponentsMarkdown() {
  return [
    heading(1, "React UI components for shadcn/ui"),
    `> ${docsComponents.length} free, open-source React components for shadcn/ui on Base UI and Tailwind CSS, from inputs and dialogs to data tables, date pickers and chat. Live previews of each.`,
    heading(2, "Browse by category"),
    componentCategories
      .map((category) =>
        linkItem({
          title: category.name,
          href: getComponentCategoryHref(category.slug),
          description: category.description,
        })
      )
      .join("\n"),
    heading(2, "Components"),
    docsComponents
      .map((entry) => linkItem(componentLink(entry.slug)))
      .join("\n"),
  ].join("\n\n")
}

function getCategoryMarkdown(slug: string) {
  const category = getComponentCategory(slug)
  if (!category) return null
  const components = getCategoryComponents(category.slug)
  const blocks = [
    ...new Map(
      components
        .flatMap((component) => getProBlocksUsing(component.slug))
        .map((block) => [block.href, block])
    ).values(),
  ].slice(0, 6)
  return {
    markdown: [
      heading(1, category.title),
      `> ${category.description}`,
      ...category.intro,
      heading(2, "What each one does"),
      components.map((entry) => linkItem(componentLink(entry.slug))).join("\n"),
      ...(blocks.length > 0
        ? [
            heading(2, "Built into Pro blocks"),
            "Blocks for AI products that are built from these components.",
            blocks.map(linkItem).join("\n"),
          ]
        : []),
    ].join("\n\n"),
    related: componentCategories
      .filter((item) => item.slug !== category.slug)
      .map((item) => ({
        title: item.name,
        href: getComponentCategoryHref(item.slug),
        description: item.description,
      })),
  }
}

function getBlocksMarkdown() {
  return [
    heading(1, "React blocks for AI products, built on shadcn/ui"),
    "> Drop-in shadcn/ui blocks that ship your AI app’s chat UI in days, with streaming, tool calls, reasoning and voice done. Part of HextaUI Pro, Prompt Input free.",
    `${proBlocks.length} blocks. Every block is part of ${siteName} Pro (${absoluteUrl("/pricing")}); blocks marked free install without a token.`,
    ...blockSections.flatMap((section) => [
      heading(2, section.title),
      section.blocks
        .map((block) =>
          linkItem({
            title: `${block.title}${block.free ? " (free)" : ""}`,
            href: `/blocks/${block.name}`,
            description: block.description,
          })
        )
        .join("\n"),
    ]),
  ].join("\n\n")
}

function getChangelogMarkdown() {
  return [
    heading(1, "Changelog"),
    "> Every HextaUI and HextaUI Pro release, newest first: new components and blocks, improvements and what was removed.",
    ...changelog.flatMap((entry) => [
      heading(2, `${entry.date}: ${entry.title}`),
      ...entry.body,
      ...changelogGroups.flatMap(({ key, heading: title }) => {
        const items = entry[key]
        return items?.length ? [heading(3, title), bullets(items)] : []
      }),
    ]),
  ].join("\n\n")
}

const renderers: MarkdownRenderer[] = [
  {
    pattern: "/",
    section: "core",
    paths: () => ["/"],
    render: async () => ({ markdown: getHomeMarkdown() }),
  },
  {
    pattern: "/pricing",
    section: "core",
    paths: () => ["/pricing"],
    render: async () => ({
      markdown: getPricingMarkdown(),
      updated: pricingUpdated,
    }),
  },
  {
    pattern: "/components",
    section: "core",
    paths: () => ["/components"],
    render: async () => ({ markdown: getComponentsMarkdown() }),
  },
  {
    pattern: "/blocks",
    section: "core",
    paths: () => ["/blocks"],
    render: async () => ({ markdown: getBlocksMarkdown() }),
  },
  {
    pattern: "/blog",
    section: "core",
    paths: () => ["/blog"],
    render: async () => ({ markdown: getBlogIndexMarkdown() }),
  },
  {
    pattern: "/compare",
    section: "core",
    paths: () => ["/compare"],
    render: renderSitePage,
  },
  {
    pattern: "/changelog",
    section: "core",
    paths: () => ["/changelog"],
    render: async () => ({
      markdown: getChangelogMarkdown(),
      updated: changelog[0]?.date,
    }),
  },
  {
    pattern: "/about",
    section: "core",
    paths: () => ["/about"],
    render: renderSitePage,
  },
  {
    pattern: "/contact",
    section: "core",
    paths: () => ["/contact"],
    render: renderSitePage,
  },
  {
    pattern: "/sponsor",
    section: "core",
    paths: () => ["/sponsor"],
    render: renderSitePage,
  },
  {
    pattern: "/docs",
    section: "docs",
    paths: () => ["/docs"],
    render: async (_path, { full }) => ({
      markdown: await getDocsMarkdown("", { source: !full }),
    }),
  },
  {
    pattern: "/docs/:slug",
    section: "docs",
    paths: () =>
      docsMarkdownPages
        .filter((slug) => slug !== "")
        .map((slug) => `/docs/${slug}`),
    render: async (path, { full }) => {
      const slug = slugOf(path, 2)
      if (!docsMarkdownPages.includes(slug)) return null
      const entry = docsEntries.some((item) => item.slug === slug)
      const markdown = await getDocsMarkdown(slug, { source: !full })
      if (full) {
        return {
          markdown: compactForFull(
            markdown,
            path,
            (title) => !docsFullSections.has(title)
          ),
        }
      }
      return {
        markdown,
        related: entry && !full ? getRelatedDocs(slug) : undefined,
      }
    },
  },
  {
    pattern: "/components/:category",
    section: "content",
    full: false,
    paths: () =>
      componentCategories.map((category) =>
        getComponentCategoryHref(category.slug)
      ),
    render: async (path) => getCategoryMarkdown(slugOf(path, 2)),
  },
  {
    pattern: "/blocks/:name",
    section: "content",
    paths: () => proBlocks.map((block) => `/blocks/${block.name}`),
    render: async (path, { full }) => {
      const name = slugOf(path, 2)
      if (!getProBlock(name)) return null
      const { markdown } = await renderPageTree(loadBlockPage, {
        params: { name },
      })
      return {
        markdown: full
          ? compactForFull(markdown, path, (title) => title === "Overview")
          : markdown,
      }
    },
  },
  {
    pattern: "/blog/:slug",
    section: "content",
    paths: () => blogPosts.map((post) => getBlogHref(post.slug)),
    render: async (path) => {
      const slug = slugOf(path, 2)
      if (!isBlogSlug(slug)) return null
      return {
        markdown: await getBlogPostMarkdown(slug),
        updated: getBlogPost(slug).published,
        related: blogPosts
          .filter((post) => post.slug !== slug)
          .slice(0, 5)
          .map((post) => ({
            title: post.title,
            href: getBlogHref(post.slug),
            description: post.description,
          })),
      }
    },
  },
  {
    pattern: "/compare/:slug",
    section: "compare",
    paths: () => comparisons.map((page) => page.href),
    render: renderSitePage,
  },
  {
    pattern: "/compare/shadcn-ui/:component",
    section: "compare",
    full: false,
    paths: () =>
      getShadcnComparisons().map((item) => getShadcnComparisonHref(item.slug)),
    render: async (path) => {
      const component = slugOf(path, 3)
      if (!getShadcnComparison(component)) return null
      const { markdown } = await renderPageTree(loadShadcnComparisonPage, {
        params: { component },
        expand: true,
      })
      return {
        markdown,
        related: [componentLink(component), ...getRelatedDocs(component)],
      }
    },
  },
  {
    pattern: "/docs/:slug/examples/:example",
    section: "docs",
    full: false,
    listed: false,
    paths: async () =>
      (await getAllDocsExamples()).map((example) =>
        getDocsExampleHref(example.file)
      ),
    render: async (path) => {
      const markdown = await getDocsExampleMarkdown(
        slugOf(path, 2),
        slugOf(path, 4)
      )
      return markdown ? { markdown } : null
    },
  },
  {
    pattern: "/research",
    section: "content",
    paths: () => ["/research"],
    render: async () => ({
      markdown: getResearchIndexMarkdown(),
      updated: getStudies()
        .map((study) => study.updated)
        .sort()
        .at(-1),
    }),
  },
  {
    pattern: "/research/:topic",
    section: "content",
    paths: () => getStudies().map((study) => getStudyHref(study.slug)),
    render: async (path) => {
      const study = getStudy(slugOf(path, 2))
      if (!study) return null
      return {
        markdown: getStudyMarkdown(study),
        updated: study.updated,
        related: [
          { title: "All research", href: "/research" },
          ...study.related,
        ],
      }
    },
  },
  {
    pattern: "/legal/:page",
    section: "legal",
    paths: () => legalPages.map((page) => page.href),
    render: renderSitePage,
  },
]

let routes: Promise<MarkdownRoute[]> | undefined

function listMarkdownRoutes() {
  routes ??= Promise.all(
    renderers.map(async (renderer) =>
      (await renderer.paths()).map((path) => ({
        path,
        pattern: renderer.pattern,
        section: renderer.section,
        full: renderer.full ?? true,
        listed: renderer.listed ?? true,
      }))
    )
  ).then((groups) => groups.flat())
  return routes
}

let updatedDates: Map<string, Date> | undefined

function sitemapDate(path: string) {
  updatedDates ??= new Map(
    sitemap().flatMap((entry) =>
      entry.lastModified
        ? [[new URL(entry.url).pathname, new Date(entry.lastModified)]]
        : []
    )
  )
  return updatedDates.get(path)
}

async function renderMarkdownRoute(
  path: string,
  { full = false }: Partial<RenderOptions> = {}
) {
  const route = normalizeMarkdownPath(path)
  const pattern = matchMarkdownRoute(route)
  const renderer = renderers.find((item) => item.pattern === pattern)
  if (!renderer) return null
  if (!(await renderer.paths()).includes(route)) return null
  const rendered = await renderer.render(route, { full })
  if (!rendered) return null
  return finishMarkdownPage(rendered.markdown, {
    path: route,
    updated: rendered.updated ?? sitemapDate(route),
    related: rendered.related,
  })
}

export {
  listMarkdownRoutes,
  renderMarkdownRoute,
  renderers as markdownRenderers,
  type MarkdownRoute,
  type MarkdownSection,
}
