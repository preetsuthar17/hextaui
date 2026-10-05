import { AspectRatio } from "@/components/ui/aspect-ratio"

export function AspectRatioResponsive() {
  return (
    <div className="w-full max-w-md">
      <AspectRatio ratio={1} className="rounded-lg md:aspect-video">
        <img src="/preview/landscape.svg" alt="Sunset over mountains" />
      </AspectRatio>
    </div>
  )
}
