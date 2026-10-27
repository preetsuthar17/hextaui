import { getAiTxt } from "@/lib/ai-txt"

export const dynamic = "force-static"

export function GET() {
  return new Response(getAiTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
