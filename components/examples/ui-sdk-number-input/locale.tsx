import { Label } from "@/components/ui/label"
import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
} from "@/components/ui/ui-sdk-number-input"

const fields = [
  {
    id: "preis",
    label: "Preis",
    locale: "de-DE",
    defaultValue: 1234.5,
    step: 0.01,
    format: { style: "currency", currency: "EUR" },
  },
  {
    id: "budget",
    label: "Budget",
    locale: "en-IN",
    defaultValue: 1234567,
    step: 1000,
    format: { style: "currency", currency: "INR", maximumFractionDigits: 0 },
  },
  {
    id: "kakaku",
    label: "価格",
    locale: "ja-JP",
    defaultValue: 2980,
    step: 10,
    format: { style: "currency", currency: "JPY" },
  },
] satisfies {
  id: string
  label: string
  locale: string
  defaultValue: number
  step: number
  format: Intl.NumberFormatOptions
}[]

function UiSdkNumberInputLocale() {
  return (
    <div className="flex w-full max-w-52 flex-col gap-4">
      {fields.map(({ id, label, ...options }) => (
        <div key={id} className="flex flex-col gap-2">
          <Label htmlFor={id}>{label}</Label>
          <NumberInput {...options} min={0}>
            <NumberInputGroup>
              <NumberInputDecrement />
              <NumberInputControl id={id} />
              <NumberInputIncrement />
            </NumberInputGroup>
          </NumberInput>
        </div>
      ))}
    </div>
  )
}

export { UiSdkNumberInputLocale }
