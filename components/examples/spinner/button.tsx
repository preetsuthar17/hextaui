"use client"

import { IconRefresh } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

function save() {
  return new Promise((resolve) => setTimeout(resolve, 1600))
}

export function SpinnerButton() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button feedback loadingLabel="Saving…" onClick={save}>
        Save changes
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label="Refresh"
        feedback
        onClick={save}
      >
        <IconRefresh />
      </Button>
    </div>
  )
}
