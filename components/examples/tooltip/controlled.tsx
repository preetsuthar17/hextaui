"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function TooltipControlled() {
  const [open, setOpen] = React.useState(false)
  const [reason, setReason] = React.useState("none")

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <Tooltip
          open={open}
          onOpenChange={(next, details) => {
            setOpen(next)
            setReason(details.reason)
          }}
        >
          <TooltipTrigger render={<Button variant="outline" />}>
            Hover or focus me
          </TooltipTrigger>
          <TooltipContent>Controlled tooltip</TooltipContent>
        </Tooltip>
        <Button
          variant="ghost"
          onClick={() => {
            setOpen((value) => !value)
            setReason("button")
          }}
        >
          {open ? "Hide" : "Show"}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Open: {String(open)} · last reason: {reason}
      </p>
    </div>
  )
}
