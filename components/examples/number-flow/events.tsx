"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { NumberFlow } from "@/components/ui/number-flow"

export function NumberFlowEvents() {
  const [value, setValue] = React.useState(1200)
  const [status, setStatus] = React.useState("Idle")
  const timers = React.useRef<number[]>([])

  React.useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((id) => window.clearTimeout(id))
  }, [])

  function burst() {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = Array.from({ length: 10 }, (_, index) =>
      window.setTimeout(
        () => setValue((current) => current + Math.ceil(Math.random() * 40)),
        index * 90
      )
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <NumberFlow
        value={value}
        onAnimationsStart={() => setStatus("Animating")}
        onAnimationsFinish={() => setStatus("Settled")}
        className="text-5xl font-semibold"
      />
      <span className="text-sm text-muted-foreground">{status}</span>
      <Button variant="outline" size="sm" onClick={burst}>
        Burst ×10
      </Button>
    </div>
  )
}
