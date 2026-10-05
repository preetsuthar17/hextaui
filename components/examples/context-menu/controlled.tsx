"use client"

import * as React from "react"
import { IconCopy, IconScissors } from "@tabler/icons-react"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export function ContextMenuControlled() {
  const [open, setOpen] = React.useState(false)
  const [reason, setReason] = React.useState("—")

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <ContextMenu
        open={open}
        onOpenChange={(next, details) => {
          setOpen(next)
          setReason(details.reason)
        }}
      >
        <ContextMenuTrigger className="flex h-40 w-full items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
          Controlled area
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            <IconScissors />
            Cut
          </ContextMenuItem>
          <ContextMenuItem>
            <IconCopy />
            Copy
          </ContextMenuItem>
          <ContextMenuItem closeOnClick={false}>
            Stays open on click
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <p className="text-sm text-muted-foreground">
        Open: {String(open)} · last reason: {reason}
      </p>
    </div>
  )
}
