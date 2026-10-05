"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export function SpinnerDelayed() {
  const [loading, setLoading] = React.useState(false)

  const load = (ms: number) => {
    setLoading(true)
    setTimeout(() => setLoading(false), ms)
  }

  return (
    <div className="flex max-w-full min-w-0 flex-col items-center gap-4">
      <div className="flex size-8 items-center justify-center">
        <Spinner loading={loading} size="lg" />
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="outline" size="sm" onClick={() => load(100)}>
          Fast load (100ms)
        </Button>
        <Button variant="outline" size="sm" onClick={() => load(250)}>
          Load (250ms)
        </Button>
        <Button variant="outline" size="sm" onClick={() => load(2000)}>
          Slow load (2s)
        </Button>
      </div>
    </div>
  )
}
