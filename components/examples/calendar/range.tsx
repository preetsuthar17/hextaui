"use client"

import * as React from "react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"

export function CalendarRange() {
  const [range, setRange] = React.useState<DateRange>()

  return (
    <div className="max-w-full overflow-x-auto rounded-xl border">
      <Calendar
        mode="range"
        numberOfMonths={2}
        selected={range}
        onSelect={setRange}
        footer={
          range?.from && range.to
            ? `${format(range.from, "PP")} – ${format(range.to, "PP")}`
            : range?.from
              ? "Pick an end date."
              : "Pick a start date."
        }
      />
    </div>
  )
}
