"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DatePicker,
  DatePickerContent,
  DatePickerControl,
  DatePickerHint,
  DatePickerInput,
  DatePickerTrigger,
} from "@/components/ui/ui-sdk-date-picker"

function UiSdkDatePickerForm() {
  const [submitted, setSubmitted] = React.useState<string | null>(null)

  return (
    <form
      className="flex w-full max-w-56 flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setSubmitted(String(data.get("start")))
      }}
    >
      <DatePicker name="start" required>
        <DatePickerControl>
          <DatePickerInput aria-label="Start date" />
          <DatePickerTrigger />
        </DatePickerControl>
        <DatePickerHint />
        <DatePickerContent />
      </DatePicker>
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm">
          Submit
        </Button>
        <Button type="reset" size="sm" variant="ghost">
          Reset
        </Button>
      </div>
      <p className="text-sm text-muted-foreground tabular-nums">
        {submitted ? `Submitted ${submitted}` : "Nothing submitted yet."}
      </p>
    </form>
  )
}

export { UiSdkDatePickerForm }
