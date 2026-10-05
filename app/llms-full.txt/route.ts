import { getLlmsFull } from "@/lib/docs-markdown"

export const dynamic = "force-static"

export async function GET() {
  return new Response(await getLlmsFull(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
