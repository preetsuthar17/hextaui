import {
  DatePicker,
  DatePickerContent,
  DatePickerControl,
  DatePickerInput,
  DatePickerTrigger,
} from "@/components/ui/ui-sdk-date-picker"

function UiSdkDatePickerRtl() {
  return (
    <div dir="rtl" className="w-full max-w-56">
      <DatePicker locale="ar" defaultValue="2026-11-20">
        <DatePickerControl>
          <DatePickerInput aria-label="تاريخ الاستحقاق" />
          <DatePickerTrigger aria-label="اختر التاريخ" />
        </DatePickerControl>
        <DatePickerContent aria-label="اختر التاريخ" />
      </DatePicker>
    </div>
  )
}

export { UiSdkDatePickerRtl }
