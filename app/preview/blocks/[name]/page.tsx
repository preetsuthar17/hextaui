import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BlockPreview } from "@/components/blocks/block-preview"
import { BlockPreviewBack } from "@/components/blocks/block-preview-back"
import { getProBlock, proBlockParams } from "@/lib/pro/catalog"

export const dynamicParams = false

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export function generateStaticParams() {
  return proBlockParams()
}

export default async function Page({
  params,
}: PageProps<"/preview/blocks/[name]">) {
  const { name } = await params
  const block = getProBlock(name)
  if (!block) notFound()
  return (
    <div data-block-preview="">
      <BlockPreviewBack name={name} title={block.title} />
      <BlockPreview name={name} />
    </div>
  )
}
