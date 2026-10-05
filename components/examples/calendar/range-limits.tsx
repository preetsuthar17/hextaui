import { Calendar } from "@/components/ui/calendar"

export function CalendarRangeLimits() {
  return (
    <div className="w-fit max-w-full overflow-x-auto rounded-xl border">
      <Calendar
        mode="range"
        min={2}
        max={7}
        disabled={{ dayOfWeek: [0, 6] }}
        excludeDisabled
        footer="Weekdays only, 2–7 days."
      />
    </div>
  )
}
