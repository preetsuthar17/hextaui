"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

export function ToastAction() {
  const [archived, setArchived] = React.useState(0)

  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        variant="outline"
        onClick={() => {
          setArchived((count) => count + 1)
          toast("Conversation archived", {
            action: {
              label: "Undo",
              onClick: () => setArchived((count) => count - 1),
            },
          })
        }}
      >
        Archive
      </Button>
      <p className="text-sm text-muted-foreground tabular-nums">
        {archived} archived
      </p>
    </div>
  )
}
