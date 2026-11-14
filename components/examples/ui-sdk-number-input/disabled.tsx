import { Label } from "@/components/ui/label"
import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
} from "@/components/ui/ui-sdk-number-input"

function UiSdkNumberInputDisabled() {
  return (
    <div className="flex w-full max-w-40 flex-col gap-2">
      <Label htmlFor="sold-out">Quantity</Label>
      <NumberInput defaultValue={3} disabled>
        <NumberInputGroup>
          <NumberInputDecrement />
          <NumberInputControl id="sold-out" />
          <NumberInputIncrement />
        </NumberInputGroup>
      </NumberInput>
      <p className="m-0 text-xs text-muted-foreground">Sold out.</p>
    </div>
  )
}

export { UiSdkNumberInputDisabled }
