import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function FieldRtl() {
  return (
    <div dir="rtl" className="w-full max-w-sm">
      <FieldGroup>
        <Field invalid>
          <FieldLabel>البريد الإلكتروني</FieldLabel>
          <Input type="email" defaultValue="ada@" />
          <FieldDescription>
            سنرسل رابط التأكيد إلى هذا العنوان.
          </FieldDescription>
          <FieldError errors={[{ message: "أدخل عنوان بريد صالحًا." }]} />
        </Field>
        <Field orientation="horizontal">
          <Checkbox defaultChecked />
          <FieldLabel>تذكرني</FieldLabel>
        </Field>
      </FieldGroup>
    </div>
  )
}
