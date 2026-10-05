import { DatePicker } from "@/components/ui/date-picker"

export function DatePickerDropdowns() {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="birthday" className="text-sm font-medium">
        Date of birth
      </label>
      <DatePicker
        id="birthday"
        placeholder="Select your birthday"
        calendarProps={{
          captionLayout: "dropdown",
          startMonth: new Date(1920, 0),
          endMonth: new Date(),
          disabled: { after: new Date() },
        }}
      />
    </div>
  )
}
