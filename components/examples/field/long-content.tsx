import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function FieldLongContent() {
  return (
    <Field invalid className="w-72">
      <FieldLabel>
        A label long enough to wrap onto a second line in a narrow form
      </FieldLabel>
      <Input defaultValue="averyveryverylongunbrokenvaluethatkeepsgoing" />
      <FieldDescription>
        averyveryverylongunbrokendescriptionthatmustwrapinsteadofoverflowing
      </FieldDescription>
      <FieldError
        errors={[
          {
            message:
              "This message is long on purpose and wraps onto several lines without pushing anything wider.",
          },
        ]}
      />
    </Field>
  )
}
