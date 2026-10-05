"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useDelayedLoading } from "@/hooks/use-delayed-loading"

function Lane({ label, loading }: { label: string; loading: boolean }) {
  return (
    <div className="flex h-9 items-center justify-between gap-4 rounded-lg bg-muted px-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex size-4 items-center justify-center">
        {loading ? <Spinner /> : null}
      </span>
    </div>
  )
}

export function UseDelayedLoadingDemo() {
  const [loading, setLoading] = React.useState(false)
  const visible = useDelayedLoading(loading)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  const load = (ms: number) => {
    clearTimeout(timer.current)
    setLoading(true)
    timer.current = setTimeout(() => setLoading(false), ms)
  }

  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Lane label="loading" loading={loading} />
        <Lane label="useDelayedLoading(loading)" loading={visible} />
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="outline" size="sm" onClick={() => load(80)}>
          80ms
        </Button>
        <Button variant="outline" size="sm" onClick={() => load(220)}>
          220ms
        </Button>
        <Button variant="outline" size="sm" onClick={() => load(1500)}>
          1.5s
        </Button>
      </div>
    </div>
  )
}
