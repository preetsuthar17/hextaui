import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function FieldDisabled() {
  return (
    <FieldSet disabled className="w-full max-w-sm">
      <FieldLegend>Billing details</FieldLegend>
      <FieldDescription>Managed by your organization’s admin.</FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel>Company</FieldLabel>
          <Input defaultValue="Acme Inc." />
        </Field>
        <Field orientation="horizontal">
          <Checkbox defaultChecked />
          <FieldLabel>Send invoices by email</FieldLabel>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
