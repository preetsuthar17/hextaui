import { getPricingMarkdown } from "@/lib/pricing-info"

export const dynamic = "force-static"

export function GET() {
  return new Response(getPricingMarkdown(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
