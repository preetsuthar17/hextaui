import { Progress, ProgressLabel } from "@/components/ui/progress"

export function ProgressIndeterminate() {
  return (
    <div className="w-full max-w-sm">
      <Progress value={null}>
        <ProgressLabel>Connecting to server…</ProgressLabel>
      </Progress>
    </div>
  )
}
