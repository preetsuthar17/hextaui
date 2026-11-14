import { Label } from "@/components/ui/label"
import { TimeInput } from "@/components/ui/ui-sdk-time-input"

function UiSdkTimeInputDisabled() {
  return (
    <div className="flex w-full max-w-40 flex-col gap-2">
      <Label id="closed-time">Last entry</Label>
      <TimeInput aria-labelledby="closed-time" defaultValue="22:00" disabled />
    </div>
  )
}

export { UiSdkTimeInputDisabled }
