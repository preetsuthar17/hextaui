import type { Metadata } from "next"
import { beforeAll, describe, expect, it, vi } from "vitest"

import { translatedLocales } from "@/lib/i18n/config"
import { setRequestLocale } from "@/lib/i18n/request"
import {
  maxDescriptionLength,
  maxTitleWidth,
  metadataTitle,
  minDescriptionWidth,
  textWidth,
} from "@/lib/metadata"
import { getOgPages } from "@/lib/og-pages"
import {
  isNoindexPath,
  isUnlistedPath,
  siteDefaultImage,
  siteMetaDescription,
  siteTitle,
  siteUrl,
} from "@/lib/site"

vi.mock("react", async (importOriginal) => {
  const react = await importOriginal<typeof import("react")>()
  return {
    ...react,
    cache: <T>(fn: () => T) => {
      let value: T | undefined
      return () => (value ??= fn())
    },
  }
})

type Params = Record<string, string>
type PageModule = {
  metadata?: Metadata
  generateMetadata?: (props: { params: Promise<Params> }) => Promise<Metadata>
  generateStaticParams?: () => Params[] | Promise<Params[]>
}
type Page = {
  template: string
  path: string
  locale: string
  title: string
  description: string
  canonical?: string
  ogUrl?: string
  image?: { url?: unknown; width?: unknown; height?: unknown; alt?: unknown }
  noindex: boolean
}

const modules = import.meta.glob<PageModule>("../app/**/page.tsx")
const translatedTitleBudget = 112
const localePattern = /^\/(es|de|pt|fr|tr|ja)(?=\/|$)/

function routeOf(file: string) {
  const route = file
    .replace(/^\.\.\/app/, "")
    .replace(/\/page\.tsx$/, "")
    .replace(/\/\([^)]+\)/g, "")
  return route || "/"
}

function fill(route: string, params: Params) {
  return route.replace(/\[(\w+)\]/g, (_, key: string) => params[key])
}

function resolve(url: unknown) {
  if (!url) return undefined
  return new URL(String(url), siteUrl).toString()
}

function documentTitle(metadata: Metadata) {
  const { title } = metadata
  if (typeof title === "string") return `${title} — HextaUI`
  if (title && "absolute" in title && title.absolute) return title.absolute
  return siteTitle
}

function firstImage(metadata: Metadata) {
  const images = metadata.openGraph?.images
  const image = Array.isArray(images) ? images[0] : images
  return typeof image === "object" && image && !(image instanceof URL)
    ? (image as Page["image"])
    : undefined
}

function toPage(template: string, path: string, metadata: Metadata): Page {
  const robots = metadata.robots
  return {
    template,
    path,
    locale: path.match(localePattern)?.[1] ?? "en",
    title: documentTitle(metadata),
    description: String(metadata.description ?? siteMetaDescription),
    canonical: resolve(metadata.alternates?.canonical),
    ogUrl: resolve(metadata.openGraph?.url),
    image: firstImage(metadata),
    noindex: typeof robots === "object" && robots?.index === false,
  }
}

async function collectPages() {
  const pages: Page[] = []
  for (const [file, load] of Object.entries(modules)) {
    const template = routeOf(file)
    const page = await load()
    const ownParams = page.generateStaticParams
      ? await page.generateStaticParams()
      : [{}]
    const paramsList = template.includes("[lang]")
      ? translatedLocales.flatMap((lang) =>
          ownParams.map((params) => ({ lang, ...params }))
        )
      : ownParams
    for (const params of paramsList) {
      const metadata = page.generateMetadata
        ? await page.generateMetadata({ params: Promise.resolve(params) })
        : (page.metadata ?? {})
      setRequestLocale("en", "common")
      pages.push(toPage(template, fill(template, params), metadata))
    }
  }
  return pages
}

let pages: Page[] = []

beforeAll(async () => {
  pages = await collectPages()
}, 300_000)

function problems(check: (page: Page) => string | false) {
  return pages.map((page) => check(page)).filter(Boolean)
}

