import { existsSync, readdirSync } from "node:fs"
import path from "node:path"

import type { MetadataRoute } from "next"

import { blogContentFile } from "@/lib/blog-content"
import { isBlogSlug } from "@/lib/blog"
import { commitDate, git, hasHistory, proDir } from "@/lib/git-dates"
import { categorySources } from "@/lib/category-lists"
import { componentCategories } from "@/lib/component-categories"
import { ogImagePath } from "@/lib/metadata"
import { getOgPages } from "@/lib/og-pages"
import { proBlocks } from "@/lib/pro/catalog"
import { getStudies, getStudyHref } from "@/lib/research"
import { getShadcnComparisons } from "@/lib/shadcn-compare"
import { absoluteUrl, isNoindexPath, isUnlistedPath } from "@/lib/site"

export const dynamic = "force-static"

const appDir = path.join(process.cwd(), "app")

const dynamicRoutes: Record<string, string[]> = {
  "/blocks/[name]": proBlocks.map((block) => block.name),
  "/compare/shadcn-ui/[component]": getShadcnComparisons().map(
    (comparison) => comparison.slug
  ),
  "/components/[category]": componentCategories.map(
    (category) => category.slug
  ),
  "/research/[topic]": getStudies().map((study) => study.slug),
}

const ogPaths = new Set(getOgPages().map((page) => page.path))

function ogImage(route: string) {
  const parent = /^\/docs\/[^/]+/.exec(route)?.[0]
  const path = ogPaths.has(route)
    ? route
    : parent && ogPaths.has(parent)
      ? parent
      : null
  return [absoluteUrl(path ? ogImagePath(path) : "/opengraph-image")]
}

const priorities: [string, number][] = [
  ["/components", 0.8],
  ["/docs", 0.7],
  ["/blog", 0.7],
  ["/blocks", 0.6],
  ["/legal", 0.2],
]

type Page = { route: string; file: string }

function findPages(dir: string, segments: string[] = []): Page[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isFile() && /^page\.(tsx|ts|jsx|js|mdx)$/.test(entry.name)) {
      return [
        { route: `/${segments.join("/")}`, file: path.join(dir, entry.name) },
      ]
    }

    if (
      !entry.isDirectory() ||
      entry.name.startsWith("_") ||
      entry.name.startsWith("@")
    ) {
      return []
    }

    const segment = /^\(.+\)$/.test(entry.name) ? [] : [entry.name]
    return findPages(path.join(dir, entry.name), [...segments, ...segment])
  })
}

function ignoredFiles(files: string[]) {
  const output = git(["check-ignore", "--stdin"], files.join("\n"))
  return new Set(output ? output.split("\n") : [])
}

function sourcesFor(route: string, file: string) {
  const post = /^\/blog\/([^/]+)$/.exec(route)?.[1]
  if (post && isBlogSlug(post)) return [file, blogContentFile(post)]
  const compared = /^\/compare\/shadcn-ui\/([^/]+)$/.exec(route)?.[1]
  if (compared) {
    return [file, `components/ui/${compared}.tsx`, "lib/shadcn-snapshot.json"]
  }
  const category = /^\/components\/([^/]+)$/.exec(route)?.[1]
  if (category) return categorySources(category)

  const slug = /^\/docs\/([^/]+)$/.exec(route)?.[1]
  if (!slug) return [file]

  return [
    file,
    `components/examples/${slug}`,
    `components/ui/${slug}.tsx`,
    `hooks/${slug}.ts`,
    `lib/${slug}.ts`,
  ].filter((source) => existsSync(path.resolve(process.cwd(), source)))
}

function researchDate(route: string) {
  const studies = getStudies().filter(
    (study) => route === "/research" || getStudyHref(study.slug) === route
  )
  const latest = studies.map((study) => study.updated).sort().at(-1)
  return latest ? new Date(`${latest}T00:00:00Z`) : undefined
}

function lastModified(route: string, file: string, history: boolean) {
  if (route === "/research" || route.startsWith("/research/")) {
    return researchDate(route)
  }

  if (!history) {
    return undefined
  }

  const block = /^\/blocks\/([^/]+)$/.exec(route)?.[1]
  if (block && existsSync(path.join(proDir, ".git"))) {
    const date = commitDate(["--", `blocks/${block}`], proDir)
    if (date) return date
  }

  return commitDate(["--", ...sourcesFor(route, file)])
}

function expand(route: string) {
  if (!route.includes("[")) {
    return [route]
  }

  const values = dynamicRoutes[route]
  if (!values) {
    throw new Error(
      `sitemap: add ${route} to dynamicRoutes in app/sitemap.ts or disallow it in lib/site.ts`
    )
  }

  return values.map((value) =>
    value.startsWith("/") ? value : route.replace(/\[[^\]]+\]/, value)
  )
}

function priority(route: string) {
  if (route === "/") {
    return 1
  }

  const match = priorities.find(
    ([prefix]) => route === prefix || route.startsWith(`${prefix}/`)
  )
  return match?.[1] ?? 0.5
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = findPages(appDir).filter(
    (page) =>
      !isNoindexPath(page.route) &&
      !isUnlistedPath(page.route) &&
      !page.route.startsWith("/[lang]")
  )
  const ignored = ignoredFiles(pages.map((page) => page.file))
  const history = hasHistory()

  return pages
    .filter((page) => !ignored.has(page.file))
    .flatMap((page) =>
      expand(page.route).map((route) => ({
        url: absoluteUrl(route),
        lastModified: lastModified(route, page.file, history),
        priority: priority(route),
        images: ogImage(route),
      }))
    )
    .sort((a, b) => b.priority - a.priority || a.url.localeCompare(b.url))
}
