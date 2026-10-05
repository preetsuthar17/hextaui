"use client"

import * as React from "react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const views = ["Board", "List", "Calendar"]

export function ToggleGroupControlled() {
  const [view, setView] = React.useState("Board")

  return (
    <div className="flex flex-col items-center gap-3">
      <ToggleGroup
        variant="outline"
        aria-label="View"
        value={[view]}
        onValueChange={(value) => {
          if (value.length > 0) {
            setView(value[0])
          }
        }}
      >
        {views.map((item) => (
          <ToggleGroupItem key={item} value={item}>
            {item}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <p className="text-sm text-muted-foreground">Showing the {view} view.</p>
    </div>
  )
}
