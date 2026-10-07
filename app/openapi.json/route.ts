import { getOpenApiDocument } from "@/lib/openapi"

export const dynamic = "force-static"

export function GET() {
  return Response.json(getOpenApiDocument())
}
