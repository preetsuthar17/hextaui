import DodoPayments from "dodopayments"
import type { Payment } from "dodopayments/resources/payments"
import { and, eq } from "drizzle-orm"

import type { AuthEnv } from "@/lib/auth"
import { schema, type Db } from "@/lib/db"

type PaymentsEnv = AuthEnv & {
  DODO_PAYMENTS_API_KEY: string
  DODO_PAYMENTS_WEBHOOK_KEY: string
  DODO_PAYMENTS_ENVIRONMENT: "live_mode" | "test_mode"
  DODO_PRO_PRODUCT_ID: string
}

let payments: DodoPayments | undefined

function getPayments(env: PaymentsEnv) {
  payments ??= new DodoPayments({
    bearerToken: env.DODO_PAYMENTS_API_KEY,
    webhookKey: env.DODO_PAYMENTS_WEBHOOK_KEY,
    environment: env.DODO_PAYMENTS_ENVIRONMENT,
  })
  return payments
}

async function findProPurchase(db: Db, userId: string) {
  return db.query.purchase.findFirst({
    where: and(
      eq(schema.purchase.userId, userId),
      eq(schema.purchase.status, "paid")
    ),
  })
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

async function recordPayment(db: Db, payment: Payment, productId: string) {
  const forPro = payment.product_cart?.some(
    (item) => item.product_id === productId
  )
  if (!forPro) return "ignored"

  const buyer = await findBuyer(db, payment)
  if (!buyer) return "unmatched"

  await db
    .insert(schema.purchase)
    .values({
      id: payment.payment_id,
      userId: buyer.id,
      productId,
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
  return recordPayment(db, payment, env.DODO_PRO_PRODUCT_ID)
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
  confirmPayment,
  findProPurchase,
  getPayments,
  recordPayment,
  revokePurchase,
  type PaymentsEnv,
}
