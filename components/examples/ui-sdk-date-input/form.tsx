"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { DateInput } from "@/components/ui/ui-sdk-date-input"
import { TimeInput } from "@/components/ui/ui-sdk-time-input"

function UiSdkDateInputForm() {
  const [submitted, setSubmitted] = React.useState<string | null>(null)

  return (
    <form
      className="flex w-full max-w-72 flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setSubmitted(`${data.get("date")} at ${data.get("time")}`)
      }}
    >
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <div className="flex min-w-0 flex-col gap-2">
          <Label id="booking-date">Date</Label>
          <DateInput
            aria-labelledby="booking-date"
            name="date"
            defaultValue="2026-11-02"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label id="booking-time">Time</Label>
          <TimeInput
            aria-labelledby="booking-time"
            name="time"
            defaultValue="09:30"
            required
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm">
          Book
        </Button>
        <Button type="reset" size="sm" variant="ghost">
          Reset
        </Button>
      </div>
      <p className="m-0 text-sm text-muted-foreground tabular-nums">
        {submitted ? `Submitted ${submitted}` : "Nothing submitted yet."}
      </p>
    </form>
  )
}

export { UiSdkDateInputForm }
