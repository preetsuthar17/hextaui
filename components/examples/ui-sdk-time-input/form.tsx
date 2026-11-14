"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { TimeInput } from "@/components/ui/ui-sdk-time-input"

function UiSdkTimeInputForm() {
  const [submitted, setSubmitted] = React.useState<string | null>(null)

  return (
    <form
      className="flex w-full max-w-40 flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setSubmitted(String(data.get("reminder")))
      }}
    >
      <div className="flex flex-col gap-2">
        <Label id="reminder-time">Remind me at</Label>
        <TimeInput
          aria-labelledby="reminder-time"
          name="reminder"
          defaultValue="08:15"
          required
        />
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm">
          Save
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

export { UiSdkTimeInputForm }
