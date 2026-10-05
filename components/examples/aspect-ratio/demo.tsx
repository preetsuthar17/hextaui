import { AspectRatio } from "@/components/ui/aspect-ratio"

export function AspectRatioDemo() {
  return (
    <div className="w-full max-w-md">
      <AspectRatio ratio={16 / 9} className="rounded-xl">
        <img src="/preview/landscape.svg" alt="Sunset over mountains" />
      </AspectRatio>
    </div>
  )
}
