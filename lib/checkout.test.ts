import { beforeEach, describe, expect, it, vi } from "vitest"

import { onRequestPost } from "@/functions/api/checkout"
import { getDb, schema } from "@/lib/db"
import type { PaymentsEnv } from "@/lib/payments"
import { verifyClaim } from "@/lib/purchase-claim"
import { createSqliteD1 } from "@/lib/testing/sqlite-d1"

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  getSession: vi.fn(),
}))

vi.mock("dodopayments", () => ({
  default: class {
    checkoutSessions = { create: mocks.create }
  },
}))

vi.mock("@/lib/auth", () => ({
  getAuth: () => ({ api: { getSession: mocks.getSession } }),
}))

const secret = "test-secret-with-enough-entropy"

function makeEnv() {
  return {
    DB: createSqliteD1().d1,
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
}

function post(body: unknown, origin = "https://hextaui.com") {
  return new Request("https://hextaui.com/api/checkout", {
    method: "POST",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify(body),
  })
}

type CheckoutParams = {
  customer?: { email: string }
  metadata: Record<string, string>
  return_url: string
}

beforeEach(() => {
  mocks.create.mockReset()
  mocks.create.mockResolvedValue({ checkout_url: "https://checkout.dodo/x" })
  mocks.getSession.mockReset()
})

describe("POST /api/checkout", () => {
  it("rejects other origins", async () => {
    const response = await onRequestPost({
      request: post({ plan: "solo" }, "https://evil.example"),
      env: makeEnv(),
    })
    expect(response.status).toBe(403)
    expect(mocks.create).not.toHaveBeenCalled()
  })

  it("sends signed-out visitors straight to checkout with a claim link", async () => {
    mocks.getSession.mockResolvedValue(null)
    const response = await onRequestPost({
      request: post({ plan: "solo" }),
      env: makeEnv(),
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ url: "https://checkout.dodo/x" })
    const params = mocks.create.mock.calls[0][0] as CheckoutParams
    expect(params.customer).toBeUndefined()
    expect(params.metadata.user_id).toBeUndefined()
    expect(params.metadata.plan).toBe("solo")

    const returnUrl = new URL(params.return_url)
    expect(returnUrl.pathname).toBe("/account")
    expect(returnUrl.searchParams.get("checkout")).toBe("done")
    expect(
      await verifyClaim(
        secret,
        params.metadata.claim,
        returnUrl.searchParams.get("claim")
      )
    ).toBe(true)
  })

  it("keeps the user id and email for signed-in buyers", async () => {
    mocks.getSession.mockResolvedValue({
      user: { id: "u1", email: "ada@example.com", name: "Ada" },
    })
    await onRequestPost({ request: post({ plan: "team" }), env: makeEnv() })

    const params = mocks.create.mock.calls[0][0] as CheckoutParams
    expect(params.customer).toEqual({ email: "ada@example.com", name: "Ada" })
    expect(params.metadata).toMatchObject({ user_id: "u1", plan: "team" })
    expect(params.metadata.claim).toBeTruthy()
  })

  it("attaches the Minilytics visitor and session to the payment", async () => {
    mocks.getSession.mockResolvedValue({
      user: { id: "u1", email: "ada@example.com", name: "Ada" },
    })
    const request = post({ plan: "solo" })
    request.headers.set("cookie", "theme=dark; ml_vid=vid-1; ml_sid=sid-2")
    await onRequestPost({ request, env: makeEnv() })

    const params = mocks.create.mock.calls[0][0] as CheckoutParams
    expect(params.metadata).toMatchObject({
      user_id: "u1",
      plan: "solo",
      ml_visitor_id: "vid-1",
      ml_session_id: "sid-2",
    })
    expect(params.metadata.claim).toBeTruthy()
  })

  it("sends empty attribution when the tracker is blocked", async () => {
    mocks.getSession.mockResolvedValue(null)
    await onRequestPost({ request: post({ plan: "solo" }), env: makeEnv() })

    const params = mocks.create.mock.calls[0][0] as CheckoutParams
    expect(params.metadata.ml_visitor_id).toBe("")
    expect(params.metadata.ml_session_id).toBe("")
  })

  it("skips checkout for a plan the account already has", async () => {
    const env = makeEnv()
    const db = getDb(env.DB)
    await db.insert(schema.user).values({
      id: "u1",
      name: "Ada",
      email: "ada@example.com",
      emailVerified: true,
    })
    await db.insert(schema.purchase).values({
      id: "pay_1",
      userId: "u1",
      productId: "pdt_team",
      plan: "team",
      customerId: "cus_1",
      status: "paid",
      amount: 14900,
      currency: "USD",
    })
    mocks.getSession.mockResolvedValue({
      user: { id: "u1", email: "ada@example.com", name: "Ada" },
    })

    const response = await onRequestPost({
      request: post({ plan: "solo" }),
      env,
    })
    expect(await response.json()).toEqual({ url: "/account" })
    expect(mocks.create).not.toHaveBeenCalled()
  })

  it("rejects unknown plans", async () => {
    mocks.getSession.mockResolvedValue(null)
    const response = await onRequestPost({
      request: post({ plan: "enterprise" }),
      env: makeEnv(),
    })
    expect(response.status).toBe(400)
  })
})
