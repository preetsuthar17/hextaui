import type { Subscription } from "dodopayments/resources/subscriptions"
import { and, eq, inArray, isNull } from "drizzle-orm"

import { schema, type Db } from "@/lib/db"
import {
  sendSponsorEndedEmail,
  sendSponsorStartedEmails,
} from "@/lib/email/sponsor"
import { getPayments, type PaymentsEnv } from "@/lib/payments"
import { currentSponsor, type SponsorInput } from "@/lib/sponsor"
import { siteUrl } from "@/lib/site"

type SponsorEnv = PaymentsEnv & {
  DODO_SPONSOR_PRODUCT_ID: string
}

type SponsorStatus = (typeof schema.sponsor.$inferSelect)["status"]

const slotHolding: SponsorStatus[] = ["active", "on_hold", "past_due", "paused"]
const slotEnding: SponsorStatus[] = ["cancelled", "expired", "failed"]

async function isSponsorSlotTaken(db: Db) {
  if (currentSponsor) return true
  const held = await db.query.sponsor.findFirst({
    where: inArray(schema.sponsor.status, slotHolding),
  })
  return Boolean(held)
}

async function startSponsorCheckout(
  env: SponsorEnv,
  db: Db,
  input: SponsorInput
) {
  const id = crypto.randomUUID()
  await db.insert(schema.sponsor).values({ id, ...input })

  const checkout = await getPayments(env).checkoutSessions.create({
    product_cart: [{ product_id: env.DODO_SPONSOR_PRODUCT_ID, quantity: 1 }],
    customer: { email: input.email, name: input.name },
    metadata: { sponsor_id: id },
    return_url: new URL("/sponsor?checkout=done", siteUrl).href,
  })
  return checkout.checkout_url
}

async function findSponsor(db: Db, subscription: Subscription) {
  const bySubscription = await db.query.sponsor.findFirst({
    where: eq(schema.sponsor.subscriptionId, subscription.subscription_id),
  })
  if (bySubscription) return bySubscription
  const sponsorId = subscription.metadata.sponsor_id
  if (typeof sponsorId !== "string") return undefined
  return db.query.sponsor.findFirst({
    where: eq(schema.sponsor.id, sponsorId),
  })
}

async function syncSponsorSubscription(
  env: SponsorEnv,
  db: Db,
  subscription: Subscription
) {
  if (subscription.product_id !== env.DODO_SPONSOR_PRODUCT_ID) {
    return "ignored"
  }
  const sponsor = await findSponsor(db, subscription)
  if (!sponsor) return "unmatched"

  const status = subscription.status
  await db
    .update(schema.sponsor)
    .set({
      status,
      subscriptionId: subscription.subscription_id,
      customerId: subscription.customer.customer_id,
    })
    .where(eq(schema.sponsor.id, sponsor.id))

  if (status === "active") {
    const activated = await db
      .update(schema.sponsor)
      .set({ activatedAt: new Date() })
      .where(
        and(
          eq(schema.sponsor.id, sponsor.id),
          isNull(schema.sponsor.activatedAt)
        )
      )
      .returning({ id: schema.sponsor.id })
    if (activated.length > 0) {
      await sendSponsorStartedEmails(env, sponsor)
    }
  } else if (
    sponsor.activatedAt &&
    sponsor.status !== status &&
    slotEnding.includes(status)
  ) {
    await sendSponsorEndedEmail(env, sponsor, status)
  }
  return "recorded"
}

export {
  isSponsorSlotTaken,
  startSponsorCheckout,
  syncSponsorSubscription,
  type SponsorEnv,
}
