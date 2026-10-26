import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { JsonLd } from "@/components/site/json-ld"
import {
  blogAuthor,
  blogDescription,
  blogPosts,
  blogTitle,
  getBlogHref,
  getBlogImageHref,
} from "@/lib/blog"
import { docsComponents, getDocsComponent } from "@/lib/docs"
import { ogImagePath } from "@/lib/metadata"
import { getProProductJsonLd, pricingQuestions } from "@/lib/pricing-info"
import { proBlocks } from "@/lib/pro/catalog"
import {
  blogJsonLd,
  blogPostingJsonLd,
  docsArticleJsonLd,
  faqPageJsonLd,
  pageJsonLd,
  siteJsonLd,
} from "@/lib/structured-data"

type Node = Record<string, unknown>

const required: Record<string, string[]> = {
  WebSite: ["name", "url", "publisher"],
  Organization: ["name", "url", "logo", "sameAs", "contactPoint"],
  Person: ["name", "url"],
  BreadcrumbList: ["itemListElement"],
  ItemList: ["itemListElement", "numberOfItems"],
  WebPage: ["name", "description", "url", "breadcrumb"],
  CollectionPage: ["name", "description", "url", "breadcrumb", "mainEntity"],
  AboutPage: ["name", "url"],
  Blog: ["name", "url", "publisher"],
  TechArticle: [
    "headline",
    "description",
    "url",
    "image",
    "author",
    "publisher",
  ],
  BlogPosting: [
    "headline",
    "description",
    "url",
    "image",
    "author",
    "publisher",
    "datePublished",
    "dateModified",
  ],
  FAQPage: ["mainEntity"],
  Question: ["name", "acceptedAnswer"],
  Answer: ["text"],
  Product: ["name", "description", "image", "offers"],
  Offer: ["price", "priceCurrency", "availability", "url"],
  SoftwareSourceCode: ["name", "codeRepository", "license"],
}

const urlKeys = new Set([
  "@id",
  "url",
  "item",
  "image",
  "logo",
  "sameAs",
  "mainEntityOfPage",
  "codeRepository",
  "license",
  "documentation",
  "isBasedOn",
  "merchantReturnLink",
  "availability",
  "returnPolicyCategory",
])

const dateKeys = new Set(["datePublished", "dateModified", "priceValidUntil"])

function parse(data: object) {
  const html = renderToStaticMarkup(<JsonLd data={data} />)
  const json = html
    .replace('<script type="application/ld+json">', "")
    .replace("</script>", "")
  return JSON.parse(json) as Node
}

function nodes(value: unknown): Node[] {
  if (Array.isArray(value)) return value.flatMap(nodes)
  if (!value || typeof value !== "object") return []
  const node = value as Node
  return [
    ...("@type" in node ? [node] : []),
    ...Object.values(node).flatMap(nodes),
  ]
}

function types(node: Node) {
  return ([] as unknown[]).concat(node["@type"]).map(String)
}

function problems(value: unknown, key = "", found: string[] = []) {
  if (value === undefined || value === null) {
    found.push(`${key} is ${String(value)}`)
  } else if (Array.isArray(value)) {
    value.forEach((item) => problems(item, key, found))
  } else if (typeof value === "object") {
    for (const [name, child] of Object.entries(value)) {
      problems(child, name, found)
    }
  } else if (typeof value === "string") {
    if (urlKeys.has(key) && !/^https:\/\/[^\s/]+\.[^\s]+$/.test(value)) {
      found.push(`${key} is not an absolute URL: ${value}`)
    }
    if (dateKeys.has(key) && Number.isNaN(Date.parse(value))) {
      found.push(`${key} is not an ISO 8601 date: ${value}`)
    }
    if (dateKeys.has(key) && !/^\d{4}-\d{2}-\d{2}/.test(value)) {
      found.push(`${key} is not an ISO 8601 date: ${value}`)
    }
  }
  return found
}

function expectValid(data: object, expected: string[]) {
  const parsed = parse(data)
  expect(parsed["@context"]).toBe("https://schema.org")
  expect(problems(parsed)).toEqual([])

  const all = nodes(parsed)
  const emitted = new Set(all.flatMap(types))
  for (const type of expected) expect(emitted).toContain(type)

  for (const node of all) {
    for (const type of types(node)) {
      for (const field of required[type] ?? []) {
        expect(node[field], `${type}.${field}`).toBeDefined()
      }
      if (type === "ListItem") {
        expect(node.position).toEqual(expect.any(Number))
        expect(node.name).toEqual(expect.any(String))
        expect(node.item ?? node.url).toEqual(expect.any(String))
      }
      if (type === "Offer") {
        expect(node.price).toEqual(expect.any(Number))
      }
    }
  }

  for (const list of all.filter((node) => types(node).includes("ItemList"))) {
    const items = list.itemListElement as Node[]
    expect(items.map((item) => item.position)).toEqual(
      items.map((_, index) => index + 1)
    )
  }

  return parsed
}

const block = proBlocks[0]
const docs = getDocsComponent("button")
const post = blogPosts[0]

