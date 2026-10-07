import { getNotFoundMarkdown } from "@/lib/agent-content"

export const dynamic = "force-static"

export function GET() {
  return new Response(getNotFoundMarkdown(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
