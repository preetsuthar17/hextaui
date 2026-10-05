import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function SeparatorVerticalLabel() {
  return (
    <div className="flex items-stretch gap-4">
      <div className="flex w-32 flex-col gap-2">
        <Button variant="outline">Upload file</Button>
        <Button variant="outline">Browse library</Button>
      </div>
      <Separator orientation="vertical">or</Separator>
      <div className="flex w-32 items-center justify-center rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
        Drop a file here
      </div>
    </div>
  )
}
