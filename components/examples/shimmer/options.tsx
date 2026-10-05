export function ShimmerOptions() {
  return (
    <div className="flex flex-col items-start gap-4 text-sm">
      <p className="shimmer text-muted-foreground shimmer-duration-1000">
        Faster: shimmer-duration-1000
      </p>
      <p className="shimmer text-muted-foreground shimmer-spread-24">
        Wider band: shimmer-spread-24
      </p>
      <p className="shimmer text-foreground shimmer-color-info">
        Tinted: shimmer-color-info
      </p>
      <p className="shimmer text-muted-foreground shimmer-angle-45">
        Steeper: shimmer-angle-45
      </p>
    </div>
  )
}
