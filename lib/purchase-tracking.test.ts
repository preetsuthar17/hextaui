import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { readStoredClaim, takeCheckoutReturn } from "@/lib/claim-client"
import { minilyticsSettled } from "@/lib/minilytics"
import { majorAmount, trackPurchaseCompleted } from "@/lib/purchase-tracking"

type TestWindow = {
  stonks?: { event: ReturnType<typeof vi.fn> }
  gtag?: ReturnType<typeof vi.fn>
}

const testWindow = window as unknown as TestWindow

const purchase = {
  paymentId: "pay_1",
  plan: "solo" as const,
  amount: 4900,
  currency: "USD",
}

beforeEach(() => {
  localStorage.clear()
  testWindow.stonks = { event: vi.fn() }
})

afterEach(() => {
  delete testWindow.stonks
  delete testWindow.gtag
  window.history.replaceState(null, "", "/")
})

describe("trackPurchaseCompleted", () => {
  it("sends Purchase completed once per payment", () => {
    expect(trackPurchaseCompleted(purchase)).toBe(true)
    expect(trackPurchaseCompleted(purchase)).toBe(false)

    expect(testWindow.stonks!.event).toHaveBeenCalledTimes(1)
    expect(testWindow.stonks!.event).toHaveBeenCalledWith(
      "Purchase completed",
      "/",
      { plan: "solo", value: "49", currency: "USD" }
    )
  })

  it("sends a GA4 purchase only when GA is loaded under consent", () => {
    testWindow.gtag = vi.fn()
    trackPurchaseCompleted(purchase)
    expect(testWindow.gtag).not.toHaveBeenCalled()

    localStorage.setItem("hextaui-analytics-consent", "granted")
    trackPurchaseCompleted({ ...purchase, paymentId: "pay_2" })
    expect(testWindow.gtag).toHaveBeenCalledWith(
      "event",
      "purchase",
      expect.objectContaining({
        transaction_id: "pay_2",
        value: 49,
        currency: "USD",
      })
    )
  })

  it("never loads GA itself", () => {
    localStorage.setItem("hextaui-analytics-consent", "granted")
    trackPurchaseCompleted(purchase)
    expect(document.querySelector("script[src*='googletagmanager']")).toBe(null)
  })
})

describe("majorAmount", () => {
  it("respects each currency's decimals", () => {
    expect(majorAmount(4900, "USD")).toBe(49)
    expect(majorAmount(4900, "JPY")).toBe(4900)
    expect(majorAmount(408000, "INR")).toBe(4080)
  })
})

describe("takeCheckoutReturn", () => {
  it("stores the claim and strips it from the address bar", async () => {
    window.history.replaceState(
      null,
      "",
      "/account?checkout=done&claim=tok&payment_id=pay_9&status=succeeded"
    )
    const result = takeCheckoutReturn()

    expect(result.checkoutDone).toBe(true)
    expect(result.claim).toMatchObject({ paymentId: "pay_9", token: "tok" })
    expect(readStoredClaim()).toMatchObject({ paymentId: "pay_9" })
    expect(window.location.search).toBe(
      "?checkout=done&payment_id=pay_9&status=succeeded"
    )

    minilyticsSettled()
    await vi.waitFor(() => expect(window.location.search).toBe(""))
  })

  it("keeps a stored claim across a sign-in redirect", () => {
    window.history.replaceState(null, "", "/account?claim=tok&payment_id=pay_9")
    takeCheckoutReturn()
    window.history.replaceState(null, "", "/account")

    expect(takeCheckoutReturn().claim).toMatchObject({ paymentId: "pay_9" })
  })
})
