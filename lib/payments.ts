import DodoPayments from "dodopayments"
import type { Payment } from "dodopayments/resources/payments"
import { and, desc, eq, inArray, isNull } from "drizzle-orm"

import type { AuthEnv } from "@/lib/auth"
import { schema, type Db } from "@/lib/db"
import { sendGuestPurchaseEmail, sendPurchaseEmail } from "@/lib/email/account"
import {
  claimLink,
  isClaimNonce,
  signClaim,
  verifyClaim,
} from "@/lib/purchase-claim"
import {
  isEarlyBird,
  planRank,
  teamPlanIds,
  type ProPlanId,
  type SalePlanId,
  type TeamPlanId,
} from "@/lib/pro/pricing"

type PaymentsEnv = AuthEnv & {
  DODO_PAYMENTS_API_KEY: string
  DODO_PAYMENTS_WEBHOOK_KEY: string
  DODO_PAYMENTS_ENVIRONMENT: "live_mode" | "test_mode"
  DODO_SOLO_EARLY_PRODUCT_ID: string
  DODO_SOLO_PRODUCT_ID: string
  DODO_TEAM_EARLY_PRODUCT_ID: string
  DODO_TEAM_PRODUCT_ID: string
  DODO_UNLIMITED_EARLY_PRODUCT_ID?: string
  DODO_UNLIMITED_PRODUCT_ID?: string
  DODO_UPGRADE_DISCOUNT_CODE?: string
}

type Purchase = typeof schema.purchase.$inferSelect

type GuestPurchase = typeof schema.guestPurchase.$inferSelect

type User = typeof schema.user.$inferSelect

type ProAccess =
  | { via: "owner"; plan: ProPlanId; purchase: Purchase }
  | { via: "member"; plan: TeamPlanId; purchase: Purchase; ownerName: string }

type ClaimResult =
  | { status: "invalid" | "not_found" | "pending" | "failed" }
  | {
      status: "paid" | "refunded" | "disputed"
      paymentId: string
      plan: ProPlanId
      amount: number
      currency: string
      account: "this" | "other" | "none"
      email: string | null
      report: boolean
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

function planProducts(env: PaymentsEnv) {
  return {
    solo: {
      early: env.DODO_SOLO_EARLY_PRODUCT_ID,
      regular: env.DODO_SOLO_PRODUCT_ID,
    },
    team: {
      early: env.DODO_TEAM_EARLY_PRODUCT_ID,
      regular: env.DODO_TEAM_PRODUCT_ID,
    },
    unlimited: {
      early: env.DODO_UNLIMITED_EARLY_PRODUCT_ID,
      regular: env.DODO_UNLIMITED_PRODUCT_ID,
    },
  } satisfies Record<ProPlanId, { early?: string; regular?: string }>
}

function productPlans(env: PaymentsEnv) {
  const plans = new Map<string, ProPlanId>()
  for (const [plan, products] of Object.entries(planProducts(env))) {
    for (const id of [products.early, products.regular]) {
      if (id) plans.set(id, plan as ProPlanId)
    }
  }
  return plans
}

function checkoutProduct(env: PaymentsEnv, plan: SalePlanId, now = new Date()) {
  const products = planProducts(env)[plan]
  return (isEarlyBird(now) ? products.early : products.regular) || null
}

function paymentProduct(env: PaymentsEnv, payment: Payment) {
  const plans = productPlans(env)
  const productId = payment.product_cart
    ?.map((item) => item.product_id)
    .find((id) => plans.has(id))
  const plan = productId ? plans.get(productId) : undefined
  return productId && plan ? { productId, plan } : null
}

function paymentClaim(payment: Payment) {
  const claim = payment.metadata.claim
  return isClaimNonce(claim) ? claim : null
}

function maskEmail(email: string) {
  const [name, domain] = email.split("@")
  if (!name || !domain) return null
  return `${name.slice(0, Math.min(2, name.length - 1))}***@${domain}`
}

async function findOwnPurchase(db: Db, userId: string) {
  const purchases = await db.query.purchase.findMany({
    where: and(
      eq(schema.purchase.userId, userId),
      eq(schema.purchase.status, "paid")
    ),
    orderBy: desc(schema.purchase.createdAt),
  })
  return purchases
    .slice()
    .sort((a, b) => planRank[b.plan] - planRank[a.plan])
    .at(0)
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
        inArray(schema.purchase.plan, teamPlanIds)
      )
    )
    .limit(1)
  return seat
}

