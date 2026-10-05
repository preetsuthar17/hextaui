"use client"

import * as React from "react"
import type { DateRange } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"

export function CalendarFixedToday() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2026, 1, 9),
    to: new Date(2026, 1, 17),
  })

  return (
    <div className="w-fit max-w-full overflow-x-auto rounded-xl border">
      <Calendar
        mode="range"
        today={new Date(2026, 1, 11)}
        defaultMonth={new Date(2026, 1)}
        selected={range}
        onSelect={setRange}
        animate={false}
      />
    </div>
  )
}
