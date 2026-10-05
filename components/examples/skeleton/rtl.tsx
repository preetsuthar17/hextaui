import { Skeleton, SkeletonText } from "@/components/ui/skeleton"

export function SkeletonRtl() {
  return (
    <div dir="rtl" className="flex w-full max-w-sm items-center gap-4 text-sm">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex-1">
        <SkeletonText lines={2} />
      </div>
    </div>
  )
}
