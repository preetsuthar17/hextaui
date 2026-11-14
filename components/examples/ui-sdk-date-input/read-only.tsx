import { Label } from "@/components/ui/label"
import { DateInput } from "@/components/ui/ui-sdk-date-input"

function UiSdkDateInputReadOnly() {
  return (
    <div className="flex w-full max-w-44 flex-col gap-2">
      <Label id="signed-on">Signed on</Label>
      <DateInput
        aria-labelledby="signed-on"
        defaultValue="2026-11-02"
        readOnly
      />
    </div>
  )
}

export { UiSdkDateInputReadOnly }
