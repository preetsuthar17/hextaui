import { Calendar } from "@/components/ui/calendar"

export function CalendarWeekNumbers() {
  return (
    <div className="w-fit max-w-full overflow-x-auto rounded-xl border">
      <Calendar mode="range" showWeekNumber ISOWeek showOutsideDays={false} />
    </div>
  )
}
