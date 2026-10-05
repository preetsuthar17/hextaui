import {
  Field,
  FieldCounter,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function FieldCounterDemo() {
  return (
    <Field className="max-w-sm">
      <FieldLabel>Status</FieldLabel>
      <Input defaultValue="Shipping the field rework" maxLength={40} />
      <div className="flex items-baseline justify-between gap-3">
        <FieldDescription>Clears after 24 hours.</FieldDescription>
        <FieldCounter />
      </div>
    </Field>
  )
}
