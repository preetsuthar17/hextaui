"use client"

import * as React from "react"

import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerControl,
  DatePickerInput,
  DatePickerPreset,
  DatePickerSeparator,
  DatePickerTrigger,
} from "@/components/ui/ui-sdk-date-picker"

function isoDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

function daysAgo(days: number) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return isoDate(date)
}

function UiSdkDatePickerPresets() {
  const [today, setToday] = React.useState<string | null>(null)

  React.useEffect(() => {
    setToday(isoDate(new Date()))
  }, [])

  const presets = today
    ? [
        { label: "Today", value: [today, today] as [string, string] },
        {
          label: "Last 7 days",
          value: [daysAgo(6), today] as [string, string],
        },
        {
          label: "Last 30 days",
          value: [daysAgo(29), today] as [string, string],
        },
        {
          label: "Last 90 days",
          value: [daysAgo(89), today] as [string, string],
        },
      ]
    : []

  return (
    <DatePicker mode="range" className="max-w-72">
      <DatePickerControl>
        <DatePickerInput aria-label="From" />
        <DatePickerSeparator />
        <DatePickerInput end aria-label="To" />
        <DatePickerTrigger />
      </DatePickerControl>
      <DatePickerContent>
        <div className="flex flex-wrap gap-0.5 border-b pb-3 sm:w-32 sm:flex-col sm:flex-nowrap sm:border-e sm:border-b-0 sm:pe-3 sm:pb-0">
          {presets.map((preset) => (
            <DatePickerPreset key={preset.label} value={preset.value}>
              {preset.label}
            </DatePickerPreset>
          ))}
        </div>
        <DatePickerCalendar />
      </DatePickerContent>
    </DatePicker>
  )
}

export { UiSdkDatePickerPresets }
