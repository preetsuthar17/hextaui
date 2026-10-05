import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InputReadOnly() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="input-read-only">API key</Label>
      <Input id="input-read-only" readOnly defaultValue="sk_live_51H8a…f2Qz" />
    </div>
  )
}
