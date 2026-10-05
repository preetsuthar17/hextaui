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

export function ButtonCustomLabels() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        feedback
        loadingLabel="Saving…"
        successLabel="Saved"
        errorLabel="Couldn’t save"
        onClick={() => wait(1200)}
      >
        <IconDeviceFloppy data-icon="inline-start" />
        Save
      </Button>
      <Button
        feedback
        variant="outline"
        loadingLabel="Saving…"
        successLabel="Saved"
        errorLabel="Couldn’t save"
        onClick={() => fail(1200)}
      >
        <IconDeviceFloppy data-icon="inline-start" />
        Save
      </Button>
    </div>
  )
}
