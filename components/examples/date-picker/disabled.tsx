import { DatePicker } from "@/components/ui/date-picker"

export function DatePickerDisabled() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <DatePicker disabled />
      <DatePicker disabled defaultValue={new Date(2026, 0, 1)} />
    </div>
  )
}
