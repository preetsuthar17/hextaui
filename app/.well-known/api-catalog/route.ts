import { getApiCatalog } from "@/lib/agent-manifests"

export const dynamic = "force-static"

export function GET() {
  return Response.json(getApiCatalog())
}
