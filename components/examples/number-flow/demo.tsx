"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { NumberFlow } from "@/components/ui/number-flow"

export function NumberFlowDemo() {
  const [value, setValue] = React.useState(22)

  return (
    <div className="flex flex-col items-center gap-6">
      <NumberFlow
        value={value}
        className="text-5xl font-semibold tracking-tight"
      />
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setValue(value - 1)}>
          −1
        </Button>
        <Button variant="outline" size="sm" onClick={() => setValue(value + 1)}>
          +1
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setValue(value + 111)}
        >
          +111
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setValue(Math.floor(Math.random() * 100000))}
        >
          Random
        </Button>
      </div>
    </div>
  )
}
