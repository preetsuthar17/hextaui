import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function FieldFieldset() {
  return (
    <FieldSet className="w-full max-w-md">
      <FieldLegend>Shipping address</FieldLegend>
      <FieldDescription>Where should we send your order?</FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel>Street address</FieldLabel>
          <Input autoComplete="street-address" />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>City</FieldLabel>
            <Input autoComplete="address-level2" />
          </Field>
          <Field>
            <FieldLabel>Postal code</FieldLabel>
            <Input autoComplete="postal-code" />
          </Field>
        </div>
      </FieldGroup>
    </FieldSet>
  )
}
