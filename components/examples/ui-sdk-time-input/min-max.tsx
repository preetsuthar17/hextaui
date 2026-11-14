"use client"

import * as React from "react"

import { Label } from "@/components/ui/label"
import { TimeInput } from "@/components/ui/ui-sdk-time-input"

const opens = "09:00"
const closes = "17:30"

function UiSdkTimeInputMinMax() {
  const [time, setTime] = React.useState<string | null>("16:00")
  const outside = time !== null && (time < opens || time > closes)

  return (
    <div className="flex w-full max-w-40 flex-col gap-2">
      <Label id="pickup-time">Pickup</Label>
      <TimeInput
        aria-labelledby="pickup-time"
        aria-describedby="pickup-time-message"
        defaultValue="16:00"
        min={opens}
        max={closes}
        hourCycle={24}
        onValueChange={(value) => setTime(value)}
      />
      <p
        id="pickup-time-message"
        className={
          outside
            ? "m-0 text-xs text-destructive"
            : "m-0 text-xs text-muted-foreground"
        }
      >
        {outside ? "We’re closed then." : "Open 09:00 to 17:30."}
      </p>
    </div>
  )
}

export { UiSdkTimeInputMinMax }
