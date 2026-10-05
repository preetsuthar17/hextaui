import { Separator } from "@/components/ui/separator"

export function SeparatorDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 text-sm">
      <div className="flex flex-col gap-1">
        <h4 className="font-medium">HextaUI</h4>
        <p className="text-muted-foreground">
          Components that feel great to use and to write.
        </p>
      </div>
      <Separator />
      <div className="flex h-5 items-center gap-4">
        <a href="#">Docs</a>
        <Separator orientation="vertical" />
        <a href="#">Components</a>
        <Separator orientation="vertical" />
        <a href="#">Source</a>
      </div>
    </div>
  )
}
