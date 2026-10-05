"use client"

import * as React from "react"
import type { DateRange } from "react-day-picker"

import { DateRangePicker } from "@/components/ui/date-picker"

const isoDay = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})

export function DatePickerRange() {
  const [range, setRange] = React.useState<DateRange | null>(null)

  return (
    <div className="flex flex-col items-center gap-2">
      <DateRangePicker value={range} onValueChange={setRange} clearable />
      <output className="text-sm text-muted-foreground tabular-nums">
        {range?.from && range.to
          ? `${isoDay.format(range.from)} → ${isoDay.format(range.to)}`
          : "null"}
      </output>
    </div>
  )
}
