export function HairlineDemo() {
  return (
    <div className="grid w-full max-w-sm grid-cols-2 gap-4 text-sm">
      <div className="flex flex-col gap-2">
        <div className="flex h-24 items-center justify-center rounded-lg inset-ring-1 inset-ring-foreground/40">
          1px
        </div>
        <span className="text-center text-xs text-muted-foreground">
          inset-ring-1
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex h-24 items-center justify-center rounded-lg inset-ring-(length:--hairline) inset-ring-foreground/40">
          hairline
        </div>
        <span className="text-center text-xs text-muted-foreground">
          inset-ring-(length:--hairline)
        </span>
      </div>
    </div>
  )
}
