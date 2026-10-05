import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InputInvalid() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="input-invalid">Email</Label>
      <Input
        id="input-invalid"
        type="email"
        defaultValue="preet@"
        aria-invalid
        aria-describedby="input-invalid-error"
      />
      <p id="input-invalid-error" className="text-sm text-destructive">
        Enter a full email address, like name@example.com.
      </p>
    </div>
  )
}
