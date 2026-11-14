import { Label } from "@/components/ui/label"
import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
} from "@/components/ui/ui-sdk-number-input"

function UiSdkNumberInputRtl() {
  return (
    <div dir="rtl" className="flex w-full max-w-44 flex-col gap-2">
      <Label htmlFor="rtl-amount">المبلغ</Label>
      <NumberInput
        defaultValue={250}
        min={0}
        step={5}
        locale="ar-EG"
        format={{ style: "currency", currency: "EGP" }}
      >
        <NumberInputGroup>
          <NumberInputDecrement aria-label="إنقاص" />
          <NumberInputControl id="rtl-amount" />
          <NumberInputIncrement aria-label="زيادة" />
        </NumberInputGroup>
      </NumberInput>
    </div>
  )
}

export { UiSdkNumberInputRtl }
