"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { useToday } from "@/hooks/use-today"

export function CalendarControlled() {
  const today = useToday()
  const [month, setMonth] = React.useState<Date>()
  const [date, setDate] = React.useState<Date>()
  const shown = month ?? today

  return (
    <div className="flex max-w-full min-w-0 flex-col items-center gap-3">
      <div className="w-fit max-w-full overflow-x-auto rounded-xl border">
        <Calendar
          mode="single"
          month={shown}
          onMonthChange={setMonth}
          selected={date}
          onSelect={setDate}
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const now = new Date()
            setMonth(now)
            setDate(now)
          }}
        >
          Today
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const base = shown ?? new Date()
            setMonth(new Date(base.getFullYear() + 1, base.getMonth()))
          }}
        >
          Next year
        </Button>
      </div>
    </div>
  )
}
