import { Calendar } from "@/components/ui/calendar"

export function CalendarDropdowns() {
  return (
    <div className="w-fit max-w-full overflow-x-auto rounded-xl border">
      <Calendar
        mode="single"
        captionLayout="dropdown"
        startMonth={new Date(1940, 0)}
        endMonth={new Date(2035, 11)}
        defaultMonth={new Date(1995, 5)}
      />
    </div>
  )
}
