"use client"

import { IconDeviceFloppy } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

async function fail(ms: number) {
  await wait(ms)
  throw new Error("Request failed")
}

export function ButtonIconFeedback() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        feedback
        size="icon"
        variant="outline"
        aria-label="Save"
        onClick={() => wait(900)}
      >
        <IconDeviceFloppy />
      </Button>
      <Button
        feedback
        size="icon"
        variant="outline"
        aria-label="Save"
        onClick={() => fail(900)}
      >
        <IconDeviceFloppy />
      </Button>
    </div>
  )
}
