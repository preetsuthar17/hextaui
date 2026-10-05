import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function FieldValidation() {
  return (
    <Field validationMode="onBlur" className="max-w-sm">
      <FieldLabel>Password</FieldLabel>
      <Input
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
      />
      <FieldDescription>At least 8 characters.</FieldDescription>
      <FieldError match="valueMissing">Choose a password.</FieldError>
      <FieldError match="tooShort">
        That’s too short. Use 8 or more characters.
      </FieldError>
    </Field>
  )
}
