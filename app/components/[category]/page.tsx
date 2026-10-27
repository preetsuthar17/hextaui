import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DocsBreadcrumbs } from "@/components/docs/docs-breadcrumbs"
import { DocsRelated } from "@/components/docs/docs-related"
import { CatalogGrid } from "@/components/site/catalog-card"
import { CatalogBody, CatalogHeader } from "@/components/site/catalog-header"
import { ComponentCard } from "@/components/site/component-card"
import { JsonLd } from "@/components/site/json-ld"
import {
  getCategoryList,
  getCategoryListSummary,
  getCategoryListTitle,
} from "@/lib/category-lists"
import {
  componentCategories,
  getComponentCategoryHref,
} from "@/lib/component-categories"
import { getProBlocksUsing } from "@/lib/docs-related"
import { getRequestLocale } from "@/lib/i18n/request"
import { t } from "@/lib/i18n/rich"
import { markTranslated } from "@/lib/i18n/translated"
import { ogImagePath, pageMetadata } from "@/lib/metadata"
import { pageJsonLd } from "@/lib/structured-data"

export const dynamicParams = false

export function generateStaticParams() {
  return componentCategories.map((category) => ({ category: category.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<"/components/[category]">): Promise<Metadata> {
  const list = getCategoryList((await params).category)
  if (!list) return {}

  return pageMetadata({
    title: getCategoryListTitle(list),
    description: markTranslated(
      [getCategoryListSummary(list), t(list.category.description)].join(
        getRequestLocale().locale === "ja" ? "" : " "
      )
    ),
    path: getComponentCategoryHref(list.category.slug),
  })
}

export default async function Page({
  params,
}: PageProps<"/components/[category]">) {
  const list = getCategoryList((await params).category)
  if (!list) notFound()
  const { category, components } = list
  const path = getComponentCategoryHref(category.slug)
  const title = getCategoryListTitle(list)
  const summary = getCategoryListSummary(list)
  const blocks = [
    ...new Map(
      components
        .flatMap((component) => getProBlocksUsing(component.slug))
        .map((block) => [block.href, block])
    ).values(),
  ].slice(0, 6)
  const crumbs = [
    { name: "Components", path: "/components" },
    { name: category.name, path },
  ]

  return (
    <main className="flex flex-1 flex-col">
      <JsonLd
        data={pageJsonLd({
          path,
          name: title,
          description: summary,
          breadcrumbs: crumbs,
          type: "CollectionPage",
          image: ogImagePath(getComponentCategoryHref(category.slug)),
          items: components.map((component) => ({
            name: component.name,
            path: `/docs/${component.slug}`,
          })),
        })}
      />
      <CatalogHeader
        breadcrumbs={<DocsBreadcrumbs crumbs={crumbs} />}
        title={t(category.name)}
        lede={[
          <p key="summary">{summary}</p>,
          ...category.intro.map((paragraph) => (
            <p key={paragraph}>{t(paragraph)}</p>
          )),
        ]}
      />
      <CatalogBody>
        <CatalogGrid>
          {components.map((component) => (
            <ComponentCard
              key={component.slug}
              slug={component.slug}
              name={component.name}
            />
          ))}
        </CatalogGrid>
        <div className="max-w-3xl">
          <DocsRelated
            title="What each one does"
            links={components.map((component) => ({
              href: `/docs/${component.slug}`,
              title: component.name,
              description: component.description,
            }))}
          />
          <DocsRelated
            title="Built into Pro blocks"
            description="Blocks for AI products that are built from these components."
            links={blocks}
            event={{ name: "Pro link clicked", from: "component-category" }}
          />
          <DocsRelated
            title="Other categories"
            variant="names"
            links={componentCategories
              .filter((item) => item.slug !== category.slug)
              .map((item) => ({
                href: getComponentCategoryHref(item.slug),
                title: t(item.name),
                description: item.description,
              }))}
          />
        </div>
      </CatalogBody>
    </main>
  )
}
