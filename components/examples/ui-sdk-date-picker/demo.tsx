import {
  DatePicker,
  DatePickerClear,
  DatePickerContent,
  DatePickerControl,
  DatePickerHint,
  DatePickerInput,
  DatePickerTrigger,
} from "@/components/ui/ui-sdk-date-picker"

function UiSdkDatePickerDemo() {
  return (
    <DatePicker defaultValue="2026-11-20" className="max-w-56">
      <DatePickerControl>
        <DatePickerInput aria-label="Due date" />
        <DatePickerClear />
        <DatePickerTrigger />
      </DatePickerControl>
      <DatePickerHint />
      <DatePickerContent />
    </DatePicker>
  )
}

export { UiSdkDatePickerDemo }
