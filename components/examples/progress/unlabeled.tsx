import { Progress } from "@/components/ui/progress"

export function ProgressUnlabeled() {
  return (
    <div className="w-full max-w-sm">
      <Progress value={45} aria-label="Profile setup" />
    </div>
  )
}
