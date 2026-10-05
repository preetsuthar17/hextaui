import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LabelDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="label-demo-email" indicator="required">
          Email
        </Label>
        <Input
          id="label-demo-email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="label-demo-team" indicator="required">
          Team
        </Label>
        <Input id="label-demo-team" defaultValue="Design systems" disabled />
      </div>
      <Label>
        <Checkbox defaultChecked />
        Send me product updates
      </Label>
    </div>
  )
}
