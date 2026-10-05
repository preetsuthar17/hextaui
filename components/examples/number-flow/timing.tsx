"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { NumberFlow } from "@/components/ui/number-flow"

export function NumberFlowTiming() {
  const [value, setValue] = React.useState(128)

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex flex-col gap-1 rounded-lg border p-3">
          <span className="text-xs text-muted-foreground">200ms</span>
          <NumberFlow
            value={value}
            duration={200}
            className="text-2xl font-semibold"
          />
        </div>
        <div className="flex flex-col gap-1 rounded-lg border p-3">
          <span className="text-xs text-muted-foreground">600ms</span>
          <NumberFlow value={value} className="text-2xl font-semibold" />
        </div>
        <div className="flex flex-col gap-1 rounded-lg border p-3">
          <span className="text-xs text-muted-foreground">1200ms</span>
          <NumberFlow
            value={value}
            duration={1200}
            easing="ease-in-out"
            className="text-2xl font-semibold"
          />
        </div>
        <div className="flex flex-col gap-1 rounded-lg border p-3">
          <span className="text-xs text-muted-foreground">Off</span>
          <NumberFlow
            value={value}
            animated={false}
            className="text-2xl font-semibold"
          />
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="self-start"
        onClick={() => setValue(value + 37)}
      >
        +37
      </Button>
    </div>
  )
}
