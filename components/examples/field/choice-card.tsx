import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"

export function FieldChoiceCard() {
  return (
    <FieldSet className="w-full max-w-sm">
      <FieldLegend variant="label">Add-ons</FieldLegend>
      <div className="flex flex-col gap-3">
        <FieldLabel>
          <Field orientation="horizontal">
            <Checkbox name="backups" defaultChecked />
            <FieldContent>
              <FieldTitle>Daily backups</FieldTitle>
              <FieldDescription>
                Restore any day from the last 30.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
        <FieldLabel>
          <Field orientation="horizontal">
            <Checkbox name="support" />
            <FieldContent>
              <FieldTitle>Priority support</FieldTitle>
              <FieldDescription>Replies within four hours.</FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
        <FieldLabel>
          <Field orientation="horizontal" disabled>
            <Checkbox name="sso" />
            <FieldContent>
              <FieldTitle>Single sign-on</FieldTitle>
              <FieldDescription>
                Available on the Business plan.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
      </div>
    </FieldSet>
  )
}
