import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

export function SwitchField() {
  return (
    <Field orientation="horizontal" className="w-full max-w-sm">
      <FieldContent>
        <FieldLabel>Marketing emails</FieldLabel>
        <FieldDescription>
          Product news and offers, about once a month.
        </FieldDescription>
      </FieldContent>
      <Switch name="marketing" />
    </Field>
  )
}
