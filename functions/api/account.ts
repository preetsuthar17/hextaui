import { getAuth } from "@/lib/auth"
import { eq } from "drizzle-orm"

import { getDb, schema } from "@/lib/db"
import { confirmPayment, findProAccess, type PaymentsEnv } from "@/lib/payments"
import { isSameOrigin } from "@/lib/origin"
import { apiError, sameOriginError, signInError } from "@/lib/api-error"

type Context = {
  request: Request
  env: PaymentsEnv
}

export async function onRequestGet({ request, env }: Context) {
  const session = await getAuth(env).api.getSession({
    headers: request.headers,
  })
  if (!session) {
    return signInError()
  }

  const db = getDb(env.DB)
  const userId = session.user.id
  let access = await findProAccess(db, userId)

  const paymentId = new URL(request.url).searchParams.get("payment_id")
  if (paymentId?.startsWith("pay_") && access?.purchase.id !== paymentId) {
    await confirmPayment(env, db, paymentId, userId)
    access = await findProAccess(db, userId)
  }

  const [accounts, [profile]] = await Promise.all([
    db
      .select({ providerId: schema.account.providerId })
      .from(schema.account)
      .where(eq(schema.account.userId, userId)),
    db
      .select({ unsubscribedAt: schema.user.unsubscribedAt })
      .from(schema.user)
      .where(eq(schema.user.id, userId)),
  ])

  return Response.json(
    {
      pro: Boolean(access),
      plan: access?.plan ?? null,
      via: access?.via ?? null,
      teamOwner: access?.via === "member" ? access.ownerName : null,
      purchasedAt: access?.purchase.createdAt ?? null,
      providers: [...new Set(accounts.map((account) => account.providerId))],
      emailUpdates: !profile?.unsubscribedAt,
    },
    { headers: { "cache-control": "no-store" } }
  )
}

export async function onRequestPatch({ request, env }: Context) {
  if (!isSameOrigin(request, env.BETTER_AUTH_URL)) {
    return sameOriginError()
  }
  const session = await getAuth(env).api.getSession({
    headers: request.headers,
  })
  if (!session) {
    return signInError()
  }

  const body = (await request.json().catch(() => ({}))) as {
    emailUpdates?: unknown
  }
  if (typeof body.emailUpdates !== "boolean") {
    return apiError("bad_request", {
      error: "Choose whether to get emails",
      detail: "The emailUpdates field is missing or isn't true or false.",
      resolution: 'Send { "emailUpdates": false } to stop release emails.',
    })
  }

  await getDb(env.DB)
    .update(schema.user)
    .set({ unsubscribedAt: body.emailUpdates ? null : new Date() })
    .where(eq(schema.user.id, session.user.id))

  return Response.json(
    { emailUpdates: body.emailUpdates },
    { headers: { "cache-control": "no-store" } }
  )
}
