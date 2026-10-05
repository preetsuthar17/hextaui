"use client"

import * as React from "react"

import { DatePicker } from "@/components/ui/date-picker"

function tomorrow() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 1)
  return date
}

export function DatePickerDisabledDays() {
  const [firstDay] = React.useState(tomorrow)

  return (
    <DatePicker
      placeholder="Delivery date"
      calendarProps={{
        disabled: [{ before: firstDay }, { dayOfWeek: [0, 6] }],
      }}
    />
  )
}
