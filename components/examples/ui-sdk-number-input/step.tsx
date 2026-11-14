import { Label } from "@/components/ui/label"
import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
} from "@/components/ui/ui-sdk-number-input"

function UiSdkNumberInputStep() {
  return (
    <div className="grid w-full max-w-sm grid-cols-2 gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="temperature">Temperature</Label>
        <NumberInput
          defaultValue={0.7}
          min={0}
          max={2}
          step={0.1}
          largeStep={0.5}
          smallStep={0.01}
        >
          <NumberInputGroup>
            <NumberInputDecrement />
            <NumberInputControl id="temperature" />
            <NumberInputIncrement />
          </NumberInputGroup>
        </NumberInput>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="max-tokens">Max tokens</Label>
        <NumberInput
          defaultValue={4096}
          min={256}
          max={32768}
          step={256}
          largeStep={4096}
        >
          <NumberInputGroup>
            <NumberInputDecrement />
            <NumberInputControl id="max-tokens" />
            <NumberInputIncrement />
          </NumberInputGroup>
        </NumberInput>
      </div>
    </div>
  )
}

export { UiSdkNumberInputStep }
