import { getDb } from "@/lib/db"
import {
  getPayments,
  recordPayment,
  revokePurchase,
  type PaymentsEnv,
} from "@/lib/payments"

type Context = {
  request: Request
  env: PaymentsEnv
}

export async function onRequestPost({ request, env }: Context) {
  const body = await request.text()

  let event
  try {
    event = getPayments(env).webhooks.unwrap(body, {
      headers: Object.fromEntries(request.headers),
    })
  } catch {
    return new Response("Invalid signature", { status: 401 })
  }

  const db = getDb(env.DB)

  switch (event.type) {
    case "payment.succeeded": {
      const result = await recordPayment(
        db,
        event.data,
        env.DODO_PRO_PRODUCT_ID
      )
      if (result === "unmatched") {
        console.error("Pro payment without a matching user", {
          paymentId: event.data.payment_id,
        })
      }
      break
    }
    case "refund.succeeded":
      if (!event.data.is_partial) {
        await revokePurchase(db, event.data.payment_id, "refunded")
      }
      break
    case "dispute.lost":
      await revokePurchase(db, event.data.payment_id, "disputed")
      break
  }

  return new Response(null, { status: 204 })
}
