import { ProgressCircle, ProgressValue } from "@/components/ui/progress"

export function ProgressCircleDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <ProgressCircle value={25} size="sm" aria-label="Small" />
      <ProgressCircle value={50} aria-label="Default" />
      <ProgressCircle value={75} size="lg" aria-label="Large">
        <ProgressValue />
      </ProgressCircle>
      <ProgressCircle value={100} size="xl" aria-label="Extra large">
        <ProgressValue />
      </ProgressCircle>
    </div>
  )
}
