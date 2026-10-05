"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { NumberFlow, type NumberFlowTrend } from "@/components/ui/number-flow"

const trends: NumberFlowTrend[] = ["auto", "up", "down", "shortest"]

export function NumberFlowTrendDemo() {
  const [value, setValue] = React.useState(19)

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {trends.map((trend) => (
          <div
            key={trend}
            className="flex flex-col gap-1 rounded-lg border p-3"
          >
            <span className="text-xs text-muted-foreground">{trend}</span>
            <NumberFlow
              value={value}
              trend={trend}
              className="text-2xl font-semibold"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setValue(value === 19 ? 21 : 19)}
        >
          19 ↔ 21
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setValue(value === 19 ? 11 : 19)}
        >
          19 ↔ 11
        </Button>
      </div>
    </div>
  )
}
