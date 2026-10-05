"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"

function daysFromToday(days: number) {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + days)
  return date
}

const isoDay = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})

export function DatePickerControlled() {
  const [date, setDate] = React.useState<Date | null>(null)

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <DatePicker value={date} onValueChange={setDate} clearable />
      <Button variant="ghost" onClick={() => setDate(daysFromToday(0))}>
        Today
      </Button>
      <Button variant="ghost" onClick={() => setDate(daysFromToday(7))}>
        In a week
      </Button>
      <output className="text-sm text-muted-foreground tabular-nums">
        {date ? isoDay.format(date) : "null"}
      </output>
    </div>
  )
}
