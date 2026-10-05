"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

export function ProgressDemo() {
  const [value, setValue] = React.useState<number | null>(null)
  const [run, setRun] = React.useState(0)

  React.useEffect(() => {
    let current = 0
    let tick: ReturnType<typeof setInterval> | undefined
    const start = setTimeout(() => {
      setValue(0)
      tick = setInterval(() => {
        current = Math.min(100, current + Math.round(Math.random() * 12 + 3))
        setValue(current)
        if (current === 100) {
          clearInterval(tick)
        }
      }, 400)
    }, 1200)
    return () => {
      clearTimeout(start)
      clearInterval(tick)
    }
  }, [run])

  const label =
    value === null ? "Preparing…" : value === 100 ? "Uploaded" : "Uploading"

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <Progress value={value}>
        <ProgressLabel>{label}</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setValue(null)
          setRun(run + 1)
        }}
      >
        Restart
      </Button>
    </div>
  )
}
