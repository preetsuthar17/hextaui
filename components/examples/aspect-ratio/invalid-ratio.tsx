import {
  AspectRatio,
  type AspectRatioValue,
} from "@/components/ui/aspect-ratio"

export function AspectRatioInvalidRatio() {
  return (
    <div className="grid w-full max-w-md grid-cols-2 gap-3">
      <AspectRatio ratio={0} className="rounded-lg border" />
      <AspectRatio
        ratio={"abc" as AspectRatioValue}
        className="rounded-lg border"
      />
    </div>
  )
}
