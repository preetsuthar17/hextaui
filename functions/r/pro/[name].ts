import type { PaymentsEnv } from "@/lib/payments"
import { accessError, getAccess } from "@/lib/pro/access"
import { getProItem } from "@/lib/pro/server"

type Context = {
  request: Request
  env: PaymentsEnv
  params: { name: string }
}

export async function onRequestGet({ request, env, params }: Context) {
  const item = getProItem(params.name.replace(/\.json$/, ""))
  if (!item) return Response.json({ error: "Not found" }, { status: 404 })

  const denied = accessError(await getAccess(env, request))
  if (denied) return denied

  return Response.json(item.registry, {
    headers: { "cache-control": "private, no-store" },
  })
}
