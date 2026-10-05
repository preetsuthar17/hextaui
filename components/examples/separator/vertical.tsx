import { Separator } from "@/components/ui/separator"

export function SeparatorVertical() {
  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex flex-col">
        <span className="font-medium tabular-nums">2,481</span>
        <span className="text-muted-foreground">Stars</span>
      </div>
      <Separator orientation="vertical" />
      <div className="flex flex-col">
        <span className="font-medium tabular-nums">164</span>
        <span className="text-muted-foreground">Forks</span>
      </div>
      <Separator orientation="vertical" />
      <div className="flex flex-col">
        <span className="font-medium tabular-nums">38</span>
        <span className="text-muted-foreground">Contributors</span>
      </div>
    </div>
  )
}
