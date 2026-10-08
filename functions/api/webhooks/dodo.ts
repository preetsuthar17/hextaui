import { getDb } from "@/lib/db"
import { getPayments, recordPayment, revokePurchase } from "@/lib/payments"
import { syncSponsorSubscription, type SponsorEnv } from "@/lib/sponsor-server"
import { apiError } from "@/lib/api-error"

type Context = {
  request: Request
  env: SponsorEnv
}

export async function onRequestPost({ request, env }: Context) {
  const body = await request.text()

  let event
  try {
    event = getPayments(env).webhooks.unwrap(body, {
      headers: Object.fromEntries(request.headers),
    })
  } catch {
    return apiError("invalid_signature", {
      detail: "The webhook signature did not verify.",
      resolution:
        "Send Standard Webhooks headers signed with the endpoint's secret.",
    })
  }

  const db = getDb(env.DB)

  switch (event.type) {
    case "payment.succeeded": {
      const result = await recordPayment(db, event.data, env)
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
    case "subscription.active":
    case "subscription.renewed":
    case "subscription.updated":
    case "subscription.on_hold":
    case "subscription.past_due":
    case "subscription.paused":
    case "subscription.unpaused":
    case "subscription.cancelled":
    case "subscription.failed":
    case "subscription.expired": {
      const result = await syncSponsorSubscription(env, db, event.data)
      if (result === "unmatched") {
        console.error("Sponsor subscription without a matching sponsor", {
          subscriptionId: event.data.subscription_id,
        })
      }
      break
    }
  }

  return new Response(null, { status: 204 })
}
