import { Skeleton, type SkeletonAnimation } from "@/components/ui/skeleton"

const animations: SkeletonAnimation[] = ["shimmer", "pulse", "none"]

export function SkeletonAnimations() {
  return (
    <div className="grid w-full max-w-md grid-cols-3 gap-3">
      {animations.map((animation) => (
        <div key={animation} className="flex flex-col gap-2">
          <Skeleton animation={animation} className="h-16 w-full" />
          <span className="text-xs text-muted-foreground">{animation}</span>
        </div>
      ))}
    </div>
  )
}
