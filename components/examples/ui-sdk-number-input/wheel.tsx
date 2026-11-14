import { Label } from "@/components/ui/label"
import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
} from "@/components/ui/ui-sdk-number-input"

function UiSdkNumberInputWheel() {
  return (
    <div className="flex w-full max-w-40 flex-col gap-2">
      <Label htmlFor="hover-delay">Hover delay</Label>
      <NumberInput
        defaultValue={300}
        min={0}
        max={2000}
        step={50}
        wheel
        format={{ style: "unit", unit: "millisecond" }}
        locale="en-US"
      >
        <NumberInputGroup>
          <NumberInputDecrement />
          <NumberInputControl id="hover-delay" />
          <NumberInputIncrement />
        </NumberInputGroup>
      </NumberInput>
      <p className="m-0 text-xs text-muted-foreground">
        Focus it, then scroll over it.
      </p>
    </div>
  )
}

export { UiSdkNumberInputWheel }
