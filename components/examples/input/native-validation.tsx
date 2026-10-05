import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InputNativeValidation() {
  return (
    <form className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex flex-col gap-2">
        <Label htmlFor="input-native-email">Email</Label>
        <Input
          id="input-native-email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="input-native-code">Invite code</Label>
        <Input
          id="input-native-code"
          name="code"
          required
          pattern="[A-Z]{4}-[0-9]{4}"
          placeholder="ABCD-1234"
        />
      </div>
      <Button type="submit" className="self-start">
        Join
      </Button>
    </form>
  )
}
