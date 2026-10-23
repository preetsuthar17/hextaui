"use client"

import { useSyncExternalStore } from "react"

import { isEarlyBird, proPlans } from "@/lib/pro/pricing"

const builtAt = new Date(process.env.NEXT_PUBLIC_BUILT_AT ?? Date.now())

function subscribe() {
  return () => {}
}

function useEarlyBird() {
  return useSyncExternalStore(
    subscribe,
    () => isEarlyBird(),
    () => isEarlyBird(builtAt)
  )
}

function useSoloPrice() {
  const early = useEarlyBird()
  return early ? proPlans.solo.earlyPrice : proPlans.solo.price
}

export { useEarlyBird, useSoloPrice }
