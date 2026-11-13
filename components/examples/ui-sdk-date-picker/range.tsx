import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerControl,
  DatePickerInput,
  DatePickerSeparator,
  DatePickerTrigger,
} from "@/components/ui/ui-sdk-date-picker"

function UiSdkDatePickerRange() {
  return (
    <DatePicker
      mode="range"
      months={2}
      pageBy="page"
      defaultValue={["2026-11-18", "2026-11-24"]}
      className="max-w-72"
    >
      <DatePickerControl>
        <DatePickerInput aria-label="Check-in" />
        <DatePickerSeparator />
        <DatePickerInput end aria-label="Check-out" />
        <DatePickerTrigger />
      </DatePickerControl>
      <DatePickerContent>
        <DatePickerCalendar months={2} />
      </DatePickerContent>
    </DatePicker>
  )
}

export { UiSdkDatePickerRange }
