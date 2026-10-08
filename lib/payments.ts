import DodoPayments from "dodopayments"
import type { Payment } from "dodopayments/resources/payments"
import { and, desc, eq } from "drizzle-orm"

import type { AuthEnv } from "@/lib/auth"
import { schema, type Db } from "@/lib/db"
import { isEarlyBird, type ProPlanId } from "@/lib/pro/pricing"

type PaymentsEnv = AuthEnv & {
  DODO_PAYMENTS_API_KEY: string
  DODO_PAYMENTS_WEBHOOK_KEY: string
  DODO_PAYMENTS_ENVIRONMENT: "live_mode" | "test_mode"
  DODO_SOLO_EARLY_PRODUCT_ID: string
  DODO_SOLO_PRODUCT_ID: string
  DODO_TEAM_EARLY_PRODUCT_ID: string
  DODO_TEAM_PRODUCT_ID: string
}

type Purchase = typeof schema.purchase.$inferSelect

type ProAccess =
  | { via: "owner"; plan: ProPlanId; purchase: Purchase }
  | { via: "member"; plan: "team"; purchase: Purchase; ownerName: string }

let payments: DodoPayments | undefined

function getPayments(env: PaymentsEnv) {
  payments ??= new DodoPayments({
    bearerToken: env.DODO_PAYMENTS_API_KEY,
    webhookKey: env.DODO_PAYMENTS_WEBHOOK_KEY,
    environment: env.DODO_PAYMENTS_ENVIRONMENT,
  })
  return payments
}

function productPlans(env: PaymentsEnv) {
  return new Map<string, ProPlanId>([
    [env.DODO_SOLO_EARLY_PRODUCT_ID, "solo"],
    [env.DODO_SOLO_PRODUCT_ID, "solo"],
    [env.DODO_TEAM_EARLY_PRODUCT_ID, "team"],
    [env.DODO_TEAM_PRODUCT_ID, "team"],
  ])
}

function checkoutProduct(env: PaymentsEnv, plan: ProPlanId, now = new Date()) {
  const early = isEarlyBird(now)
  if (plan === "team") {
    return early ? env.DODO_TEAM_EARLY_PRODUCT_ID : env.DODO_TEAM_PRODUCT_ID
  }
  return early ? env.DODO_SOLO_EARLY_PRODUCT_ID : env.DODO_SOLO_PRODUCT_ID
}

async function findOwnPurchase(db: Db, userId: string) {
  const purchases = await db.query.purchase.findMany({
    where: and(
      eq(schema.purchase.userId, userId),
      eq(schema.purchase.status, "paid")
    ),
    orderBy: desc(schema.purchase.createdAt),
  })
  return purchases.find((purchase) => purchase.plan === "team") ?? purchases[0]
}

async function findTeamSeat(db: Db, email: string) {
  const [seat] = await db
    .select({ purchase: schema.purchase, ownerName: schema.user.name })
    .from(schema.teamMember)
    .innerJoin(
      schema.purchase,
      eq(schema.teamMember.purchaseId, schema.purchase.id)
    )
    .innerJoin(schema.user, eq(schema.purchase.userId, schema.user.id))
    .where(
      and(
        eq(schema.teamMember.email, email.toLowerCase()),
        eq(schema.purchase.status, "paid"),
        eq(schema.purchase.plan, "team")
      )
    )
    .limit(1)
  return seat
}

async function findProAccess(
  db: Db,
  userId: string
): Promise<ProAccess | null> {
  const own = await findOwnPurchase(db, userId)
  if (own) return { via: "owner", plan: own.plan, purchase: own }

  const user = await db.query.user.findFirst({
    where: eq(schema.user.id, userId),
  })
  if (!user?.emailVerified) return null

  const seat = await findTeamSeat(db, user.email)
  if (!seat) return null
  return {
    via: "member",
    plan: "team",
    purchase: seat.purchase,
    ownerName: seat.ownerName,
  }
}

async function findBuyer(db: Db, payment: Payment) {
  const userId = payment.metadata.user_id
  if (typeof userId === "string") {
    const byId = await db.query.user.findFirst({
      where: eq(schema.user.id, userId),
    })
    if (byId) return byId
  }
  return db.query.user.findFirst({
    where: eq(schema.user.email, payment.customer.email),
  })
}

async function recordPayment(db: Db, payment: Payment, env: PaymentsEnv) {
  const plans = productPlans(env)
  const productId = payment.product_cart
    ?.map((item) => item.product_id)
    .find((id) => plans.has(id))
  const plan = productId ? plans.get(productId) : undefined
  if (!productId || !plan) return "ignored"

  const buyer = await findBuyer(db, payment)
  if (!buyer) return "unmatched"

  await db
    .insert(schema.purchase)
    .values({
      id: payment.payment_id,
      userId: buyer.id,
      productId,
      plan,
      customerId: payment.customer.customer_id,
      status: payment.refund_status === "full" ? "refunded" : "paid",
      amount: payment.total_amount,
      currency: payment.currency,
    })
    .onConflictDoNothing()
  return "recorded"
}

async function confirmPayment(
  env: PaymentsEnv,
  db: Db,
  paymentId: string,
  userId: string
) {
  const payment = await getPayments(env)
    .payments.retrieve(paymentId)
    .catch(() => null)
  if (payment?.status !== "succeeded") return "unpaid"
  if (payment.metadata.user_id !== userId) return "unmatched"
  return recordPayment(db, payment, env)
}

async function revokePurchase(
  db: Db,
  paymentId: string,
  status: "refunded" | "disputed"
) {
  await db
    .update(schema.purchase)
    .set({ status })
    .where(eq(schema.purchase.id, paymentId))
}

export {
  checkoutProduct,
  confirmPayment,
  findOwnPurchase,
  findProAccess,
  getPayments,
  recordPayment,
  revokePurchase,
  type PaymentsEnv,
  type ProAccess,
}
