"use client"

import { addDays } from "date-fns"

import { Calendar } from "@/components/ui/calendar"
import { useToday } from "@/hooks/use-today"

export function UseTodayBounds() {
  const today = useToday()

  return (
    <Calendar
      mode="single"
      disabled={today ? [{ before: today }, { after: addDays(today, 30) }] : []}
    />
  )
}
