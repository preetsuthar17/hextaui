import { ProgressCircle } from "@/components/ui/progress"

export function ProgressCircleIndeterminate() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <ProgressCircle value={null} size="sm" aria-label="Syncing" />
      <ProgressCircle value={null} aria-label="Syncing" />
      <ProgressCircle value={null} size="lg" aria-label="Syncing" />
      <ProgressCircle value={null} size="xl" aria-label="Syncing" />
    </div>
  )
}
