import { getDocsSearchIndex } from "@/lib/docs-search"

export const dynamic = "force-static"

export async function GET() {
  return Response.json(await getDocsSearchIndex())
}
