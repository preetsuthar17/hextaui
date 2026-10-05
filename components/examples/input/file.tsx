import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InputFile() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="input-file">Avatar</Label>
      <Input id="input-file" type="file" accept="image/*" />
    </div>
  )
}
