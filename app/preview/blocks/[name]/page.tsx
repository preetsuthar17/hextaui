import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BlockPreview } from "@/components/blocks/block-preview"
import { BlockPreviewBack } from "@/components/blocks/block-preview-back"
import { PreviewDocument } from "@/components/blocks/preview-document"
import { getProBlock, proBlockParams } from "@/lib/pro/catalog"
import { pageMetadata } from "@/lib/metadata"

export const dynamicParams = false

export function generateStaticParams() {
  return proBlockParams()
}

export async function generateMetadata({
  params,
}: PageProps<"/preview/blocks/[name]">): Promise<Metadata> {
  const block = getProBlock((await params).name)
  if (!block) return {}
  return {
    ...pageMetadata({
      title: `${block.title} preview`,
      description: `A full-screen live preview of the ${block.title} block, as embedded in the HextaUI docs.`,
      path: `/preview/blocks/${block.name}`,
      noindex: true,
    }),
    robots: { index: false, follow: false, indexifembedded: true },
  }
}

export default async function Page({
  params,
}: PageProps<"/preview/blocks/[name]">) {
  const { name } = await params
  const block = getProBlock(name)
  if (!block) notFound()
  return (
    <div
      data-block-preview=""
      data-layout={block.layout}
      className="data-[layout=app]:flex data-[layout=app]:h-svh data-[layout=app]:flex-col"
    >
      <PreviewDocument />
      <BlockPreviewBack
        name={name}
        title={block.title}
        docked={block.layout === "app"}
      />
      <div className="contents in-data-[layout=app]:block in-data-[layout=app]:min-h-0 in-data-[layout=app]:flex-1">
        <BlockPreview name={name} />
      </div>
    </div>
  )
}
