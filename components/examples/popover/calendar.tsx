"use client"

import * as React from "react"
import { IconCalendar } from "@tabler/icons-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function PopoverCalendar() {
  const [date, setDate] = React.useState<Date>()
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button variant="outline" />}>
        <IconCalendar />
        {date ? format(date, "PPP") : "Pick a date"}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(next) => {
            setDate(next)
            setOpen(false)
          }}
          defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  )
}
