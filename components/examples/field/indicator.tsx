import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function FieldIndicatorDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <FieldGroup indicator="optional">
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input type="email" autoComplete="email" required />
        </Field>
        <Field>
          <FieldLabel>Company</FieldLabel>
          <Input autoComplete="organization" />
        </Field>
      </FieldGroup>
      <FieldSeparator />
      <FieldGroup indicator="required">
        <Field>
          <FieldLabel>Card number</FieldLabel>
          <Input inputMode="numeric" autoComplete="cc-number" required />
        </Field>
        <Field>
          <FieldLabel>Billing note</FieldLabel>
          <Input />
        </Field>
      </FieldGroup>
    </div>
  )
}
