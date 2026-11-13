import {
  DatePicker,
  DatePickerContent,
  DatePickerControl,
  DatePickerHint,
  DatePickerInput,
  DatePickerTrigger,
} from "@/components/ui/ui-sdk-date-picker"

function UiSdkDatePickerLimits() {
  return (
    <DatePicker
      min="2026-11-02"
      max="2026-12-18"
      unavailable={[{ weekday: [0, 6] }, "2026-11-26", "2026-11-27"]}
      defaultMonth="2026-11"
      className="max-w-56"
    >
      <DatePickerControl>
        <DatePickerInput aria-label="Delivery date" />
        <DatePickerTrigger />
      </DatePickerControl>
      <DatePickerHint />
      <DatePickerContent />
    </DatePicker>
  )
}

export { UiSdkDatePickerLimits }
