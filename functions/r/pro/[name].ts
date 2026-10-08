import type { PaymentsEnv } from "@/lib/payments"
import { accessError, getAccess } from "@/lib/pro/access"
import { getProItem } from "@/lib/pro/server"
import { apiError } from "@/lib/api-error"

type Context = {
  request: Request
  env: PaymentsEnv
  params: { name: string }
}

export async function onRequestGet({ request, env, params }: Context) {
  const name = params.name.replace(/\.json$/, "")
  const item = getProItem(name)
  if (!item) {
    return apiError("not_found", {
      error: "Not found",
      detail: `No HextaUI Pro registry item is named ${name}.`,
      resolution: "See https://hextaui.com/blocks for every Pro block name.",
    })
  }

  if (!item.free) {
    const denied = accessError(await getAccess(env, request))
    if (denied) return denied
  }

  return Response.json(item.registry, {
    headers: {
      "cache-control": item.free ? "public, max-age=300" : "private, no-store",
    },
  })
}
