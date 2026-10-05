import { notFound } from "next/navigation"

import { getMcpEntry, mcpEntrySlugs } from "@/lib/mcp-data"

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return mcpEntrySlugs.map((slug) => ({ file: `${slug}.json` }))
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/mcp/docs/[file]">
) {
  const { file } = await params
  const slug = file.replace(/\.json$/, "")

  if (!file.endsWith(".json") || !mcpEntrySlugs.includes(slug)) {
    notFound()
  }

  return Response.json(await getMcpEntry(slug))
}
