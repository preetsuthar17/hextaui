import { Label } from "@/components/ui/label"
import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
} from "@/components/ui/ui-sdk-number-input"

function UiSdkNumberInputMinMax() {
  return (
    <div className="flex w-full max-w-40 flex-col gap-2">
      <Label htmlFor="guests">Guests</Label>
      <NumberInput defaultValue={2} min={1} max={8}>
        <NumberInputGroup>
          <NumberInputDecrement />
          <NumberInputControl id="guests" />
          <NumberInputIncrement />
        </NumberInputGroup>
      </NumberInput>
      <p className="m-0 text-xs text-muted-foreground">
        Tables seat 1 to 8 guests.
      </p>
    </div>
  )
}

export { UiSdkNumberInputMinMax }
