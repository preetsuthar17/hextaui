import type { Payment } from "dodopayments/resources/payments"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { getDb, schema, type Db } from "@/lib/db"
import {
  claimPurchase,
  findProAccess,
  recordPayment,
  revokePurchase,
  type PaymentsEnv,
} from "@/lib/payments"
import { createClaim, verifyClaim } from "@/lib/purchase-claim"
import { createSqliteD1 } from "@/lib/testing/sqlite-d1"

const mocks = vi.hoisted(() => ({
  retrieve: vi.fn(),
  sendPurchaseEmail: vi.fn(async () => undefined),
  sendGuestPurchaseEmail: vi.fn(async () => undefined),
}))

vi.mock("dodopayments", () => ({
  default: class {
    payments = { retrieve: mocks.retrieve }
  },
}))

vi.mock("@/lib/email/account", () => ({
  sendPurchaseEmail: mocks.sendPurchaseEmail,
  sendGuestPurchaseEmail: mocks.sendGuestPurchaseEmail,
}))

const secret = "test-secret-with-enough-entropy"

const env = {
  BETTER_AUTH_SECRET: secret,
  BETTER_AUTH_URL: "https://hextaui.com",
  DODO_PAYMENTS_API_KEY: "key",
  DODO_PAYMENTS_WEBHOOK_KEY: "whsec",
  DODO_PAYMENTS_ENVIRONMENT: "test_mode",
  DODO_SOLO_EARLY_PRODUCT_ID: "pdt_solo_early",
  DODO_SOLO_PRODUCT_ID: "pdt_solo",
  DODO_TEAM_EARLY_PRODUCT_ID: "pdt_team_early",
  DODO_TEAM_PRODUCT_ID: "pdt_team",
} as unknown as PaymentsEnv

let db: Db

function payment(overrides: {
  id?: string
  email?: string
  product?: string
  status?: string
  metadata?: Record<string, string>
}): Payment {
  return {
    payment_id: overrides.id ?? "pay_1",
    status: overrides.status ?? "succeeded",
    product_cart: [
      { product_id: overrides.product ?? "pdt_solo_early", quantity: 1 },
    ],
    customer: {
      customer_id: "cus_1",
      email: overrides.email ?? "Buyer@Example.com",
      name: "Buyer",
    },
    metadata: overrides.metadata ?? {},
    total_amount: 4900,
    currency: "USD",
    refund_status: null,
  } as unknown as Payment
}

async function addUser(id: string, email: string, emailVerified = true) {
  await db.insert(schema.user).values({ id, name: id, email, emailVerified })
}

async function guests() {
  return db.select().from(schema.guestPurchase)
}

async function purchases() {
  return db.select().from(schema.purchase)
}

beforeEach(() => {
  db = getDb(createSqliteD1().d1)
  mocks.retrieve.mockReset()
  mocks.sendPurchaseEmail.mockClear()
  mocks.sendGuestPurchaseEmail.mockClear()
})

describe("recordPayment", () => {
  it("keeps a guest purchase with the checkout email and mails a working claim link", async () => {
    const claim = await createClaim(secret)
    const result = await recordPayment(
      db,
      payment({ metadata: { plan: "solo", claim: claim.nonce } }),
      env
    )

    expect(result).toBe("guest")
    const [guest] = await guests()
    expect(guest).toMatchObject({
      id: "pay_1",
      email: "buyer@example.com",
      plan: "solo",
      status: "paid",
      claim: claim.nonce,
    })
    expect(await purchases()).toEqual([])

    const [, , , link] = mocks.sendGuestPurchaseEmail.mock
      .calls[0] as unknown as [unknown, unknown, unknown, string]
    const url = new URL(link)
    expect(url.searchParams.get("payment_id")).toBe("pay_1")
    expect(
      await verifyClaim(secret, claim.nonce, url.searchParams.get("claim"))
    ).toBe(true)
  })

  it("records straight to the signed-in buyer from metadata", async () => {
    await addUser("u1", "someone-else@example.com")
    await recordPayment(db, payment({ metadata: { user_id: "u1" } }), env)

    expect(await guests()).toEqual([])
    expect(await purchases()).toMatchObject([{ id: "pay_1", userId: "u1" }])
    expect(mocks.sendPurchaseEmail).toHaveBeenCalledTimes(1)
  })

  it("matches a verified account by email, but never an unverified one", async () => {
    await addUser("verified", "buyer@example.com")
    await addUser("unverified", "other@example.com", false)

    await recordPayment(db, payment({ id: "pay_a" }), env)
    await recordPayment(
      db,
      payment({ id: "pay_b", email: "other@example.com" }),
      env
    )

    expect(await purchases()).toMatchObject([
      { id: "pay_a", userId: "verified" },
    ])
    expect(await guests()).toMatchObject([{ id: "pay_b" }])
  })

  it("ignores payments for other products and repeated webhooks", async () => {
    expect(
      await recordPayment(db, payment({ product: "pdt_sheeplaunch" }), env)
    ).toBe("ignored")

    await recordPayment(db, payment({}), env)
    await recordPayment(db, payment({}), env)
    expect(await guests()).toHaveLength(1)
    expect(mocks.sendGuestPurchaseEmail).toHaveBeenCalledTimes(1)
  })
})

