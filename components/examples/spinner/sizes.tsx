import { Spinner } from "@/components/ui/spinner"

const sizes = ["sm", "default", "lg", "xl"] as const

export function SpinnerSizes() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-6">
        {sizes.map((size) => (
          <Spinner key={size} size={size} />
        ))}
      </div>
      <div className="flex items-center gap-6">
        {sizes.map((size) => (
          <Spinner key={size} size={size} variant="ring" />
        ))}
      </div>
    </div>
  )
}
