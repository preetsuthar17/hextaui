import { proPlans, type ProPlanId } from "@/lib/pro/pricing"
import { track } from "@/lib/track"

type CompletedPurchase = {
  paymentId: string
  plan: ProPlanId
  amount: number
  currency: string
}

type Gtag = (command: "event", name: string, params: object) => void

const trackedKey = "hextaui-tracked-purchases"
const consentKey = "hextaui-analytics-consent"

function majorAmount(amount: number, currency: string) {
  let digits = 2
  try {
    digits =
      new Intl.NumberFormat("en", {
        style: "currency",
        currency,
      }).resolvedOptions().maximumFractionDigits ?? 2
  } catch {}
  return amount / 10 ** digits
}

function readTracked(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(trackedKey) ?? "[]")
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function markTracked(paymentId: string) {
  try {
    localStorage.setItem(
      trackedKey,
      JSON.stringify([...readTracked(), paymentId].slice(-20))
    )
  } catch {}
}

function loadedGtag() {
  try {
    if (localStorage.getItem(consentKey) !== "granted") return null
  } catch {
    return null
  }
  const gtag = (window as unknown as { gtag?: Gtag }).gtag
  return typeof gtag === "function" ? gtag : null
}

function trackPurchaseCompleted(purchase: CompletedPurchase) {
  if (readTracked().includes(purchase.paymentId)) return false
  markTracked(purchase.paymentId)

  const value = majorAmount(purchase.amount, purchase.currency)
  track("Purchase completed", {
    plan: purchase.plan,
    value: String(value),
    currency: purchase.currency,
  })

  try {
    loadedGtag()?.("event", "purchase", {
      transaction_id: purchase.paymentId,
      value,
      currency: purchase.currency,
      items: [
        {
          item_id: purchase.plan,
          item_name: `HextaUI Pro ${proPlans[purchase.plan].name}`,
          price: value,
          quantity: 1,
        },
      ],
    })
  } catch {}
  return true
}

export { majorAmount, trackPurchaseCompleted, type CompletedPurchase }
