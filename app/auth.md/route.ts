import { getAuthMarkdown } from "@/lib/agent-content"

export const dynamic = "force-static"

export function GET() {
  return new Response(getAuthMarkdown(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
