import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

export function TextareaDemo() {
  return (
    <Field className="w-full max-w-sm">
      <FieldLabel>Feedback</FieldLabel>
      <Textarea placeholder="What could we do better? Keep typing — the box grows with you." />
      <FieldDescription>Grows with your text, then scrolls.</FieldDescription>
    </Field>
  )
}
