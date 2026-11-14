import { Label } from "@/components/ui/label"
import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputScrubArea,
  NumberInputScrubAreaCursor,
} from "@/components/ui/ui-sdk-number-input"

function UiSdkNumberInputDemo() {
  return (
    <NumberInput defaultValue={1} min={1} max={99} className="max-w-36">
      <NumberInputScrubArea pixelsPerStep={6}>
        <Label htmlFor="demo-quantity">Quantity</Label>
        <NumberInputScrubAreaCursor />
      </NumberInputScrubArea>
      <NumberInputGroup>
        <NumberInputDecrement />
        <NumberInputControl id="demo-quantity" />
        <NumberInputIncrement />
      </NumberInputGroup>
    </NumberInput>
  )
}

export { UiSdkNumberInputDemo }