describe("page metadata", () => {
  it("covers every route template", () => {
    const templates = new Set(pages.map((page) => page.template))
    expect(Object.keys(modules).map(routeOf).filter((r) => !templates.has(r)))
      .toEqual([])
    expect(pages.length).toBeGreaterThan(1000)
  })

  it("gives every page a title of at most 60 characters", () => {
    expect(
      problems(
        (page) =>
          (!metadataTitle({ title: page.title }) ||
            (page.locale === "en" && textWidth(page.title) > maxTitleWidth)) &&
          `${page.path}: "${page.title}" (${textWidth(page.title)})`
      )
    ).toEqual([])
  })

  it("never cuts a title short with an ellipsis", () => {
    expect(
      problems(
        (page) => /(\.\.\.|…)$/.test(page.title) && `${page.path}: ${page.title}`
      )
    ).toEqual([])
  })

  it("keeps translated titles within 60 characters where the language allows", () => {
    const long = pages.filter(
      (page) => page.locale !== "en" && textWidth(page.title) > maxTitleWidth
    )
    const translated = pages.filter((page) => page.locale !== "en")
    expect(long.every((page) => !page.title.endsWith("— HextaUI"))).toBe(true)
    expect(translated.length).toBeGreaterThan(1000)
    expect(long.length).toBeLessThanOrEqual(translatedTitleBudget)
  })

  it("gives every page a description of 70 to 160 characters", () => {
    expect(
      problems((page) => {
        const width = textWidth(page.description)
        return (
          (width < minDescriptionWidth ||
            width > maxDescriptionLength ||
            /(\.\.\.|…)$/.test(page.description)) &&
          `${page.path}: ${width} "${page.description}"`
        )
      })
    ).toEqual([])
  })

  it("gives every page an absolute, clean, self-referencing canonical", () => {
    expect(
      problems((page) => {
        if (page.template === "/not-found") return false
        if (!page.canonical) return `${page.path}: no canonical`
        const url = new URL(page.canonical)
        const expected = page.path === "/" ? "/" : page.path
        if (url.origin !== siteUrl) return `${page.path}: ${page.canonical}`
        if (url.search || url.hash) return `${page.path}: ${page.canonical}`
        if (url.pathname !== expected) return `${page.path}: ${page.canonical}`
        if (page.ogUrl !== page.canonical) {
          return `${page.path}: og:url ${page.ogUrl}`
        }
        return false
      })
    ).toEqual([])
  })

  it("gives every page a sized social image that is built", () => {
    const built = new Set(
      getOgPages().map((page) =>
        page.path === "/" ? "/og/index.png" : `/og${page.path}.png`
      )
    )
    built.add(siteDefaultImage)
    expect(
      problems((page) => {
        const image = page.image
        if (!image?.url || !image.width || !image.height || !image.alt) {
          return `${page.path}: incomplete og:image`
        }
        const url = new URL(String(image.url), siteUrl)
        return (
          (url.origin !== siteUrl || !built.has(url.pathname)) &&
          `${page.path}: ${url}`
        )
      })
    ).toEqual([])
  })

  it("marks exactly the private and utility pages noindex", () => {
    expect(
      problems((page) => {
        const expected =
          page.template === "/not-found" ||
          isNoindexPath(page.path) ||
          isUnlistedPath(page.path)
        return page.noindex !== expected && `${page.path}: noindex ${page.noindex}`
      })
    ).toEqual([])
  })

  it("does not repeat a title or description across indexable pages", () => {
    const seen = new Map<string, string>()
    const duplicates: string[] = []
    for (const page of pages.filter((page) => !page.noindex)) {
      for (const value of [`title:${page.title}`, `description:${page.description}`]) {
        const key = `${page.locale}:${value}`
        const first = seen.get(key)
        if (first) duplicates.push(`${page.path} repeats ${first}: ${value}`)
        else seen.set(key, page.path)
      }
    }
    expect(duplicates).toEqual([])
  })
})
