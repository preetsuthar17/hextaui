import { getAuth } from "@/lib/auth"
import { getDb } from "@/lib/db"
import {
  confirmPayment,
  findProPurchase,
  type PaymentsEnv,
} from "@/lib/payments"

type Context = {
  request: Request
  env: PaymentsEnv
}

export async function onRequestGet({ request, env }: Context) {
  const session = await getAuth(env).api.getSession({
    headers: request.headers,
  })
  if (!session) {
    return Response.json({ error: "Sign in first" }, { status: 401 })
  }

  const db = getDb(env.DB)
  const userId = session.user.id
  let purchase = await findProPurchase(db, userId)

  const paymentId = new URL(request.url).searchParams.get("payment_id")
  if (!purchase && paymentId?.startsWith("pay_")) {
    await confirmPayment(env, db, paymentId, userId)
    purchase = await findProPurchase(db, userId)
  }

  return Response.json(
    {
      pro: Boolean(purchase),
      purchasedAt: purchase?.createdAt ?? null,
    },
    { headers: { "cache-control": "no-store" } }
  )
}
