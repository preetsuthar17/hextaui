import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LabelLongContent() {
  return (
    <div className="flex w-64 max-w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="label-long" indicator="optional">
          Where should we send invoices for the international subsidiary
        </Label>
        <Input id="label-long" />
      </div>
      <Label>
        <Checkbox />
        billing-notifications@an-extremely-long-company-domain.example.com
      </Label>
    </div>
  )
}
