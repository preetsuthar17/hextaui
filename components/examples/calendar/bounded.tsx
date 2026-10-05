"use client"

import { addDays, startOfMonth } from "date-fns"

import { Calendar } from "@/components/ui/calendar"
import { useToday } from "@/hooks/use-today"

export function CalendarBounded() {
  const today = useToday()
  const last = today && addDays(today, 45)

  return (
    <div className="w-fit max-w-full overflow-x-auto rounded-xl border">
      <Calendar
        mode="single"
        startMonth={today && startOfMonth(today)}
        endMonth={last && startOfMonth(last)}
        disabled={
          today && last ? [{ before: today }, { after: last }] : undefined
        }
        footer="Bookable for the next 45 days."
      />
    </div>
  )
}
