"use client"

import * as React from "react"

import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

const zones = [
  { value: "America/New_York", label: "New York" },
  { value: "Europe/London", label: "London" },
  { value: "Asia/Kolkata", label: "Kolkata" },
  { value: "Asia/Tokyo", label: "Tokyo" },
]

export function NativeSelectControlled() {
  const [zone, setZone] = React.useState("Asia/Kolkata")
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: zone,
  }).format(new Date(Date.UTC(2026, 9, 4, 9, 0)))

  return (
    <div className="flex flex-col items-start gap-2">
      <NativeSelect
        aria-label="Time zone"
        value={zone}
        onChange={(event) => setZone(event.target.value)}
      >
        {zones.map((option) => (
          <NativeSelectOption key={option.value} value={option.value}>
            {option.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      <p className="text-sm text-muted-foreground">
        09:00 UTC is {time} there.
      </p>
    </div>
  )
}
