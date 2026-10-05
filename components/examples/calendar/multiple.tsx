import { Calendar } from "@/components/ui/calendar"

export function CalendarMultiple() {
  return (
    <div className="w-fit max-w-full overflow-x-auto rounded-xl border">
      <Calendar mode="multiple" max={5} footer="Pick up to five days." />
    </div>
  )
}
