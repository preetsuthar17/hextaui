import { getSkillMarkdown } from "@/lib/agent-content"

export const dynamic = "force-static"

export function GET() {
  return new Response(getSkillMarkdown(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
