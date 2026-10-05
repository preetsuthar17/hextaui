import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function RadioGroupStates() {
  return (
    <div className="flex flex-wrap gap-12 text-sm">
      <RadioGroup aria-label="Theme" defaultValue="system" className="w-fit">
        <label className="flex items-center gap-3">
          <RadioGroupItem value="light" />
          Light
        </label>
        <label className="flex items-center gap-3">
          <RadioGroupItem value="dark" disabled />
          Dark (coming soon)
        </label>
        <label className="flex items-center gap-3">
          <RadioGroupItem value="system" />
          System
        </label>
      </RadioGroup>
      <RadioGroup
        aria-label="Region"
        defaultValue="eu"
        readOnly
        className="w-fit"
      >
        <label className="flex items-center gap-3">
          <RadioGroupItem value="us" />
          United States
        </label>
        <label className="flex items-center gap-3">
          <RadioGroupItem value="eu" />
          Europe (locked)
        </label>
      </RadioGroup>
    </div>
  )
}
