"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { NumberFlow } from "@/components/ui/number-flow"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

export function ProgressNumberFlow() {
  const [value, setValue] = React.useState(42)

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <Progress value={value}>
        <ProgressLabel>Course completed</ProgressLabel>
        <ProgressValue>
          {(_, current) => <NumberFlow value={current ?? 0} suffix="%" />}
        </ProgressValue>
      </Progress>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setValue(Math.max(0, value - 13))}
        >
          −13
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setValue(Math.min(100, value + 13))}
        >
          +13
        </Button>
      </div>
    </div>
  )
}
