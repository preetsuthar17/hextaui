"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { NumberFlow } from "@/components/ui/number-flow"

const pairs = [
  [22, 23],
  [14, 19],
  [99, 100],
  [19, 21],
]

export function NumberFlowChangedDigits() {
  const [value, setValue] = React.useState(22)

  return (
    <div className="flex flex-col items-center gap-6">
      <NumberFlow value={value} className="text-5xl font-semibold" />
      <div className="flex flex-wrap justify-center gap-2">
        {pairs.map(([from, to]) => (
          <Button
            key={`${from}-${to}`}
            variant="outline"
            size="sm"
            onClick={() => setValue(value === from ? to : from)}
          >
            {from} ↔ {to}
          </Button>
        ))}
      </div>
    </div>
  )
}
