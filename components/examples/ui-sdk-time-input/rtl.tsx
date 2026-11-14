import { IconClock } from "@tabler/icons-react"

import { Label } from "@/components/ui/label"
import { TimeInput, TimeInputSegments } from "@/components/ui/ui-sdk-time-input"

function UiSdkTimeInputRtl() {
  return (
    <div dir="rtl" lang="ar" className="flex w-full max-w-40 flex-col gap-2">
      <Label id="rtl-time">وقت الاجتماع</Label>
      <TimeInput aria-labelledby="rtl-time" locale="ar-EG" defaultValue="18:45">
        <IconClock aria-hidden="true" />
        <TimeInputSegments />
      </TimeInput>
    </div>
  )
}

export { UiSdkTimeInputRtl }
