"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

export function PopoverControlled() {
  const [open, setOpen] = React.useState(false)
  const [reason, setReason] = React.useState("none")

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-2">
        <Popover
          open={open}
          onOpenChange={(next, details) => {
            setOpen(next)
            setReason(details.reason)
          }}
        >
          <PopoverTrigger render={<Button variant="outline" />}>
            Controlled
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader>
              <PopoverTitle>Controlled</PopoverTitle>
              <PopoverDescription>
                The open state lives in the parent.
              </PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
        <Button variant="ghost" onClick={() => setOpen(!open)}>
          Toggle from outside
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Open: {String(open)} · Last reason: {reason}
      </p>
    </div>
  )
}
