import { AspectRatio } from "@/components/ui/aspect-ratio"

export function AspectRatioOverlay() {
  return (
    <div className="w-full max-w-md">
      <AspectRatio ratio={16 / 9} className="rounded-xl">
        <img src="/preview/landscape.svg" alt="Sunset over mountains" />
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-lg bg-background/80 px-3 py-2 text-sm backdrop-blur-sm">
          <span className="truncate font-medium">Dolomites at dusk</span>
          <a
            href="#"
            className="shrink-0 rounded-sm underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden"
          >
            View
          </a>
        </div>
      </AspectRatio>
    </div>
  )
}
