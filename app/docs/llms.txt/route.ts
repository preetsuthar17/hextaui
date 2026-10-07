import { getDocsLlms } from "@/lib/docs-markdown"

export const dynamic = "force-static"

export function GET() {
  return new Response(getDocsLlms(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
