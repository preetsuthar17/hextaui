import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldStatus,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export function FieldStatusDemo() {
  return (
    <Field validationMode="onChange" className="max-w-sm">
      <FieldLabel>Invite code</FieldLabel>
      <InputGroup>
        <InputGroupInput
          name="code"
          pattern="HX-[0-9]{4}"
          placeholder="HX-0000"
          autoComplete="off"
        />
        <InputGroupAddon align="inline-end">
          <FieldStatus />
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Try HX-2026.</FieldDescription>
      <FieldError match="patternMismatch">
        Codes look like HX- followed by four digits.
      </FieldError>
    </Field>
  )
}
