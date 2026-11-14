import { Label } from "@/components/ui/label"
import { DateInput } from "@/components/ui/ui-sdk-date-input"

function UiSdkDateInputDisabled() {
  return (
    <div className="flex w-full max-w-44 flex-col gap-2">
      <Label id="start-date-disabled">Start date</Label>
      <DateInput
        aria-labelledby="start-date-disabled"
        defaultValue="2026-11-02"
        disabled
      />
    </div>
  )
}

export { UiSdkDateInputDisabled }
