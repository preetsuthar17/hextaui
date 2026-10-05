import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function FieldResponsive() {
  return (
    <FieldGroup className="w-full max-w-xl">
      <Field orientation="responsive">
        <FieldContent>
          <FieldLabel>Display name</FieldLabel>
          <FieldDescription>Shown next to your messages.</FieldDescription>
        </FieldContent>
        <Input placeholder="Ada" className="sm:max-w-56" />
      </Field>
      <Field orientation="responsive">
        <FieldContent>
          <FieldLabel>Website</FieldLabel>
          <FieldDescription>Linked from your profile.</FieldDescription>
        </FieldContent>
        <Input placeholder="example.com" className="sm:max-w-56" />
      </Field>
    </FieldGroup>
  )
}
