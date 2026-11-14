import { Label } from "@/components/ui/label"
import { TimeInput } from "@/components/ui/ui-sdk-time-input"

function UiSdkTimeInputReadOnly() {
  return (
    <div className="flex w-full max-w-40 flex-col gap-2">
      <Label id="checkout-time">Checkout</Label>
      <TimeInput
        aria-labelledby="checkout-time"
        defaultValue="11:00"
        readOnly
      />
    </div>
  )
}

export { UiSdkTimeInputReadOnly }
