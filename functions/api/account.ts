import { getAuth } from "@/lib/auth"
import { eq } from "drizzle-orm"

import { getDb, schema } from "@/lib/db"
import { confirmPayment, findProAccess, type PaymentsEnv } from "@/lib/payments"
import { signInError } from "@/lib/api-error"

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

  const accounts = await db
    .select({ providerId: schema.account.providerId })
    .from(schema.account)
    .where(eq(schema.account.userId, userId))

  return Response.json(
    {
      pro: Boolean(access),
      plan: access?.plan ?? null,
      via: access?.via ?? null,
      teamOwner: access?.via === "member" ? access.ownerName : null,
      purchasedAt: access?.purchase.createdAt ?? null,
      providers: [...new Set(accounts.map((account) => account.providerId))],
    },
    { headers: { "cache-control": "no-store" } }
  )
}
