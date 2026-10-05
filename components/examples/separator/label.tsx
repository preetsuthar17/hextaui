import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function SeparatorLabel() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Button>Continue with email</Button>
      <Separator>Or continue with</Separator>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline">GitHub</Button>
        <Button variant="outline">Google</Button>
      </div>
    </div>
  )
}