async function attachGuestPurchase(
  db: Db,
  guest: GuestPurchase,
  userId: string
) {
  await db.batch([
    db
      .insert(schema.purchase)
      .values({
        id: guest.id,
        userId,
        productId: guest.productId,
        plan: guest.plan,
        customerId: guest.customerId,
        status: guest.status,
        amount: guest.amount,
        currency: guest.currency,
        claim: guest.claim,
        reportedAt: guest.reportedAt,
        createdAt: guest.createdAt,
      })
      .onConflictDoNothing(),
    db
      .delete(schema.guestPurchase)
      .where(eq(schema.guestPurchase.id, guest.id)),
  ])
}

async function adoptGuestPurchases(
  db: Db,
  user: Pick<User, "id" | "email" | "emailVerified">
) {
  if (!user.emailVerified) return 0
  const guests = await db.query.guestPurchase.findMany({
    where: eq(schema.guestPurchase.email, user.email.toLowerCase()),
  })
  for (const guest of guests) {
    await attachGuestPurchase(db, guest, user.id)
  }
  return guests.length
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

  if ((await adoptGuestPurchases(db, user)) > 0) {
    const adopted = await findOwnPurchase(db, userId)
    if (adopted) return { via: "owner", plan: adopted.plan, purchase: adopted }
  }

  const seat = await findTeamSeat(db, user.email)
  if (!seat) return null
  if (seat.purchase.plan === "solo") return null
  return {
    via: "member",
    plan: seat.purchase.plan,
    purchase: seat.purchase,
    ownerName: seat.ownerName,
  }
}

async function findBuyer(db: Db, payment: Payment, claimantId?: string) {
  for (const id of [payment.metadata.user_id, claimantId]) {
    if (typeof id !== "string") continue
    const byId = await db.query.user.findFirst({
      where: eq(schema.user.id, id),
    })
    if (byId) return byId
  }
  const byEmail = await db.query.user.findFirst({
    where: eq(schema.user.email, payment.customer.email.toLowerCase()),
  })
  return byEmail?.emailVerified ? byEmail : undefined
}

