"use client"

import * as React from "react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function CalendarSheet() {
  const [date, setDate] = React.useState<Date>()

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        {date ? format(date, "PPP") : "Choose a date"}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Schedule</SheetTitle>
          <SheetDescription>Pick a delivery day.</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}
