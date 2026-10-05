import { getMcpIndex } from "@/lib/mcp-data"

export const dynamic = "force-static"

export async function GET() {
  return Response.json(await getMcpIndex())
}
