"use client"

import { arSA } from "react-day-picker/locale"

import { DatePicker, DateRangePicker } from "@/components/ui/date-picker"

export function DatePickerRtl() {
  return (
    <div dir="rtl" className="flex flex-wrap justify-center gap-2">
      <DatePicker
        locale="ar"
        placeholder="اختر تاريخًا"
        title="اختر تاريخًا"
        clearLabel="مسح"
        clearable
        defaultValue={new Date(2026, 9, 2)}
        calendarProps={{ locale: arSA, dir: "rtl" }}
      />
      <DateRangePicker
        locale="ar"
        placeholder="اختر فترة"
        title="اختر فترة"
        calendarProps={{ locale: arSA, dir: "rtl" }}
      />
    </div>
  )
}
