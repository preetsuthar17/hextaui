import { getDocsMarkdown } from "@/lib/docs-markdown"

export const dynamic = "force-static"

export async function GET() {
  return new Response(await getDocsMarkdown(""), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
