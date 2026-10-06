import { getAuth } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { isSameOrigin } from "@/lib/origin"
import type { PaymentsEnv } from "@/lib/payments"
import { deleteToken } from "@/lib/pro/tokens"

type Context = {
  request: Request
  env: PaymentsEnv
  params: { id: string }
}

export async function onRequestDelete({ request, env, params }: Context) {
  if (!isSameOrigin(request, env.BETTER_AUTH_URL)) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }
  const session = await getAuth(env).api.getSession({
    headers: request.headers,
  })
  if (!session) {
    return Response.json({ error: "Sign in first" }, { status: 401 })
  }

  const deleted = await deleteToken(getDb(env.DB), session.user.id, params.id)
  return deleted
    ? new Response(null, { status: 204 })
    : Response.json({ error: "Not found" }, { status: 404 })
}
