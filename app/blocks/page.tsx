import type { Metadata } from "next"

import { JsonLd } from "@/components/site/json-ld"
import Link from "@/components/site/link"

import { BlocksCatalog } from "@/components/site/blocks-catalog"
import { CatalogBody, CatalogHeader } from "@/components/site/catalog-header"
import { CatalogViewToggle } from "@/components/site/catalog-view"
import { blockSections, proBlocks } from "@/lib/pro/catalog"
import { T, t } from "@/lib/i18n/rich"
import { metadataTitle, pageMetadata } from "@/lib/metadata"
import { pageJsonLd } from "@/lib/structured-data"

export const metadata: Metadata = pageMetadata({
  title: "React blocks for AI products, built on shadcn/ui",
  description:
    "Drop-in shadcn/ui blocks that ship your AI app’s chat UI in days, with streaming, tool calls, reasoning and voice done. Part of HextaUI Pro, Prompt Input free.",
  path: "/blocks",
})

export default function Page() {
  return (
    <main className="flex flex-1 flex-col">
      <JsonLd
        data={pageJsonLd({
          path: "/blocks",
          name: metadataTitle(metadata),
          description: String(metadata.description),
          breadcrumbs: [{ name: "Blocks", path: "/blocks" }],
          type: "CollectionPage",
          items: proBlocks.map((block) => ({
            name: block.title,
            path: `/blocks/${block.name}`,
          })),
        })}
      />
      <CatalogHeader
        eyebrow={t("HextaUI Pro")}
        title={t("Blocks")}
        lede={
          <p>
            <T>
              {proBlocks.length > 0
                ? `${proBlocks.length} ${proBlocks.length === 1 ? "block" : "blocks"}, with more on the way. `
                : "The first blocks are on the way. "}
              Every block is part of{" "}
              <Link
                href="/pricing"
                className="text-foreground underline underline-offset-4"
              >
                HextaUI Pro
              </Link>
              , and{" "}
              <Link
                href="/blocks/prompt-input"
                className="text-foreground underline underline-offset-4"
              >
                Prompt Input
              </Link>{" "}
              is free.
            </T>
          </p>
        }
        action={proBlocks.length > 0 ? <CatalogViewToggle /> : null}
      />
      {proBlocks.length > 0 ? (
        <CatalogBody className="flex flex-col gap-10">
          <BlocksCatalog
            sections={blockSections.map((section) => ({
              category: section.category,
              title: t(section.title),
              blocks: section.blocks.map((block) => ({
                name: block.name,
                title: block.title,
                description: block.description,
                category: block.category,
                free: block.free,
              })),
            }))}
          />
        </CatalogBody>
      ) : null}
    </main>
  )
}
