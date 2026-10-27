import { getProSections } from "@/lib/page-builder/pro"
import { pageRegistryResponse } from "@/lib/page-builder/registry-response"

type Context = { params: { id: string } }

export async function onRequestGet({ params }: Context) {
  return pageRegistryResponse(params.id, getProSections())
}
