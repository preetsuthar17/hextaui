"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  CollapsibleTriggerIcon,
} from "@/components/ui/collapsible"

export function CollapsibleControlled() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Open
        </Button>
        <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
          Close
        </Button>
        <span className="text-sm text-muted-foreground">
          {open ? "Open" : "Closed"}
        </span>
      </div>
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center justify-between gap-4 ps-4">
          <h4 className="text-sm font-semibold">Release notes</h4>
          <CollapsibleTrigger
            render={<Button variant="ghost" size="icon-sm" />}
            aria-label="Toggle release notes"
          >
            <CollapsibleTriggerIcon />
          </CollapsibleTrigger>
        </div>
        <div className="rounded-md border px-4 py-2 text-sm">v2.4.0</div>
        <CollapsibleContent className="flex flex-col gap-2">
          <div className="rounded-md border px-4 py-2 text-sm">v2.3.1</div>
          <div className="rounded-md border px-4 py-2 text-sm">v2.3.0</div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