async function recordPayment(
  db: Db,
  payment: Payment,
  env: PaymentsEnv,
  claimantId?: string
) {
  const product = paymentProduct(env, payment)
  if (!product) return "ignored"
  const { productId, plan } = product

  const existing = await db.query.purchase.findFirst({
    where: eq(schema.purchase.id, payment.payment_id),
  })
  if (existing) return "recorded"

  const status = payment.refund_status === "full" ? "refunded" : "paid"
  const claim = paymentClaim(payment)
  const details = {
    id: payment.payment_id,
    productId,
    plan,
    customerId: payment.customer.customer_id,
    status,
    amount: payment.total_amount,
    currency: payment.currency,
    claim,
  } as const

  const buyer = await findBuyer(db, payment, claimantId)
  if (!buyer) {
    const created = await db
      .insert(schema.guestPurchase)
      .values({
        ...details,
        email: payment.customer.email.toLowerCase(),
        name: payment.customer.name || null,
      })
      .onConflictDoNothing()
      .returning({ id: schema.guestPurchase.id })
    if (created.length > 0 && status === "paid") {
      await sendGuestPurchaseEmail(
        env,
        { name: payment.customer.name, email: payment.customer.email },
        plan,
        claim
          ? claimLink(
              await signClaim(env.BETTER_AUTH_SECRET, claim),
              payment.payment_id
            )
          : null
      )
    }
    return "guest"
  }

  const guest = await db.query.guestPurchase.findFirst({
    where: eq(schema.guestPurchase.id, payment.payment_id),
  })
  if (guest) {
    await attachGuestPurchase(db, guest, buyer.id)
    return "recorded"
  }

  const created = await db
    .insert(schema.purchase)
    .values({ ...details, userId: buyer.id })
    .onConflictDoNothing()
    .returning({ id: schema.purchase.id })
  if (created.length > 0 && status === "paid") {
    await sendPurchaseEmail(env, buyer, plan)
  }
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

async function ownerEmail(db: Db, userId: string) {
  const owner = await db.query.user.findFirst({
    where: eq(schema.user.id, userId),
    columns: { email: true },
  })
  return owner ? maskEmail(owner.email) : null
}

async function reportOnce(
  db: Db,
  table: typeof schema.purchase | typeof schema.guestPurchase,
  paymentId: string
) {
  const reported = await db
    .update(table)
    .set({ reportedAt: new Date() })
    .where(
      and(
        eq(table.id, paymentId),
        eq(table.status, "paid"),
        isNull(table.reportedAt)
      )
    )
    .returning({ id: table.id })
  return reported.length > 0
}

async function claimFromDb(
  env: PaymentsEnv,
  db: Db,
  paymentId: string,
  token: string,
  userId: string | null
): Promise<ClaimResult | null> {
  const purchase = await db.query.purchase.findFirst({
    where: eq(schema.purchase.id, paymentId),
  })
  if (purchase) {
    const mine = userId !== null && purchase.userId === userId
    if (
      !mine &&
      !(await verifyClaim(env.BETTER_AUTH_SECRET, purchase.claim, token))
    ) {
      return { status: "invalid" }
    }
    return {
      status: purchase.status,
      paymentId,
      plan: purchase.plan,
      amount: purchase.amount,
      currency: purchase.currency,
      account: mine ? "this" : "other",
      email: await ownerEmail(db, purchase.userId),
      report: await reportOnce(db, schema.purchase, paymentId),
    }
  }

  const guest = await db.query.guestPurchase.findFirst({
    where: eq(schema.guestPurchase.id, paymentId),
  })
  if (!guest) return null
  if (!(await verifyClaim(env.BETTER_AUTH_SECRET, guest.claim, token))) {
    return { status: "invalid" }
  }
  const attach = userId !== null && guest.status === "paid"
  if (attach) await attachGuestPurchase(db, guest, userId)
  return {
    status: guest.status,
    paymentId,
    plan: guest.plan,
    amount: guest.amount,
    currency: guest.currency,
    account: attach ? "this" : "none",
    email: maskEmail(guest.email),
    report: await reportOnce(
      db,
      attach ? schema.purchase : schema.guestPurchase,
      paymentId
    ),
  }
}

async function claimPurchase(
  env: PaymentsEnv,
  db: Db,
  {
    paymentId,
    token,
    userId,
  }: { paymentId: string; token: string; userId: string | null }
): Promise<ClaimResult> {
  const stored = await claimFromDb(env, db, paymentId, token, userId)
  if (stored) return stored

  const payment = await getPayments(env)
    .payments.retrieve(paymentId)
    .catch(() => null)
  if (!payment || !paymentProduct(env, payment)) return { status: "not_found" }
  if (
    !(await verifyClaim(env.BETTER_AUTH_SECRET, paymentClaim(payment), token))
  ) {
    return { status: "invalid" }
  }
  if (payment.status === "failed" || payment.status === "cancelled") {
    return { status: "failed" }
  }
  if (payment.status !== "succeeded") return { status: "pending" }

  await recordPayment(db, payment, env, userId ?? undefined)
  return (
    (await claimFromDb(env, db, paymentId, token, userId)) ?? {
      status: "pending",
    }
  )
}

async function revokePurchase(
  db: Db,
  paymentId: string,
  status: "refunded" | "disputed"
) {
  await db.batch([
    db
      .update(schema.purchase)
      .set({ status })
      .where(eq(schema.purchase.id, paymentId)),
    db
      .update(schema.guestPurchase)
      .set({ status })
      .where(eq(schema.guestPurchase.id, paymentId)),
  ])
}

export {
  adoptGuestPurchases,
  checkoutProduct,
  claimPurchase,
  confirmPayment,
  findOwnPurchase,
  findProAccess,
  getPayments,
  maskEmail,
  recordPayment,
  revokePurchase,
  type ClaimResult,
  type PaymentsEnv,
  type ProAccess,
  type Purchase,
}
