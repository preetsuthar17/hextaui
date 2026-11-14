import { IconCalendar } from "@tabler/icons-react"

import { Label } from "@/components/ui/label"
import { DateInput, DateInputSegments } from "@/components/ui/ui-sdk-date-input"

function UiSdkDateInputDemo() {
  return (
    <div className="flex w-full max-w-44 flex-col gap-2">
      <Label id="birthday">Birthday</Label>
      <DateInput aria-labelledby="birthday" name="birthday">
        <IconCalendar aria-hidden="true" />
        <DateInputSegments />
      </DateInput>
    </div>
  )
}

export { UiSdkDateInputDemo }
