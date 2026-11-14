import { Label } from "@/components/ui/label"
import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
} from "@/components/ui/ui-sdk-number-input"

function UiSdkNumberInputReadOnly() {
  return (
    <div className="flex w-full max-w-40 flex-col gap-2">
      <Label htmlFor="included-seats">Seats included</Label>
      <NumberInput defaultValue={5} readOnly>
        <NumberInputGroup>
          <NumberInputDecrement />
          <NumberInputControl id="included-seats" />
          <NumberInputIncrement />
        </NumberInputGroup>
      </NumberInput>
      <p className="m-0 text-xs text-muted-foreground">Set by your plan.</p>
    </div>
  )
}

export { UiSdkNumberInputReadOnly }
