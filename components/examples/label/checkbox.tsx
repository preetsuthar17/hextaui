import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function LabelCheckbox() {
  return (
    <div className="flex flex-col gap-4">
      <Label>
        <Checkbox defaultChecked />
        Email me when someone replies
      </Label>
      <Label>
        <Checkbox disabled />
        Weekly digest (coming soon)
      </Label>
      <div className="flex items-center gap-2">
        <Checkbox id="label-checkbox-terms" />
        <Label htmlFor="label-checkbox-terms">Accept the terms</Label>
      </div>
    </div>
  )
}
