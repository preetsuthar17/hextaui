import {
  DatePicker,
  DatePickerContent,
  DatePickerControl,
  DatePickerInput,
  DatePickerTrigger,
} from "@/components/ui/ui-sdk-date-picker"

function UiSdkDatePickerDisabled() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-3">
      <DatePicker defaultValue="2026-11-20" disabled>
        <DatePickerControl>
          <DatePickerInput aria-label="Disabled date" />
          <DatePickerTrigger />
        </DatePickerControl>
        <DatePickerContent />
      </DatePicker>
      <DatePicker defaultValue="2026-11-20" readOnly>
        <DatePickerControl>
          <DatePickerInput aria-label="Read-only date" />
          <DatePickerTrigger />
        </DatePickerControl>
        <DatePickerContent />
      </DatePicker>
    </div>
  )
}

export { UiSdkDatePickerDisabled }
