import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

export function ProgressSizes() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Progress value={15} size="xs">
        <ProgressLabel>Extra small</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={30} size="sm">
        <ProgressLabel>Small</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={55}>
        <ProgressLabel>Default</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={80} size="lg">
        <ProgressLabel>Large</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  )
}
