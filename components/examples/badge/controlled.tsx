"use client"

import * as React from "react"

import { Badge, BadgeClose } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function BadgeControlled() {
  const [open, setOpen] = React.useState(true)

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Badge variant="warning" open={open} onOpenChange={setOpen}>
        Beta features on
        <BadgeClose />
      </Badge>
      <Button
        variant="outline"
        size="sm"
        disabled={open}
        onClick={() => setOpen(true)}
      >
        Restore
      </Button>
    </div>
  )
}
