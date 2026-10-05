import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"

export function SpinnerInline() {
  return (
    <div className="flex flex-col items-start gap-4 text-sm">
      <p className="flex items-center gap-2 text-muted-foreground">
        <Spinner size="sm" aria-hidden />
        Saving changes…
      </p>
      <Badge>
        <Spinner variant="ring" aria-hidden />
        Deploying
      </Badge>
      <p className="flex items-center gap-2 text-primary">
        <Spinner size="sm" label="Syncing" />
        Spinners use the text color around them.
      </p>
    </div>
  )
}
