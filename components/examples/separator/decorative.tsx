import { Separator } from "@/components/ui/separator"

export function SeparatorDecorative() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-3 rounded-xl border p-4 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="tabular-nums">$48.00</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Shipping</span>
        <span className="tabular-nums">$4.00</span>
      </div>
      <Separator decorative />
      <div className="flex items-center justify-between font-medium">
        <span>Total</span>
        <span className="tabular-nums">$52.00</span>
      </div>
    </div>
  )
}
