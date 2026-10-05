"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export function HoverCardControlled() {
  const [open, setOpen] = React.useState(false)
  const [reason, setReason] = React.useState("none")

  return (
    <div className="flex flex-col items-center gap-3">
      <HoverCard
        open={open}
        onOpenChange={(next, details) => {
          setOpen(next)
          setReason(details.reason)
        }}
      >
        <HoverCardTrigger
          href="#"
          render={<Button variant="link" nativeButton={false} render={<a />} />}
        >
          Release notes
        </HoverCardTrigger>
        <HoverCardContent className="w-60">
          Version 2.0 rebuilds every component on Base UI.
        </HoverCardContent>
      </HoverCard>
      <p className="text-sm text-muted-foreground">
        Open: {String(open)} · last reason: {reason}
      </p>
    </div>
  )
}
