import { getAuth } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { isSameOrigin } from "@/lib/origin"
import type { PaymentsEnv } from "@/lib/payments"
import { findOwnedTeam, removeMember } from "@/lib/pro/team"
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

  const db = getDb(env.DB)
  const team = await findOwnedTeam(db, session.user.id)
  const removed = team ? await removeMember(db, team.id, params.id) : false
  return removed
    ? new Response(null, { status: 204 })
    : apiError("not_found", {
        error: "Not found",
        detail: `No teammate with id ${params.id} is on a team this account owns.`,
        resolution:
          "List your teammates with GET /api/team and use one of their ids.",
      })
}
