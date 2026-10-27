import { getRobotsTxt } from "@/lib/robots"

export const dynamic = "force-static"

export function GET() {
  return new Response(getRobotsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
