import { Checkbox, CheckboxGroup } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"

const options = [
  { value: "mentions", label: "Mentions" },
  { value: "replies", label: "Replies to my comments" },
  { value: "digest", label: "Weekly digest" },
]

export function FieldCheckbox() {
  return (
    <FieldSet className="w-full max-w-sm">
      <FieldLegend variant="label">Email me about</FieldLegend>
      <FieldDescription>Security alerts are always on.</FieldDescription>
      <CheckboxGroup defaultValue={["mentions", "replies"]}>
        {options.map((option) => (
          <Field key={option.value} orientation="horizontal">
            <Checkbox name="notifications" value={option.value} />
            <FieldLabel>{option.label}</FieldLabel>
          </Field>
        ))}
      </CheckboxGroup>
    </FieldSet>
  )
}
