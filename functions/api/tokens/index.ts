import { getAuth } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { isSameOrigin } from "@/lib/origin"
import { findProPurchase, type PaymentsEnv } from "@/lib/payments"
import { createToken, listTokens } from "@/lib/pro/tokens"

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
    return Response.json({ error: "Sign in first" }, { status: 401 })
  }
  const tokens = await listTokens(getDb(env.DB), userId)
  return Response.json({ tokens }, { headers: noStore })
}

export async function onRequestPost({ request, env }: Context) {
  if (!isSameOrigin(request, env.BETTER_AUTH_URL)) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }
  const userId = await getUserId(env, request)
  if (!userId) {
    return Response.json({ error: "Sign in first" }, { status: 401 })
  }

  const db = getDb(env.DB)
  if (!(await findProPurchase(db, userId))) {
    return Response.json({ error: "Tokens need Pro" }, { status: 403 })
  }
  if ((await listTokens(db, userId)).length >= 10) {
    return Response.json(
      { error: "Delete a token before creating another" },
      { status: 400 }
    )
  }

  const body = (await request.json().catch(() => ({}))) as { name?: unknown }
  const name =
    typeof body.name === "string" && body.name.trim()
      ? body.name.trim().slice(0, 60)
      : "CLI"

  const token = await createToken(db, userId, name)
  return Response.json(token, { status: 201, headers: noStore })
}
