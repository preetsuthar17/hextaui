"use client"

import * as React from "react"
import { format } from "date-fns"

import { Calendar } from "@/components/ui/calendar"

export function CalendarDemo() {
  const [date, setDate] = React.useState<Date>()

  return (
    <div className="w-fit max-w-full overflow-x-auto rounded-xl border">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        footer={date ? `Selected ${format(date, "PPP")}.` : "Pick a day."}
      />
    </div>
  )
}
