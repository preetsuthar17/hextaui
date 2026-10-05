import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonManyRows() {
  return (
    <div className="flex max-h-64 w-full max-w-sm flex-col gap-3 overflow-y-auto">
      {Array.from({ length: 50 }, (_, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}
