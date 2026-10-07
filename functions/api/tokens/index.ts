import { getAuth } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { isSameOrigin } from "@/lib/origin"
import { findProPurchase, type PaymentsEnv } from "@/lib/payments"
import { createToken, listTokens } from "@/lib/pro/tokens"
import { apiError, sameOriginError, signInError } from "@/lib/api-error"

type Context = {
  request: Request
  env: PaymentsEnv
}

const noStore = { "cache-control": "no-store" }

async function getUserId(env: PaymentsEnv, request: Request) {
  const session = await getAuth(env).api.getSession({
    headers: request.headers,
  })
  return session?.user.id ?? null
}

export async function onRequestGet({ request, env }: Context) {
  const userId = await getUserId(env, request)
  if (!userId) {
    return signInError()
  }
  const tokens = await listTokens(getDb(env.DB), userId)
  return Response.json({ tokens }, { headers: noStore })
}

export async function onRequestPost({ request, env }: Context) {
  if (!isSameOrigin(request, env.BETTER_AUTH_URL)) {
    return sameOriginError()
  }
  const userId = await getUserId(env, request)
  if (!userId) {
    return signInError()
  }

  const db = getDb(env.DB)
  if (!(await findProPurchase(db, userId))) {
    return apiError("pro_required", {
      error: "Tokens need Pro",
      detail: "API tokens are only available to HextaUI Pro accounts.",
      resolution:
        "Buy HextaUI Pro at https://hextaui.com/account, then create a token.",
    })
  }
  if ((await listTokens(db, userId)).length >= 10) {
    return apiError("token_limit", {
      error: "Delete a token before creating another",
      detail: "An account can hold at most 10 API tokens.",
      resolution:
        "Delete an unused token with DELETE /api/tokens/{id}, then try again.",
    })
  }

  const body = (await request.json().catch(() => ({}))) as { name?: unknown }
  const name =
    typeof body.name === "string" && body.name.trim()
      ? body.name.trim().slice(0, 60)
      : "CLI"

  const token = await createToken(db, userId, name)
  return Response.json(token, { status: 201, headers: noStore })
}
