"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  useButtonFeedback,
  type ButtonStatus,
} from "@/hooks/use-button-feedback"

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function RequestButton({
  ms,
  onStatus,
}: {
  ms: number
  onStatus: (entry: string) => void
}) {
  const { buttonProps, track } = useButtonFeedback({
    onStatusChange: (status: ButtonStatus) => onStatus(`${ms}ms: ${status}`),
  })

  return (
    <Button
      {...buttonProps}
      variant="outline"
      successLabel="Done"
      onClick={() => track(wait(ms))}
    >
      {ms >= 1000 ? `${ms / 1000}s` : `${ms}ms`} request
    </Button>
  )
}

export function UseButtonFeedbackFast() {
  const [log, setLog] = React.useState<string[]>([])
  const push = React.useCallback(
    (entry: string) => setLog((entries) => [...entries.slice(-3), entry]),
    []
  )

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-4">
      <div className="flex gap-2">
        <RequestButton ms={80} onStatus={push} />
        <RequestButton ms={1200} onStatus={push} />
      </div>
      <ol className="flex min-h-20 flex-col items-center gap-0.5 font-mono text-xs text-muted-foreground">
        {log.map((entry, index) => (
          <li key={index}>{entry}</li>
        ))}
      </ol>
    </div>
  )
}
