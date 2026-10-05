import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InputDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="input-demo-email">Email</Label>
      <Input
        id="input-demo-email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
      />
    </div>
  )
}
