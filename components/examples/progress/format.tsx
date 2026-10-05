"use client"

import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

export function ProgressFormat() {
  return (
    <div className="w-full max-w-sm">
      <Progress
        value={37.5}
        max={50}
        format={{ maximumFractionDigits: 1 }}
        getAriaValueText={(formatted) => `${formatted} of 50 GB used`}
      >
        <ProgressLabel>Storage</ProgressLabel>
        <ProgressValue>{(formatted) => `${formatted} of 50 GB`}</ProgressValue>
      </Progress>
    </div>
  )
}
