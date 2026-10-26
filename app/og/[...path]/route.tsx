import { notFound } from "next/navigation"

import { ogImagePath } from "@/lib/metadata"
import { getOgPages } from "@/lib/og-pages"
import { renderOgImage } from "@/lib/opengraph-image"

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return getOgPages().map((page) => ({
    path: ogImagePath(page.path).slice("/og/".length).split("/"),
  }))
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/og/[...path]">
) {
  const { path } = await params
  const href = `/og/${path.join("/")}`
  const page = getOgPages().find((item) => ogImagePath(item.path) === href)
  if (!page) notFound()

  return renderOgImage(page.image)
}
