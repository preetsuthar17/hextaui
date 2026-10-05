import { Button } from "@/components/ui/button"

export function ButtonDisabled() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button disabled>Disabled</Button>
      <Button variant="outline" disabled focusableWhenDisabled>
        Focusable when disabled
      </Button>
    </div>
  )
}
