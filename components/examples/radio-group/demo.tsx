import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const options = [
  { value: "all", label: "All new messages" },
  { value: "mentions", label: "Direct messages and mentions" },
  { value: "none", label: "Nothing" },
]

export function RadioGroupDemo() {
  return (
    <RadioGroup
      aria-label="Notify me about"
      defaultValue="mentions"
      className="w-fit"
    >
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-3 text-sm">
          <RadioGroupItem value={option.value} />
          {option.label}
        </label>
      ))}
    </RadioGroup>
  )
}
