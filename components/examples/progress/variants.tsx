import {
  Progress,
  ProgressCircle,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

export function ProgressVariants() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Progress value={100} variant="success">
        <ProgressLabel>Backup complete</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={86} variant="warning">
        <ProgressLabel>Storage almost full</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={47} variant="destructive">
        <ProgressLabel>Upload failed</ProgressLabel>
        <ProgressValue />
      </Progress>
      <div className="flex items-center gap-4">
        <ProgressCircle value={100} variant="success" aria-label="Synced" />
        <ProgressCircle value={86} variant="warning" aria-label="Almost full" />
        <ProgressCircle value={47} variant="destructive" aria-label="Failed" />
      </div>
    </div>
  )
}
