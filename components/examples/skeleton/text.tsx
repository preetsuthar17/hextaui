import { SkeletonText } from "@/components/ui/skeleton"

export function SkeletonTextDemo() {
  return (
    <div className="grid w-full max-w-md grid-cols-3 gap-6">
      <div className="text-sm">
        <SkeletonText lines={3} />
      </div>
      <div className="text-lg">
        <SkeletonText lines={3} />
      </div>
      <div className="text-sm leading-8">
        <SkeletonText lines={3} />
      </div>
    </div>
  )
}
