import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function FieldInput() {
  return (
    <Field className="max-w-sm">
      <FieldLabel>Username</FieldLabel>
      <Input placeholder="ada" autoComplete="username" />
      <FieldDescription>
        Shown on your profile. You can change it once a month.
      </FieldDescription>
    </Field>
  )
}
