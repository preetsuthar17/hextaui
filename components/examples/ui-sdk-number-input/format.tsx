import { Label } from "@/components/ui/label"
import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputStepper,
} from "@/components/ui/ui-sdk-number-input"

const fields = [
  {
    id: "price",
    label: "Price",
    defaultValue: 19.99,
    step: 0.01,
    format: { style: "currency", currency: "USD" },
  },
  {
    id: "discount",
    label: "Discount",
    defaultValue: 0.15,
    step: 0.01,
    format: { style: "percent" },
  },
  {
    id: "weight",
    label: "Weight",
    defaultValue: 2.5,
    step: 0.1,
    format: { style: "unit", unit: "kilogram" },
  },
] satisfies {
  id: string
  label: string
  defaultValue: number
  step: number
  format: Intl.NumberFormatOptions
}[]

function UiSdkNumberInputFormat() {
  return (
    <div className="flex w-full max-w-44 flex-col gap-4">
      {fields.map(({ id, label, ...options }) => (
        <div key={id} className="flex flex-col gap-2">
          <Label htmlFor={id}>{label}</Label>
          <NumberInput {...options} min={0} locale="en-US">
            <NumberInputGroup variant="stacked">
              <NumberInputControl id={id} />
              <NumberInputStepper>
                <NumberInputIncrement />
                <NumberInputDecrement />
              </NumberInputStepper>
            </NumberInputGroup>
          </NumberInput>
        </div>
      ))}
    </div>
  )
}

export { UiSdkNumberInputFormat }
