"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownMenuControlled() {
  const [open, setOpen] = React.useState(false)
  const [reason, setReason] = React.useState("none")

  return (
    <div className="flex flex-col items-center gap-3">
      <DropdownMenu
        open={open}
        onOpenChange={(next, details) => {
          setOpen(next)
          setReason(details.reason)
        }}
      >
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Controlled
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Closes the menu</DropdownMenuItem>
          <DropdownMenuItem closeOnClick={false}>Stays open</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <p className="text-sm text-muted-foreground">
        Open: {String(open)} · last reason: {reason}
      </p>
    </div>
  )
}