describe("findProAccess", () => {
  it("adopts a guest purchase once the buyer signs in with the same verified email", async () => {
    await recordPayment(db, payment({}), env)
    await addUser("u1", "buyer@example.com")

    const access = await findProAccess(db, "u1")
    expect(access).toMatchObject({ via: "owner", plan: "solo" })
    expect(await guests()).toEqual([])
    expect(await purchases()).toMatchObject([{ id: "pay_1", userId: "u1" }])
  })

  it("does not adopt for an unverified email", async () => {
    await recordPayment(db, payment({}), env)
    await addUser("u1", "buyer@example.com", false)

    expect(await findProAccess(db, "u1")).toBeNull()
    expect(await guests()).toHaveLength(1)
  })

  it("gives no access for a refunded guest purchase", async () => {
    await recordPayment(db, payment({}), env)
    await revokePurchase(db, "pay_1", "refunded")
    await addUser("u1", "buyer@example.com")

    expect(await findProAccess(db, "u1")).toBeNull()
  })
})

describe("claimPurchase", () => {
  it("moves a guest purchase to an account with a different email", async () => {
    const claim = await createClaim(secret)
    await recordPayment(db, payment({ metadata: { claim: claim.nonce } }), env)
    await addUser("u1", "github@example.org")

    const result = await claimPurchase(env, db, {
      paymentId: "pay_1",
      token: claim.token,
      userId: "u1",
    })

    expect(result).toMatchObject({
      status: "paid",
      plan: "solo",
      amount: 4900,
      currency: "USD",
      account: "this",
    })
    expect(await findProAccess(db, "u1")).toMatchObject({ plan: "solo" })
    expect(mocks.retrieve).not.toHaveBeenCalled()
  })

  it("is single-use: a second account can't take a claimed purchase", async () => {
    const claim = await createClaim(secret)
    await recordPayment(db, payment({ metadata: { claim: claim.nonce } }), env)
    await addUser("u1", "one@example.org")
    await addUser("u2", "two@example.org")

    await claimPurchase(env, db, {
      paymentId: "pay_1",
      token: claim.token,
      userId: "u1",
    })
    const second = await claimPurchase(env, db, {
      paymentId: "pay_1",
      token: claim.token,
      userId: "u2",
    })

    expect(second).toMatchObject({ status: "paid", account: "other" })
    expect(await findProAccess(db, "u2")).toBeNull()
    expect(await findProAccess(db, "u1")).toMatchObject({ plan: "solo" })
  })

  it("rejects a token issued for another checkout", async () => {
    const claim = await createClaim(secret)
    const other = await createClaim(secret)
    await recordPayment(db, payment({ metadata: { claim: claim.nonce } }), env)
    await addUser("u1", "one@example.org")

    expect(
      await claimPurchase(env, db, {
        paymentId: "pay_1",
        token: other.token,
        userId: "u1",
      })
    ).toEqual({ status: "invalid" })
    expect(await guests()).toHaveLength(1)
  })

  it("rejects a purchase without a claim nonce unless it's already yours", async () => {
    await addUser("u1", "buyer@example.com")
    await recordPayment(db, payment({ metadata: { user_id: "u1" } }), env)

    expect(
      await claimPurchase(env, db, {
        paymentId: "pay_1",
        token: "anything",
        userId: null,
      })
    ).toEqual({ status: "invalid" })
    expect(
      await claimPurchase(env, db, {
        paymentId: "pay_1",
        token: "anything",
        userId: "u1",
      })
    ).toMatchObject({ status: "paid", account: "this" })
  })

  it("confirms with Dodo when the webhook hasn't arrived and records once", async () => {
    const claim = await createClaim(secret)
    mocks.retrieve.mockResolvedValue(
      payment({ metadata: { claim: claim.nonce } })
    )

    const anonymous = await claimPurchase(env, db, {
      paymentId: "pay_1",
      token: claim.token,
      userId: null,
    })
    expect(anonymous).toMatchObject({
      status: "paid",
      account: "none",
      email: "bu***@example.com",
    })

    await addUser("u1", "github@example.org")
    const signedIn = await claimPurchase(env, db, {
      paymentId: "pay_1",
      token: claim.token,
      userId: "u1",
    })
    expect(signedIn).toMatchObject({ status: "paid", account: "this" })

    await recordPayment(db, payment({ metadata: { claim: claim.nonce } }), env)
    expect(await guests()).toEqual([])
    expect(await purchases()).toMatchObject([{ id: "pay_1", userId: "u1" }])
    expect(mocks.sendGuestPurchaseEmail).toHaveBeenCalledTimes(1)
  })

  it("records straight to the claimant when signed in before the webhook", async () => {
    const claim = await createClaim(secret)
    mocks.retrieve.mockResolvedValue(
      payment({ metadata: { claim: claim.nonce } })
    )
    await addUser("u1", "github@example.org")

    expect(
      await claimPurchase(env, db, {
        paymentId: "pay_1",
        token: claim.token,
        userId: "u1",
      })
    ).toMatchObject({ status: "paid", account: "this" })
    expect(await guests()).toEqual([])
    expect(mocks.sendPurchaseEmail).toHaveBeenCalledTimes(1)
  })

  it("reports pending, failed and unknown payments without recording", async () => {
    const claim = await createClaim(secret)
    const metadata = { claim: claim.nonce }

    mocks.retrieve.mockResolvedValueOnce(
      payment({ status: "processing", metadata })
    )
    expect(
      await claimPurchase(env, db, {
        paymentId: "pay_1",
        token: claim.token,
        userId: null,
      })
    ).toEqual({ status: "pending" })

    mocks.retrieve.mockResolvedValueOnce(
      payment({ status: "failed", metadata })
    )
    expect(
      await claimPurchase(env, db, {
        paymentId: "pay_1",
        token: claim.token,
        userId: null,
      })
    ).toEqual({ status: "failed" })

    mocks.retrieve.mockRejectedValueOnce(new Error("404"))
    expect(
      await claimPurchase(env, db, {
        paymentId: "pay_1",
        token: claim.token,
        userId: null,
      })
    ).toEqual({ status: "not_found" })

    expect(await guests()).toEqual([])
    expect(await purchases()).toEqual([])
  })

  it("reports a purchase for analytics only once, even across the guest move", async () => {
    const claim = await createClaim(secret)
    await recordPayment(db, payment({ metadata: { claim: claim.nonce } }), env)
    await addUser("u1", "github@example.org")
    const input = { paymentId: "pay_1", token: claim.token }

    const first = await claimPurchase(env, db, { ...input, userId: null })
    const attached = await claimPurchase(env, db, { ...input, userId: "u1" })
    const again = await claimPurchase(env, db, { ...input, userId: "u1" })

    expect(first).toMatchObject({ report: true, account: "none" })
    expect(attached).toMatchObject({ report: false, account: "this" })
    expect(again).toMatchObject({ report: false })
  })

  it("doesn't report refunded purchases", async () => {
    const claim = await createClaim(secret)
    await recordPayment(db, payment({ metadata: { claim: claim.nonce } }), env)
    await revokePurchase(db, "pay_1", "refunded")

    expect(
      await claimPurchase(env, db, {
        paymentId: "pay_1",
        token: claim.token,
        userId: null,
      })
    ).toMatchObject({ status: "refunded", report: false })
  })
})
