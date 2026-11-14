"use client"

import * as React from "react"

import { Label } from "@/components/ui/label"
import { DateInput } from "@/components/ui/ui-sdk-date-input"

function isWeekend(date: string) {
  const day = new Date(`${date}T12:00`).getDay()
  return day === 0 || day === 6
}

function UiSdkDateInputUnavailable() {
  const [date, setDate] = React.useState<string | null>("2026-11-02")
  const weekend = date !== null && isWeekend(date)

  return (
    <div className="flex w-full max-w-44 flex-col gap-2">
      <Label id="delivery-date">Delivery date</Label>
      <DateInput
        aria-labelledby="delivery-date"
        aria-describedby="delivery-date-message"
        defaultValue="2026-11-02"
        unavailable={{ weekday: [0, 6] }}
        onValueChange={(value) => setDate(value)}
      />
      <p
        id="delivery-date-message"
        className={
          weekend
            ? "m-0 text-xs text-destructive"
            : "m-0 text-xs text-muted-foreground"
        }
      >
        {weekend
          ? "We don’t deliver on weekends."
          : "We deliver Monday to Friday."}
      </p>
    </div>
  )
}

export { UiSdkDateInputUnavailable }
