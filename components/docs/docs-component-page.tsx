import * as React from "react"

import { DocsGlance } from "@/components/docs/docs-glance"
import { DocsPage } from "@/components/docs/docs-page"
import { DocsProBlocksNote } from "@/components/docs/docs-pro-blocks-note"
import { DocsRelated } from "@/components/docs/docs-related"
import { JsonLd } from "@/components/site/json-ld"
import { TrackedLink } from "@/components/site/tracked-link"
import { Badge } from "@/components/ui/badge"
import {
  docsComponents,
  getDocsComponent,
  isUiSdkEntry,
  uiSdkVersion,
} from "@/lib/docs"
import {
  getProBlocksUsing,
  getRelatedBlocks,
  getRelatedDocs,
} from "@/lib/docs-related"
import { T, t } from "@/lib/i18n/rich"
import { ogImagePath } from "@/lib/metadata"
import { docsArticleJsonLd } from "@/lib/structured-data"

function DocsComponentPage({
  slug,
  children,
}: {
  slug: string
  children: React.ReactNode
}) {
  const component = getDocsComponent(slug)
  const path = `/docs/${component.slug}`
  const isComponent = docsComponents.some((item) => item.slug === slug)
  const isUiSdk = isUiSdkEntry(slug)

  return (
    <DocsPage
      href={path}
      title={component.name}
      description={component.description}
      markdownHref={`/docs/${component.slug}.md`}
      registryHref={`/r/${component.slug}.json`}
      eyebrow={
        isUiSdk ? (
          <p
            data-slot="docs-ui-sdk-note"
            className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
          >
            <Badge variant="warning">{t("Beta")}</Badge>
            <span>
              {t("Built on Vercel’s UI SDK {version}. Its API may change.", {
                version: uiSdkVersion,
              })}
            </span>
          </p>
        ) : undefined
      }
      note={
        <>
          <DocsGlance slug={component.slug} />
          <DocsProBlocksNote links={getProBlocksUsing(component.slug)} />
        </>
      }
    >
      <JsonLd
        data={docsArticleJsonLd({
          path,
          headline: component.name,
          description: component.description,
          image: ogImagePath(path),
          breadcrumbs: [
            { name: "Docs", path: "/docs" },
            ...(isComponent
              ? [{ name: "Components", path: "/components" }]
              : []),
            { name: component.name, path },
          ],
          code: {
            name: component.name,
            free: true,
            license: "https://opensource.org/licenses/MIT",
          },
        })}
      />
      {children}
      <DocsRelated title="Related" links={getRelatedDocs(component.slug)} />
      <DocsRelated
        title="Used in Pro blocks"
        description={t("Blocks that build on {name}.", {
          name: component.name,
        })}
        links={getRelatedBlocks(component.slug).slice(0, 4)}
        variant="previews"
        event={{ name: "Pro link clicked", from: "component-related" }}
      >
        <p className="text-sm text-pretty text-muted-foreground">
          <T>
            Every block comes with{" "}
            <TrackedLink
              href="/pricing"
              event="Pro link clicked"
              eventProps={{ from: "component-related", to: "/pricing" }}
              className="text-foreground underline underline-offset-4"
            >
              HextaUI Pro
            </TrackedLink>
            , and Prompt Input is free.
          </T>
        </p>
      </DocsRelated>
    </DocsPage>
  )
}

export { DocsComponentPage }
