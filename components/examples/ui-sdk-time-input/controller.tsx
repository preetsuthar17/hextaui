"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  TimeInput,
  createTimeInputController,
} from "@/components/ui/ui-sdk-time-input"

function now() {
  const date = new Date()
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`
}

function UiSdkTimeInputController() {
  const [controller] = React.useState(createTimeInputController)
  const [value, setValue] = React.useState<string | null>(null)

  return (
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label id="log-time">Logged at</Label>
      <TimeInput
        aria-labelledby="log-time"
        controller={controller}
        onValueChange={(next) => setValue(next)}
      />
      <div className="flex items-center gap-2 pt-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => controller.setValue(now())}
        >
          Now
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => controller.focus("minute")}
        >
          Edit minutes
        </Button>
        <Button size="sm" variant="ghost" onClick={() => controller.clear()}>
          Clear
        </Button>
      </div>
      <p className="m-0 text-xs text-muted-foreground tabular-nums">
        {value ? `Value ${value}` : "Value null"}
      </p>
    </div>
  )
}

export { UiSdkTimeInputController }
