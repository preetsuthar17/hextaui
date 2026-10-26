import { whenMinilyticsSettled } from "@/lib/minilytics"
import type { ProPlanId } from "@/lib/pro/pricing"

type StoredClaim = {
  paymentId: string
  token: string
  savedAt: number
}

type ClaimResponse =
  | { status: "pending" | "failed" }
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
  | { status: "invalid" }

type CheckoutReturn = {
  checkoutDone: boolean
  paymentId: string | null
  claim: StoredClaim | null
}

const claimKey = "hextaui-claim"
const claimMaxAge = 1000 * 60 * 60 * 24 * 30
const returnParams = ["checkout", "claim", "payment_id", "status"]

function readStoredClaim(): StoredClaim | null {
  try {
    const value = JSON.parse(localStorage.getItem(claimKey) ?? "null")
    if (
      !value ||
      typeof value.paymentId !== "string" ||
      typeof value.token !== "string" ||
      typeof value.savedAt !== "number" ||
      Date.now() - value.savedAt > claimMaxAge
    ) {
      return null
    }
    return value
  } catch {
    return null
  }
}

function writeStoredClaim(claim: StoredClaim | null) {
  try {
    if (claim) localStorage.setItem(claimKey, JSON.stringify(claim))
    else localStorage.removeItem(claimKey)
  } catch {}
}

function takeCheckoutReturn(): CheckoutReturn {
  const url = new URL(window.location.href)
  const params = url.searchParams
  const checkoutDone = params.get("checkout") === "done"
  const paymentId = params.get("payment_id")
  const token = params.get("claim")
  const validPayment = paymentId?.startsWith("pay_") ? paymentId : null

  let claim = readStoredClaim()
  if (validPayment && token) {
    claim = {
      paymentId: validPayment,
      token,
      savedAt: Date.now(),
    }
    writeStoredClaim(claim)
  }

  if (params.has("claim")) {
    params.delete("claim")
    window.history.replaceState(null, "", url.pathname + url.search + url.hash)
  }
  if (returnParams.some((name) => params.has(name))) {
    const path = url.pathname
    whenMinilyticsSettled().then(() => {
      const current = new URL(window.location.href)
      if (current.pathname !== path) return
      returnParams.forEach((name) => current.searchParams.delete(name))
      window.history.replaceState(
        window.history.state,
        "",
        current.pathname + current.search + current.hash
      )
    })
  }

  return { checkoutDone, paymentId: validPayment, claim }
}

function claimHref(claim: StoredClaim) {
  const url = new URL("/account", window.location.origin)
  url.searchParams.set("claim", claim.token)
  url.searchParams.set("payment_id", claim.paymentId)
  return url.href
}

const inflight = new Map<string, Promise<ClaimResponse | null>>()

function postClaim(claim: StoredClaim) {
  const key = `${claim.paymentId}:${claim.token}`
  const existing = inflight.get(key)
  if (existing) return existing
  const request = sendClaim(claim).finally(() => inflight.delete(key))
  inflight.set(key, request)
  return request
}

async function sendClaim(claim: StoredClaim): Promise<ClaimResponse | null> {
  const response = await fetch("/api/claim", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ paymentId: claim.paymentId, token: claim.token }),
  }).catch(() => null)
  if (!response) return null
  if (response.status === 403 || response.status === 404) {
    return { status: "invalid" }
  }
  if (!response.ok) return null
  return (await response.json().catch(() => null)) as ClaimResponse | null
}

export {
  claimHref,
  postClaim,
  readStoredClaim,
  takeCheckoutReturn,
  writeStoredClaim,
  type CheckoutReturn,
  type ClaimResponse,
  type StoredClaim,
}
