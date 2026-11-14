"use client"

import * as React from "react"

import { Label } from "@/components/ui/label"
import { DateInput } from "@/components/ui/ui-sdk-date-input"

const min = "2026-01-01"
const max = "2026-12-31"

function UiSdkDateInputMinMax() {
  const [date, setDate] = React.useState<string | null>("2026-06-15")
  const outside = date !== null && (date < min || date > max)

  return (
    <div className="flex w-full max-w-44 flex-col gap-2">
      <Label id="check-in">Check-in</Label>
      <DateInput
        aria-labelledby="check-in"
        aria-describedby="check-in-message"
        min={min}
        max={max}
        defaultValue="2026-06-15"
        onValueChange={(value) => setDate(value)}
      />
      <p
        id="check-in-message"
        className={
          outside
            ? "m-0 text-xs text-destructive"
            : "m-0 text-xs text-muted-foreground"
        }
      >
        {outside ? "Pick a day in 2026." : "Any day in 2026."}
      </p>
    </div>
  )
}

export { UiSdkDateInputMinMax }
