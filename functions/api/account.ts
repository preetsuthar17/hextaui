import { getAuth } from "@/lib/auth"
import { eq } from "drizzle-orm"

import { getDb, schema } from "@/lib/db"
import {
  confirmPayment,
  findProPurchase,
  type PaymentsEnv,
} from "@/lib/payments"
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
  let purchase = await findProPurchase(db, userId)

  const paymentId = new URL(request.url).searchParams.get("payment_id")
  if (!purchase && paymentId?.startsWith("pay_")) {
    await confirmPayment(env, db, paymentId, userId)
    purchase = await findProPurchase(db, userId)
  }

  const accounts = await db
    .select({ providerId: schema.account.providerId })
    .from(schema.account)
    .where(eq(schema.account.userId, userId))

  return Response.json(
    {
      pro: Boolean(purchase),
      purchasedAt: purchase?.createdAt ?? null,
      providers: [...new Set(accounts.map((account) => account.providerId))],
    },
    { headers: { "cache-control": "no-store" } }
  )
}
