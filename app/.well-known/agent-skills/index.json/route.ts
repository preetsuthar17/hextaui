import { getSkillMarkdown } from "@/lib/agent-content"
import { getAgentSkillsIndex } from "@/lib/agent-manifests"

export const dynamic = "force-static"

export async function GET() {
  return Response.json(await getAgentSkillsIndex(getSkillMarkdown()))
}
