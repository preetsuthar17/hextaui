import { AspectRatio } from "@/components/ui/aspect-ratio"

export function AspectRatioFlexColumn() {
  return (
    <div className="flex w-full max-w-md flex-col items-center rounded-lg border border-dashed p-3">
      <AspectRatio ratio={16 / 9} className="rounded-lg">
        <img src="/preview/landscape.svg" alt="Sunset over mountains" />
      </AspectRatio>
    </div>
  )
}
