"use client"

import * as React from "react"

import {
  isSaleActive,
  proPlans,
  sale,
  type SalePlanId,
} from "@/lib/pro/pricing"

const builtAt = Date.parse(process.env.NEXT_PUBLIC_BUILT_AT ?? "")

function subscribe(onChange: () => void) {
  const left = Date.parse(sale.endsAt) - Date.now()
  if (left <= 0 || left > 2 ** 31 - 1) return () => {}
  const timer = setTimeout(onChange, left + 1000)
  return () => clearTimeout(timer)
}

function getSnapshot() {
  return isSaleActive()
}

function getServerSnapshot() {
  return Number.isNaN(builtAt) ? isSaleActive() : isSaleActive(builtAt)
}

function useSaleActive() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

function usePlanPrice(plan: SalePlanId) {
  return useSaleActive() ? sale.prices[plan] : proPlans[plan].price
}

export { usePlanPrice, useSaleActive }
