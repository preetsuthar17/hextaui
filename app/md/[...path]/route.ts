import { notFound } from "next/navigation"

import { listMarkdownRoutes } from "@/lib/md/registry"
import { renderCached } from "@/lib/md/llms"
import { htmlPathFor, markdownPathFor } from "@/lib/md/routes"

export const dynamic = "force-static"
export const dynamicParams = false

export async function generateStaticParams() {
  return (await listMarkdownRoutes()).map((route) => ({
    path: markdownPathFor(route.path).slice(1).split("/"),
  }))
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/md/[...path]">
) {
  const { path } = await params
  const markdown = await renderCached(htmlPathFor(`/${path.join("/")}`))
  if (!markdown) notFound()

  return new Response(markdown, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
