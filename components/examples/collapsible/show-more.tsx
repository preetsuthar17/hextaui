"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  CollapsibleTriggerIcon,
} from "@/components/ui/collapsible"

export function CollapsibleShowMore() {
  const [open, setOpen] = React.useState(false)

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="flex max-w-md flex-col gap-3"
    >
      <p className="text-sm text-muted-foreground">
        HextaUI components are built on Base UI primitives and styled with
        Tailwind. You own the source, so every class can be changed.
      </p>
      <CollapsibleContent>
        <p className="text-sm text-muted-foreground">
          Motion is interruptible: clicking again mid-animation reverses from
          where the panel is instead of snapping. The gap between this paragraph
          and its neighbours collapses in the same animation, so nothing below
          jumps when it finishes.
        </p>
      </CollapsibleContent>
      <div>
        <CollapsibleTrigger render={<Button variant="outline" size="sm" />}>
          {open ? "Show less" : "Show more"}
          <CollapsibleTriggerIcon data-icon="inline-end" />
        </CollapsibleTrigger>
      </div>
    </Collapsible>
  )
}
