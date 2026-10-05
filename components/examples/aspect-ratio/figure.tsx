import { AspectRatio } from "@/components/ui/aspect-ratio"

export function AspectRatioFigure() {
  return (
    <figure className="flex w-full max-w-md flex-col gap-2">
      <AspectRatio ratio={16 / 9} className="rounded-lg">
        <img src="/preview/landscape.svg" alt="Sunset over mountains" />
      </AspectRatio>
      <figcaption className="text-xs text-muted-foreground">
        Dolomites at dusk, photographed from Seceda.
      </figcaption>
    </figure>
  )
}
