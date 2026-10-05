import { AspectRatio } from "@/components/ui/aspect-ratio"

export function AspectRatioWithoutPlaceholder() {
  return (
    <div className="w-full max-w-md">
      <AspectRatio ratio={16 / 9} placeholder={false} className="rounded-lg">
        <img src="/preview/landscape.svg" alt="Sunset over mountains" />
      </AspectRatio>
    </div>
  )
}
