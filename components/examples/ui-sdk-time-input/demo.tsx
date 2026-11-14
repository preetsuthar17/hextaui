import { IconClock } from "@tabler/icons-react"

import { Label } from "@/components/ui/label"
import { TimeInput, TimeInputSegments } from "@/components/ui/ui-sdk-time-input"

function UiSdkTimeInputDemo() {
  return (
    <div className="flex w-full max-w-40 flex-col gap-2">
      <Label id="meeting-time">Meeting time</Label>
      <TimeInput aria-labelledby="meeting-time" defaultValue="09:30">
        <IconClock aria-hidden="true" />
        <TimeInputSegments />
      </TimeInput>
    </div>
  )
}

export { UiSdkTimeInputDemo }
