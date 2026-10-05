import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonShapes() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex items-center gap-4">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
      <Skeleton className="aspect-video w-full rounded-xl" />
    </div>
  )
}