describe("structured data", () => {
  it("defines the organization and website once for every page", () => {
    const data = expectValid(siteJsonLd(), [
      "WebSite",
      "Organization",
      "Person",
      "SoftwareSourceCode",
    ])
    const ids = nodes(data).map((node) => node["@id"])
    expect(ids).toContain("https://hextaui.com/#organization")
    expect(ids).toContain("https://hextaui.com/#website")
  })

  it("marks up a blog post as a BlogPosting by a Person", () => {
    const path = getBlogHref(post.slug)
    const data = expectValid(
      blogPostingJsonLd({
        path,
        headline: post.title,
        description: post.description,
        published: post.published,
        tags: post.tags,
        words: 1000,
        minutes: 5,
        image: getBlogImageHref(post.slug),
        author: blogAuthor,
      }),
      ["BreadcrumbList", "BlogPosting", "Person"]
    )
    const article = nodes(data).find((node) =>
      types(node).includes("BlogPosting")
    )
    expect(article?.headline).toBe(post.title)
    expect(article?.publisher).toEqual({
      "@id": "https://hextaui.com/#organization",
    })
  })

  it("lists the posts on the blog index", () => {
    const data = expectValid(
      blogJsonLd(
        blogTitle,
        blogDescription,
        blogPosts.map((item) => ({
          path: getBlogHref(item.slug),
          headline: item.title,
        }))
      ),
      ["BreadcrumbList", "CollectionPage", "ItemList", "Blog"]
    )
    const list = nodes(data).find((node) => types(node).includes("ItemList"))
    expect(list?.numberOfItems).toBe(blogPosts.length)
  })

  it("marks up a docs page as a TechArticle about source code", () => {
    const path = `/docs/${docs.slug}`
    expectValid(
      docsArticleJsonLd({
        path,
        headline: docs.name,
        description: docs.description,
        image: ogImagePath(path),
        breadcrumbs: [
          { name: "Docs", path: "/docs" },
          { name: "Components", path: "/components" },
          { name: docs.name, path },
        ],
        code: {
          name: docs.name,
          free: true,
          license: "https://opensource.org/licenses/MIT",
        },
      }),
      ["BreadcrumbList", "TechArticle", "SoftwareSourceCode", "Person"]
    )
  })

  it("marks up a block page without a price", () => {
    const path = `/blocks/${block.name}`
    const data = expectValid(
      docsArticleJsonLd({
        path,
        headline: block.title,
        description: block.description,
        image: ogImagePath(path),
        breadcrumbs: [
          { name: "Blocks", path: "/blocks" },
          { name: block.title, path },
        ],
        code: {
          name: `${block.title} block`,
          free: Boolean(block.free),
          license: "https://hextaui.com/legal/license",
        },
      }),
      ["BreadcrumbList", "TechArticle"]
    )
    expect(JSON.stringify(data)).not.toContain('"offers"')
  })

  it("marks up pricing with real offers and the visible FAQ", () => {
    const data = expectValid(
      pageJsonLd({
        path: "/pricing",
        name: "Pricing",
        description: "Pricing for HextaUI Pro.",
        breadcrumbs: [{ name: "Pricing", path: "/pricing" }],
        extra: [
          getProProductJsonLd(),
          faqPageJsonLd("/pricing", pricingQuestions),
        ],
      }),
      ["BreadcrumbList", "WebPage", "Product", "Offer", "FAQPage"]
    )
    const faq = nodes(data).find((node) => types(node).includes("FAQPage"))
    expect(
      (faq?.mainEntity as Node[]).map((question) => ({
        question: question.name,
        answer: (question.acceptedAnswer as Node).text,
      }))
    ).toEqual(pricingQuestions)
    expect(JSON.stringify(data)).not.toMatch(/aggregateRating|"review"/)
  })

  it("marks up a category page as a CollectionPage with an ItemList", () => {
    const items = docsComponents.map((item) => ({
      name: item.name,
      path: `/docs/${item.slug}`,
    }))
    const data = expectValid(
      pageJsonLd({
        path: "/components",
        name: "Components",
        description: "Every HextaUI component.",
        breadcrumbs: [{ name: "Components", path: "/components" }],
        type: "CollectionPage",
        items,
      }),
      ["BreadcrumbList", "CollectionPage", "ItemList"]
    )
    const list = nodes(data).find((node) => types(node).includes("ItemList"))
    expect(list?.numberOfItems).toBe(items.length)
  })

  it("marks up an about page", () => {
    expectValid(
      pageJsonLd({
        path: "/about",
        name: "About HextaUI",
        description: "Who makes HextaUI.",
        breadcrumbs: [{ name: "About", path: "/about" }],
        type: "AboutPage",
      }),
      ["BreadcrumbList", "AboutPage"]
    )
  })

  it("escapes < so a value cannot close the script tag", () => {
    const html = renderToStaticMarkup(
      <JsonLd data={{ name: "</script><script>alert(1)</script>" }} />
    )
    expect(html.match(/<\/script>/g)).toHaveLength(1)
    expect(html).toContain("\\u003c/script>")
  })
})
