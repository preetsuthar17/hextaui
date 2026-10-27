import type { Metadata } from "next"

import Link from "@/components/site/link"
import { CatalogGrid, CatalogList } from "@/components/site/catalog-card"
import { CatalogBody, CatalogHeader } from "@/components/site/catalog-header"
import { CatalogViewToggle } from "@/components/site/catalog-view"
import { ComponentCard } from "@/components/site/component-card"
import { JsonLd } from "@/components/site/json-ld"
import {
  componentCategories,
  getComponentCategoryHref,
} from "@/lib/component-categories"
import { docsComponents as components } from "@/lib/docs"
import { T, t } from "@/lib/i18n/rich"
import { clampDescription, pageMetadata } from "@/lib/metadata"
import { pageJsonLd } from "@/lib/structured-data"

const title = "React UI components for shadcn/ui"

const description = `${components.length} free, open-source React components for shadcn/ui on Base UI and Tailwind CSS, from inputs and dialogs to data tables, date pickers and chat. Live previews of each.`

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/components",
  aiSummary: `The catalog of all ${components.length} free HextaUI components, grouped into categories, each linking to its docs page with installation, examples and API reference.`,
})

const categoryLinkClassName =
  "inline-flex h-8 items-center rounded-full px-3 text-sm font-medium whitespace-nowrap text-muted-foreground inset-ring-(length:--hairline) inset-ring-border transition-colors duration-150 ease-out-cubic outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden motion-reduce:transition-none forced-colors:border"

export default function Page() {
  return (
    <main className="flex flex-1 flex-col">
      <JsonLd
        data={pageJsonLd({
          path: "/components",
          name: title,
          description: clampDescription(description),
          breadcrumbs: [{ name: "Components", path: "/components" }],
          type: "CollectionPage",
          items: components.map((component) => ({
            name: component.name,
            path: `/docs/${component.slug}`,
          })),
        })}
      />
      <CatalogHeader
        eyebrow={t("Open source")}
        title={t("Components")}
        lede={
          <p>
            <T>
              {components.length} components. Open one to see every state live.
            </T>
          </p>
        }
        action={<CatalogViewToggle />}
      >
        <nav aria-labelledby="component-categories" className="mt-8">
          <h2 id="component-categories" className="sr-only">
            {t("Browse by category")}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {componentCategories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={getComponentCategoryHref(category.slug)}
                  className={categoryLinkClassName}
                >
                  {t(category.name)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </CatalogHeader>
      <CatalogBody className="flex flex-col gap-10">
        <CatalogGrid className="in-data-[catalog-view=single]:mx-auto in-data-[catalog-view=single]:w-full in-data-[catalog-view=single]:max-w-3xl">
          {components.map((component) => (
            <ComponentCard
              key={component.slug}
              slug={component.slug}
              name={component.name}
            />
          ))}
        </CatalogGrid>
        <CatalogList
          items={components.map((component) => ({
            href: `/docs/${component.slug}`,
            title: component.name,
          }))}
        />
      </CatalogBody>
    </main>
  )
}
