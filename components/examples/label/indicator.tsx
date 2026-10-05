import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LabelIndicator() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="label-indicator-name" indicator="optional">
          Full name
        </Label>
        <Input id="label-indicator-name" autoComplete="name" required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="label-indicator-company" indicator="optional">
          Company
        </Label>
        <Input id="label-indicator-company" autoComplete="organization" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="label-indicator-card" indicator="required">
          Card number
        </Label>
        <Input id="label-indicator-card" inputMode="numeric" required />
      </div>
    </div>
  )
}
