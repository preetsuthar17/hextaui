"use client"

import { arSA } from "react-day-picker/locale"

import { Calendar } from "@/components/ui/calendar"

export function CalendarRtl() {
  return (
    <div dir="rtl" className="max-w-full min-w-0">
      <div className="w-fit max-w-full overflow-x-auto rounded-xl border">
        <Calendar mode="range" locale={arSA} dir="rtl" />
      </div>
    </div>
  )
}
