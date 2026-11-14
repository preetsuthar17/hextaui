import { Label } from "@/components/ui/label"
import { DateInput } from "@/components/ui/ui-sdk-date-input"

function UiSdkDateInputDateTime() {
  return (
    <div className="flex w-full max-w-60 flex-col gap-2">
      <Label id="departure">Departure</Label>
      <DateInput
        aria-labelledby="departure"
        granularity="minute"
        defaultValue="2026-11-02T14:30"
        locale="en-US"
      />
    </div>
  )
}

export { UiSdkDateInputDateTime }
