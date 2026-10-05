import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InputDisabled() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="input-disabled">Workspace</Label>
      <Input id="input-disabled" defaultValue="Acme Inc." disabled />
    </div>
  )
}
