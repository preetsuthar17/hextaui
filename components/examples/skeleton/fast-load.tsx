"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonFastLoad() {
  const [loading, setLoading] = React.useState(true)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  function run() {
    clearTimeout(timer.current)
    setLoading(true)
    timer.current = setTimeout(() => setLoading(false), 80)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <Skeleton loading={loading}>
        <p className="text-sm">
          Loaded in 80ms, so the skeleton never became visible.
        </p>
      </Skeleton>
      <Button size="sm" onClick={run}>
        Run fast load
      </Button>
    </div>
  )
}
