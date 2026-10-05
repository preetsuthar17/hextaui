import {
  RadioGroup,
  RadioGroupCard,
  RadioGroupCardTitle,
} from "@/components/ui/radio-group"

const sizes = ["S", "M", "L", "XL"]

export function RadioGroupHorizontal() {
  return (
    <RadioGroup
      variant="card"
      aria-label="Size"
      defaultValue="M"
      className="w-full max-w-sm grid-cols-2 sm:grid-cols-4"
    >
      {sizes.map((size) => (
        <RadioGroupCard key={size} value={size}>
          <RadioGroupCardTitle>{size}</RadioGroupCardTitle>
        </RadioGroupCard>
      ))}
    </RadioGroup>
  )
}
