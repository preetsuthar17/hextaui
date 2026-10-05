"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { DatePicker, DateRangePicker } from "@/components/ui/date-picker"

export function DatePickerForm() {
  const [submitted, setSubmitted] = React.useState<string>()

  return (
    <form
      className="flex flex-col items-start gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setSubmitted(JSON.stringify(Object.fromEntries(data)))
      }}
    >
      <DatePicker name="due" defaultValue={new Date(2026, 9, 14)} />
      <DateRangePicker
        name="stay"
        defaultValue={{
          from: new Date(2026, 9, 20),
          to: new Date(2026, 9, 24),
        }}
      />
      <Button type="submit">Submit</Button>
      <output className="text-sm break-all text-muted-foreground">
        {submitted ?? "Not submitted"}
      </output>
    </form>
  )
}
