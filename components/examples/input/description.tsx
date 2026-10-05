import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InputDescription() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="input-username">Username</Label>
      <Input
        id="input-username"
        autoComplete="username"
        placeholder="preet"
        aria-describedby="input-username-description"
      />
      <p
        id="input-username-description"
        className="text-sm text-muted-foreground"
      >
        Shown on your profile and in mentions.
      </p>
    </div>
  )
}
