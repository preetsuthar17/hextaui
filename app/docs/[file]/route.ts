import { notFound } from "next/navigation"

import { docsMarkdownPages, getDocsMarkdown } from "@/lib/docs-markdown"

export const dynamic = "force-static"
export const dynamicParams = false

const slugs = docsMarkdownPages.filter((slug) => slug !== "")

export function generateStaticParams() {
  return slugs.map((slug) => ({ file: `${slug}.md` }))
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/docs/[file]">
) {
  const { file } = await params
  const slug = file.replace(/\.md$/, "")

  if (!file.endsWith(".md") || !slugs.includes(slug)) {
    notFound()
  }

  return new Response(await getDocsMarkdown(slug), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
