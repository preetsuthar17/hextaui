import { IconCalendar } from "@tabler/icons-react"

import { Label } from "@/components/ui/label"
import { DateInput, DateInputSegments } from "@/components/ui/ui-sdk-date-input"

function UiSdkDateInputRtl() {
  return (
    <div dir="rtl" lang="ar" className="flex w-full max-w-44 flex-col gap-2">
      <Label id="rtl-date">تاريخ البدء</Label>
      <DateInput
        aria-labelledby="rtl-date"
        locale="ar-EG"
        defaultValue="2026-11-02"
      >
        <IconCalendar aria-hidden="true" />
        <DateInputSegments />
      </DateInput>
    </div>
  )
}

export { UiSdkDateInputRtl }
