import { Field, FieldCounter, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

export function TextareaCounter() {
  return (
    <Field className="w-full max-w-sm">
      <div className="flex items-baseline justify-between gap-3">
        <FieldLabel>Bio</FieldLabel>
        <FieldCounter />
      </div>
      <Textarea name="bio" maxLength={160} minRows={2} />
    </Field>
  )
}
