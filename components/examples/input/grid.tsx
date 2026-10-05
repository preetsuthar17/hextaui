import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InputGrid() {
  return (
    <div className="grid w-full max-w-sm grid-cols-2 gap-3">
      <div className="flex min-w-0 flex-col gap-2">
        <Label htmlFor="input-first-name">First name</Label>
        <Input id="input-first-name" autoComplete="given-name" />
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <Label htmlFor="input-last-name">Last name</Label>
        <Input id="input-last-name" autoComplete="family-name" />
      </div>
    </div>
  )
}
