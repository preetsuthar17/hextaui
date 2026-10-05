"use client"

import { Button } from "@/components/ui/button"

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

async function fail(ms: number) {
  await wait(ms)
  throw new Error("Request failed")
}

export function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button feedback onClick={() => wait(900)}>
        Save changes
      </Button>
      <Button feedback variant="outline" onClick={() => fail(900)}>
        Request that fails
      </Button>
      <Button feedback variant="secondary" onClick={() => wait(80)}>
        Fast request
      </Button>
    </div>
  )
}
