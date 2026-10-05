import { Checkbox } from "@/components/ui/checkbox"

export function CheckboxStates() {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <label className="flex items-center gap-3">
        <Checkbox disabled />
        Disabled
      </label>
      <label className="flex items-center gap-3">
        <Checkbox disabled defaultChecked />
        Disabled and checked
      </label>
      <label className="flex items-center gap-3">
        <Checkbox readOnly defaultChecked />
        Read-only
      </label>
      <label className="flex items-center gap-3">
        <Checkbox indeterminate />
        Indeterminate
      </label>
      <label className="flex items-center gap-3">
        <Checkbox aria-invalid />
        Invalid
      </label>
      <label className="flex items-center gap-3">
        <Checkbox aria-invalid defaultChecked />
        Invalid and checked
      </label>
    </div>
  )
}
