"use client"

import * as React from "react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"

const steps = ["Reading files…", "Planning changes…", "Writing code…"]

export function ShimmerStatus() {
  const [step, setStep] = React.useState<number | null>(null)

  React.useEffect(() => {
    if (step === null || step >= steps.length) {
      return
    }
    const timer = setTimeout(() => setStep(step + 1), 1600)
    return () => clearTimeout(timer)
  }, [step])

  const done = step !== null && step >= steps.length

  return (
    <div className="flex flex-col items-center gap-4">
      <p
        key={step ?? "idle"}
        role="status"
        className={cn(
          "h-5 text-sm text-muted-foreground",
          step !== null && "shimmer",
          done && "shimmer-duration-1200 shimmer-once"
        )}
      >
        {step === null ? "Ready" : done ? "Done." : steps[step]}
      </p>
      <Button variant="outline" size="sm" onClick={() => setStep(0)}>
        Run task
      </Button>
    </div>
  )
}
