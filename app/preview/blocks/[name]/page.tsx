import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BlockPreview } from "@/components/blocks/block-preview"
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
  if (!getProBlock(name)) notFound()
  return <BlockPreview name={name} />
}
