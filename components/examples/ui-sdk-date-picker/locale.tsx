import {
  DatePicker,
  DatePickerContent,
  DatePickerControl,
  DatePickerHint,
  DatePickerInput,
  DatePickerTrigger,
} from "@/components/ui/ui-sdk-date-picker"

function UiSdkDatePickerLocale() {
  return (
    <DatePicker locale="de" defaultValue="2026-12-03" className="max-w-56">
      <DatePickerControl>
        <DatePickerInput aria-label="Lieferdatum" />
        <DatePickerTrigger aria-label="Datum wählen" />
      </DatePickerControl>
      <DatePickerHint />
      <DatePickerContent aria-label="Datum wählen" />
    </DatePicker>
  )
}

export { UiSdkDatePickerLocale }
