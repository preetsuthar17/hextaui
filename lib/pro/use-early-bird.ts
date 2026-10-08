"use client"

import { useSyncExternalStore } from "react"

import { isEarlyBird } from "@/lib/pro/pricing"

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

export { useEarlyBird }
