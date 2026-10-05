import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

const sizes = ["sm", "default", "lg"] as const

export function NativeSelectSizes() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      {sizes.map((size) => (
        <div key={size} className="flex gap-2">
          <Input
            size={size}
            placeholder={`Input ${size}`}
            aria-label={`Input ${size}`}
          />
          <NativeSelect size={size} aria-label={`Select ${size}`}>
            <NativeSelectOption value="">{size}</NativeSelectOption>
            <NativeSelectOption value="a">Option A</NativeSelectOption>
          </NativeSelect>
        </div>
      ))}
    </div>
  )
}
