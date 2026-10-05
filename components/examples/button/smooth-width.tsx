"use client"

import { Button } from "@/components/ui/button"

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export function ButtonSmoothWidth() {
  return (
    <Button
      feedback
      loadingLabel="Publishing to 3 regions…"
      successLabel="Live"
      onClick={() => wait(1600)}
    >
      Publish
    </Button>
  )
}
