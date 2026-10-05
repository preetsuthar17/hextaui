import { DateRangePicker } from "@/components/ui/date-picker"

export function DatePickerNarrow() {
  return (
    <div className="w-40">
      <DateRangePicker
        defaultValue={{
          from: new Date(2026, 0, 28),
          to: new Date(2026, 11, 3),
        }}
      />
    </div>
  )
}
