"use client"

import * as React from "react"

import { Label } from "@/components/ui/label"
import { TimeInput } from "@/components/ui/ui-sdk-time-input"

function UiSdkTimeInputRange() {
  const [start, setStart] = React.useState<string | null>("13:00")
  const [end, setEnd] = React.useState<string | null>("12:30")
  const invalid = start !== null && end !== null && end <= start

  return (
    <div className="flex w-full max-w-72 flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-2">
          <Label id="shift-start">Starts</Label>
          <TimeInput
            aria-labelledby="shift-start"
            defaultValue="13:00"
            onValueChange={(value) => setStart(value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label id="shift-end">Ends</Label>
          <TimeInput
            aria-labelledby="shift-end"
            aria-describedby="shift-message"
            defaultValue="12:30"
            invalid={invalid}
            onValueChange={(value) => setEnd(value)}
          />
        </div>
      </div>
      <p
        id="shift-message"
        className={
          invalid
            ? "m-0 text-xs text-destructive"
            : "m-0 text-xs text-muted-foreground"
        }
      >
        {invalid ? "The shift has to end after it starts." : "One shift a day."}
      </p>
    </div>
  )
}

export { UiSdkTimeInputRange }
