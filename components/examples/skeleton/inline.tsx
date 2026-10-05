import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonInline() {
  return (
    <p className="text-sm">
      Your balance is{" "}
      <Skeleton loading render={<span />}>
        <strong>$12,480.00</strong>
      </Skeleton>{" "}
      as of today.
    </p>
  )
}
