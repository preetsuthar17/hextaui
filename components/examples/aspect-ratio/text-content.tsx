import { AspectRatio } from "@/components/ui/aspect-ratio"

export function AspectRatioTextContent() {
  return (
    <div className="w-full max-w-md">
      <AspectRatio ratio={3} className="rounded-lg border">
        <div className="absolute inset-0 grid place-items-center p-4 text-center text-sm text-muted-foreground">
          Any content can sit in the box.
        </div>
      </AspectRatio>
    </div>
  )
}
