import { getAuth } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { isSameOrigin } from "@/lib/origin"
import type { PaymentsEnv } from "@/lib/payments"
import { deleteToken } from "@/lib/pro/tokens"
import { apiError, sameOriginError, signInError } from "@/lib/api-error"

type Context = {
  request: Request
  env: PaymentsEnv
  params: { id: string }
}

export async function onRequestDelete({ request, env, params }: Context) {
  if (!isSameOrigin(request, env.BETTER_AUTH_URL)) {
    return sameOriginError()
  }
  const session = await getAuth(env).api.getSession({
    headers: request.headers,
  })
  if (!session) {
    return signInError()
  }

  const deleted = await deleteToken(getDb(env.DB), session.user.id, params.id)
  return deleted
    ? new Response(null, { status: 204 })
    : apiError("not_found", {
        error: "Not found",
        detail: `No API token with id ${params.id} belongs to this account.`,
        resolution:
          "List your tokens with GET /api/tokens and use one of their ids.",
      })
}
